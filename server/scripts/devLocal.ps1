param(
  [int]$ApiPort = 5000,
  [int]$MongoPort = 27017
)

$ErrorActionPreference = "Stop"

$serverRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$startedMongo = $false
$mongoWasRunning = $false

try {
  $existingMongo = Get-NetTCPConnection -LocalPort $MongoPort -State Listen -ErrorAction SilentlyContinue
  $mongoWasRunning = [bool]$existingMongo
} catch {
  $mongoWasRunning = $false
}

$nodemonPath = Join-Path $serverRoot "node_modules\.bin\nodemon.cmd"

if (-not (Test-Path $nodemonPath)) {
  Write-Error "nodemon.cmd not found. Run `npm install` in the server directory and try again."
}

try {
  if (-not $mongoWasRunning) {
    & (Join-Path $PSScriptRoot "mongoLocalStart.ps1") -Port $MongoPort | Out-Null
    $startedMongo = $true
  } else {
    Write-Host "Using existing MongoDB on 127.0.0.1:$MongoPort."
  }

  $env:PORT = "$ApiPort"
  $env:MONGO_URI = "mongodb://127.0.0.1:$MongoPort/luxury-estate-portal"

  Write-Host "Starting API on port $ApiPort (local MongoDB on $MongoPort) with nodemon..."
  Set-Location $serverRoot
  & $nodemonPath "server.js"
} finally {
  if ($startedMongo) {
    try {
      & (Join-Path $PSScriptRoot "mongoLocalStop.ps1") -Port $MongoPort | Out-Null
    } catch {
      # ignore
    }
  }
}
