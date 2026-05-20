$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$reportDir = Join-Path $root "packages\report"
$logPath = Join-Path $reportDir "main.log"
$pdfPath = Join-Path $reportDir "main.pdf"
$dataDir = Join-Path $reportDir "data"

# Verificar Tectonic
$hasTectonic = $false
try {
  Get-Command tectonic -ErrorAction Stop | Out-Null
  $hasTectonic = $true
} catch {
  $hasTectonic = $false
}

if (-not $hasTectonic) {
  $localExe = Join-Path $env:USERPROFILE "bin\tectonic.exe"
  if (Test-Path $localExe) {
    $env:Path = (Split-Path $localExe) + ";$env:Path"
    $hasTectonic = $true
  }
}

if (-not $hasTectonic) {
  Write-Host ""
  Write-Host "Tectonic no esta en el PATH. Corre 'pnpm bootstrap' para instalarlo automaticamente." -ForegroundColor Yellow
  Write-Host ""
  exit 1
}

# Generar datos derivados si faltan
if (!(Test-Path $dataDir) -or @(Get-ChildItem $dataDir -ErrorAction SilentlyContinue).Count -eq 0) {
  Write-Host "Generando datos derivados del motor TS..." -ForegroundColor Cyan
  Push-Location $root
  try {
    pnpm --filter @academic-risk/report data
    if ($LASTEXITCODE -ne 0) {
      Write-Error "emit-data fallo con codigo $LASTEXITCODE."
      exit $LASTEXITCODE
    }
  } finally {
    Pop-Location
  }
}

Push-Location $reportDir
try {
  Write-Host "Compilando con Tectonic (auto-fetch de paquetes la primera vez)..." -ForegroundColor Cyan
  # -X compile: pipeline V2 con biber automatico
  # --keep-logs: deja main.log para diagnostico
  # --keep-intermediates: deja .aux, .bbl, etc.
  # --reruns 3: hasta 3 pasadas para resolver TOC, citas, refs
  tectonic -X compile --keep-logs --keep-intermediates --reruns 3 main.tex
  if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "Tectonic fallo. Mira packages/report/main.log para detalles." -ForegroundColor Red
    exit $LASTEXITCODE
  }
} finally {
  Pop-Location
}

if (!(Test-Path $pdfPath)) {
  Write-Error "No se genero main.pdf aunque Tectonic salio con 0."
  exit 1
}

# Validaciones de calidad (no fatales, solo warning)
$strictPatterns = @(
  "! LaTeX Error:",
  "! Package .* Error:",
  "Fatal error",
  "Undefined control sequence",
  "Citation .* undefined",
  "Reference .* undefined"
)
$issues = @()
if (Test-Path $logPath) {
  foreach ($pattern in $strictPatterns) {
    $found = Select-String -Path $logPath -Pattern $pattern -ErrorAction SilentlyContinue
    foreach ($match in $found) {
      $issues += "$($match.LineNumber): $($match.Line.Trim())"
    }
  }
}

$pdf = Get-Item $pdfPath
Write-Host "Reporte OK: $($pdf.FullName) ($([math]::Round($pdf.Length / 1KB, 1)) KB)" -ForegroundColor Green

if ($issues.Count -gt 0) {
  Write-Host ""
  Write-Host "Avisos de calidad (PDF generado, pero hay refs/citas sin resolver):" -ForegroundColor Yellow
  $issues | Select-Object -First 10 | ForEach-Object { Write-Host "  $_" -ForegroundColor Yellow }
}
