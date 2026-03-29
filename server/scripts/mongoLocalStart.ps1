param(
  [int]$Port = 27017,
  [string]$BindIp = "127.0.0.1",
  [int]$WaitSeconds = 15
)

$ErrorActionPreference = "Stop"

$serverRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$mongoDir = Join-Path $serverRoot ".mongodb"
$dbPath = Join-Path $mongoDir "data"
$logPath = Join-Path $mongoDir "mongod.local.bg.log"
$pidPath = Join-Path $mongoDir "mongod.pid"

if (-not (Test-Path $mongoDir)) { New-Item -ItemType Directory -Path $mongoDir | Out-Null }
if (-not (Test-Path $dbPath)) { New-Item -ItemType Directory -Path $dbPath | Out-Null }

try {
  $existing = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
  if ($existing) {
    Write-Host "MongoDB already listening on $BindIp`:$Port."
    exit 0
  }
} catch {
  # ignore
}

$mongodCmd = Get-Command mongod -ErrorAction SilentlyContinue
$mongodExe = $mongodCmd?.Source

if (-not $mongodExe) {
  $candidates = @(
    Get-ChildItem "C:\\Program Files\\MongoDB\\Server\\*\\bin\\mongod.exe" -ErrorAction SilentlyContinue
    Get-ChildItem "C:\\Program Files (x86)\\MongoDB\\Server\\*\\bin\\mongod.exe" -ErrorAction SilentlyContinue
  ) | Where-Object { $_ } | Sort-Object FullName -Descending

  $mongodExe = $candidates | Select-Object -First 1 | ForEach-Object { $_.FullName }
}

if (-not $mongodExe -or -not (Test-Path $mongodExe)) {
  Write-Error "mongod.exe not found. Install MongoDB Community Server and try again."
}

$argStr = "--dbpath `"$dbPath`" --logpath `"$logPath`" --logappend --wiredTigerCacheSizeGB 0.25 --setParameter diagnosticDataCollectionEnabled=false --port $Port --bind_ip $BindIp"

$process = Start-Process -FilePath $mongodExe -ArgumentList $argStr -WorkingDirectory $serverRoot -PassThru -WindowStyle Hidden
Set-Content -Path $pidPath -Value $process.Id -Encoding ascii

$deadline = (Get-Date).AddSeconds($WaitSeconds)
do {
  Start-Sleep -Milliseconds 300

  $running = Get-Process -Id $process.Id -ErrorAction SilentlyContinue
  if (-not $running) {
    $tail = $null
    if (Test-Path $logPath) {
      $tail = (Get-Content -Path $logPath -Tail 30) -join [Environment]::NewLine
    }

    $tailText = "(no log output)"
    if ($tail) { $tailText = $tail }

    Write-Error ("MongoDB process exited early (PID {0}).{1}{2}" -f $process.Id, [Environment]::NewLine, $tailText)
  }

  try {
    $listener = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
    if ($listener) {
      Write-Host "MongoDB started on $BindIp`:$Port (PID $($process.Id))."
      exit 0
    }
  } catch {
    # ignore
  }

  if (Test-Path $logPath) {
    $startedByLog = Select-String -Path $logPath -Pattern 'Waiting for connections|Listening on|mongod startup complete' -Quiet
    if ($startedByLog) {
      Write-Host "MongoDB started on $BindIp`:$Port (PID $($process.Id))."
      exit 0
    }
  }
} while ((Get-Date) -lt $deadline)

Write-Error "MongoDB did not start within ${WaitSeconds}s. Check logs at: $logPath"
