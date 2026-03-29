param(
  [int]$Port = 27017
)

$ErrorActionPreference = "Stop"

$serverRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$mongoDir = Join-Path $serverRoot ".mongodb"
$pidPath = Join-Path $mongoDir "mongod.pid"

function Stop-ByPidFile {
  if (-not (Test-Path $pidPath)) {
    return $false
  }

  $pidRaw = (Get-Content -Path $pidPath -ErrorAction SilentlyContinue | Select-Object -First 1)
  if (-not $pidRaw) {
    Remove-Item $pidPath -Force -ErrorAction SilentlyContinue
    return $false
  }

  $pid = 0
  if (-not [int]::TryParse($pidRaw.Trim(), [ref]$pid)) {
    Remove-Item $pidPath -Force -ErrorAction SilentlyContinue
    return $false
  }

  $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
  if ($process -and $process.ProcessName -like "mongod*") {
    Write-Host "Stopping MongoDB PID $pid..."
    Stop-Process -Id $pid -Force
    Remove-Item $pidPath -Force -ErrorAction SilentlyContinue
    return $true
  }

  Remove-Item $pidPath -Force -ErrorAction SilentlyContinue
  return $false
}

function Stop-ByPort {
  $connections = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
  if (-not $connections) {
    return $false
  }

  $processIds = $connections | Select-Object -ExpandProperty OwningProcess -Unique
  foreach ($processId in $processIds) {
    $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
    if ($process -and $process.ProcessName -like "mongod*") {
      Write-Host "Stopping MongoDB PID $processId listening on port $Port..."
      Stop-Process -Id $processId -Force
      return $true
    }
  }

  return $false
}

$stopped = $false

try { $stopped = Stop-ByPidFile } catch { $stopped = $false }
if (-not $stopped) {
  try { $stopped = Stop-ByPort } catch { $stopped = $false }
}

if ($stopped) {
  Write-Host "MongoDB stopped."
  exit 0
}

Write-Host "MongoDB was not running on port $Port."
exit 0

