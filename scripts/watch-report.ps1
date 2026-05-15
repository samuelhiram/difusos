$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$reportDir = Join-Path $root "packages\report"
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
  latexmk -pdf -pvc -interaction=nonstopmode -file-line-error -synctex=1 main.tex
} finally {
  Pop-Location
}
