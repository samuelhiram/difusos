$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$startedAt = Get-Date

function Step($n, $title) {
  Write-Host ""
  Write-Host "==> [$n/4] $title" -ForegroundColor Cyan
}

function Done($message) {
  Write-Host "    OK: $message" -ForegroundColor Green
}

function Ensure-Tectonic {
  try {
    $existing = (Get-Command tectonic -ErrorAction Stop).Path
    Done "Tectonic ya disponible en $existing"
    return
  } catch {}

  $localBin = Join-Path $env:USERPROFILE "bin"
  $localExe = Join-Path $localBin "tectonic.exe"
  if (Test-Path $localExe) {
    $env:Path = "$localBin;$env:Path"
    Done "Tectonic encontrado en $localExe (anadido al PATH de esta sesion)"
    return
  }

  Write-Host "    Tectonic no encontrado. Descargando ultimo release oficial..." -ForegroundColor Yellow

  $arch = switch ($env:PROCESSOR_ARCHITECTURE) {
    "AMD64" { "x86_64" }
    "ARM64" { "aarch64" }
    default { "x86_64" }
  }
  $target = "$arch-pc-windows-msvc"

  $headers = @{ "User-Agent" = "academic-risk-setup" }
  $release = Invoke-RestMethod -Uri "https://api.github.com/repos/tectonic-typesetting/tectonic/releases/latest" -Headers $headers
  $asset = $release.assets | Where-Object { $_.name -match "$target\.zip$" } | Select-Object -First 1
  if (-not $asset) {
    throw "No se encontro asset '$target' en el ultimo release. Instala manual desde https://github.com/tectonic-typesetting/tectonic/releases"
  }
  Write-Host "    -> $($release.tag_name): $($asset.name) ($([math]::Round($asset.size / 1MB, 1)) MB)" -ForegroundColor DarkGray

  $zipPath = Join-Path $env:TEMP $asset.name
  Invoke-WebRequest -Uri $asset.browser_download_url -OutFile $zipPath -UseBasicParsing

  $extractDir = Join-Path $env:TEMP "tectonic-extract"
  if (Test-Path $extractDir) { Remove-Item $extractDir -Recurse -Force }
  Expand-Archive -Path $zipPath -DestinationPath $extractDir -Force

  $found = Get-ChildItem -Path $extractDir -Filter "tectonic.exe" -Recurse | Select-Object -First 1
  if (-not $found) {
    throw "No se encontro tectonic.exe en el zip descargado."
  }

  New-Item -ItemType Directory -Force -Path $localBin | Out-Null
  Move-Item -Path $found.FullName -Destination $localExe -Force

  Remove-Item $zipPath -Force -ErrorAction SilentlyContinue
  Remove-Item $extractDir -Recurse -Force -ErrorAction SilentlyContinue

  $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
  if ($userPath -notlike "*$localBin*") {
    [Environment]::SetEnvironmentVariable("Path", "$localBin;$userPath", "User")
  }
  $env:Path = "$localBin;$env:Path"

  Done "Tectonic instalado en $localExe y anadido al PATH"
}

# Pre-flight: pnpm
try {
  Get-Command pnpm -ErrorAction Stop | Out-Null
} catch {
  Write-Host "pnpm no esta instalado. Instalalo con:" -ForegroundColor Red
  Write-Host "  npm install -g pnpm" -ForegroundColor White
  exit 1
}

Step 1 "Dependencias pnpm"
Push-Location $root
try {
  pnpm install --prefer-offline --silent
  if ($LASTEXITCODE -ne 0) { throw "pnpm install fallo (exit $LASTEXITCODE)" }
  Done "node_modules listo"
} finally {
  Pop-Location
}

Step 2 "Motor LaTeX (Tectonic)"
Ensure-Tectonic

Step 3 "Reporte academico (.pdf)"
& powershell -NoProfile -ExecutionPolicy Bypass -File (Join-Path $root "scripts\publish-report.ps1")
if ($LASTEXITCODE -ne 0) { throw "Build del reporte fallo (exit $LASTEXITCODE). Revisa packages/report/main.log" }

Step 4 "Presentacion (.pptx) por defecto"
Push-Location $root
try {
  pnpm --filter @academic-risk/presentation build
  if ($LASTEXITCODE -ne 0) { throw "Build de presentacion fallo (exit $LASTEXITCODE)" }
  Done "packages/presentation/dist/sistema-difuso-mamdani.pptx generado"
} finally {
  Pop-Location
}

$elapsed = (Get-Date) - $startedAt
Write-Host ""
Write-Host "===============================================" -ForegroundColor Green
Write-Host " Setup completo en $([math]::Round($elapsed.TotalSeconds, 1))s" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Green
Write-Host ""
Write-Host "Artefactos listos:" -ForegroundColor White
Write-Host "  - apps/web/public/sistema-difuso-mamdani.pdf"
Write-Host "  - packages/presentation/dist/sistema-difuso-mamdani.pptx"
Write-Host ""
Write-Host "Para arrancar la app:" -ForegroundColor White
Write-Host "  pnpm start" -ForegroundColor Cyan
Write-Host ""
