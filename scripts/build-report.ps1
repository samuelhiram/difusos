$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$reportDir = Join-Path $root "packages\report"
$logPath = Join-Path $reportDir "main.log"
$pdfPath = Join-Path $reportDir "main.pdf"

$miktexBin = Join-Path $env:LOCALAPPDATA "Programs\MiKTeX\miktex\bin\x64"
$perlBin = "C:\Strawberry\perl\bin"
$perlCBin = "C:\Strawberry\c\bin"

foreach ($path in @($miktexBin, $perlBin, $perlCBin)) {
  if (Test-Path $path) {
    $env:Path = "$path;$env:Path"
  }
}

Push-Location $reportDir
try {
  latexmk -pdf -interaction=nonstopmode -file-line-error main.tex
  if ($LASTEXITCODE -ne 0) {
    exit $LASTEXITCODE
  }
} finally {
  Pop-Location
}

if (!(Test-Path $pdfPath)) {
  Write-Error "No se genero main.pdf"
  exit 1
}

$log = Get-Content $logPath -Raw
$patterns = @(
  "! LaTeX Error:",
  "! Package .* Error:",
  "Fatal error",
  "Emergency stop",
  "Undefined control sequence",
  "Citation .* undefined",
  "Reference .* undefined",
  "There were undefined citations",
  "Rerun to get citations correct",
  "Overfull \\hbox",
  "Underfull \\hbox"
)

$issues = @()
foreach ($pattern in $patterns) {
  $matches = Select-String -Path $logPath -Pattern $pattern
  foreach ($match in $matches) {
    $issues += "$($match.LineNumber): $($match.Line.Trim())"
  }
}

if ($issues.Count -gt 0) {
  Write-Host "Reporte compilado, pero no pasa control visual/tecnico:" -ForegroundColor Red
  $issues | Select-Object -First 40 | ForEach-Object { Write-Host "  $_" -ForegroundColor Red }
  exit 1
}

$pdf = Get-Item $pdfPath
Write-Host "Reporte OK: $($pdf.FullName) ($([math]::Round($pdf.Length / 1KB, 1)) KB)" -ForegroundColor Green
