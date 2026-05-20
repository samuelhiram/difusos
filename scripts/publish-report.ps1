$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$buildScript = Join-Path $root "scripts\build-report.ps1"
$pdfSource = Join-Path $root "packages\report\main.pdf"
$publicDir = Join-Path $root "apps\web\public"
$pdfTarget = Join-Path $publicDir "sistema-difuso-mamdani.pdf"

Write-Host "==> Build del reporte LaTeX con Tectonic" -ForegroundColor Cyan
& powershell -NoProfile -ExecutionPolicy Bypass -File $buildScript
if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}

if (!(Test-Path $pdfSource)) {
  Write-Error "No se encontro $pdfSource despues del build."
  exit 1
}

if (!(Test-Path $publicDir)) {
  New-Item -ItemType Directory -Path $publicDir -Force | Out-Null
}

Copy-Item -Path $pdfSource -Destination $pdfTarget -Force
$pdfInfo = Get-Item $pdfTarget
Write-Host "==> PDF publicado: apps/web/public/sistema-difuso-mamdani.pdf ($([math]::Round($pdfInfo.Length / 1KB, 1)) KB)" -ForegroundColor Green
