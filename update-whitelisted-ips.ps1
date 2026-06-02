param(
  [string]$Ips = "41.143.153.54,8.8.8.8"
)

$envFile = "backend/.env"
if (-not (Test-Path $envFile)) {
  Write-Error "$envFile not found. Run this from the repository root."
  exit 1
}

$ts = Get-Date -Format "yyyyMMddHHmmss"
$backup = "$envFile.bak.$ts"
Copy-Item -Path $envFile -Destination $backup -Force
Write-Output "Backup created: $backup"

# Update or append WHITELISTED_IPS
$content = Get-Content $envFile -Raw
if ($content -match '(?m)^WHITELISTED_IPS=') {
  $content = $content -replace '(?m)^WHITELISTED_IPS=.*', "WHITELISTED_IPS=$Ips"
  Set-Content -Path $envFile -Value $content -Force
  Write-Output "Updated WHITELISTED_IPS to $Ips"
} else {
  Add-Content -Path $envFile -Value "`nWHITELISTED_IPS=$Ips"
  Write-Output "Appended WHITELISTED_IPS=$Ips"
}

# Restart backend using docker-compose or Docker Compose plugin
if (Get-Command docker-compose -ErrorAction SilentlyContinue) {
  & docker-compose up -d --build backend
  & docker-compose logs -f backend --tail 200
} elseif (Get-Command docker -ErrorAction SilentlyContinue) {
  & docker compose up -d --build backend
  & docker compose logs -f backend --tail 200
} else {
  Write-Error "docker-compose or Docker Compose plugin not found. Please restart backend manually."
  exit 1
}
