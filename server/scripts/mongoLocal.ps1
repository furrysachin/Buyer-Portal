param(
  [int]$Port = 27017,
  [string]$BindIp = "127.0.0.1"
)

$ErrorActionPreference = "Stop"

$serverRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$repoRoot = Resolve-Path (Join-Path $serverRoot "..")

$mongoDir = Join-Path $serverRoot ".mongodb"
$dbPath = Join-Path $mongoDir "data"
$logPath = Join-Path $mongoDir "mongod.local.run.log"

if (-not (Test-Path $mongoDir)) { New-Item -ItemType Directory -Path $mongoDir | Out-Null }
if (-not (Test-Path $dbPath)) { New-Item -ItemType Directory -Path $dbPath | Out-Null }

try {
  $existing = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
  if ($existing) {
    Write-Host "MongoDB already listening on $BindIp`:$Port."
    exit 0
  }
} catch {
  # Ignore if Get-NetTCPConnection isn't available (older PS / limited env).
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

Write-Host "Starting MongoDB..."
Write-Host "  mongod:   $mongodExe"
Write-Host "  dbPath:  $dbPath"
Write-Host "  logPath: $logPath"
Write-Host "  bind:    $BindIp`:$Port"
Write-Host ""
Write-Host "Keep this terminal open. Stop with Ctrl+C."
Write-Host ""

& $mongodExe `
  --dbpath "$dbPath" `
  --logpath "$logPath" `
  --logappend `
  --wiredTigerCacheSizeGB 0.25 `
  --setParameter diagnosticDataCollectionEnabled=false `
  --port $Port `
  --bind_ip "$BindIp"
