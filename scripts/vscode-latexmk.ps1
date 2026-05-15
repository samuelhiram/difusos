param(
  [Parameter(Mandatory = $true)]
  [string]$Doc
)

$ErrorActionPreference = "Stop"

$miktexBin = Join-Path $env:LOCALAPPDATA "Programs\MiKTeX\miktex\bin\x64"
$perlBin = "C:\Strawberry\perl\bin"
$perlCBin = "C:\Strawberry\c\bin"

foreach ($path in @($miktexBin, $perlBin, $perlCBin)) {
  if (Test-Path $path) {
    $env:Path = "$path;$env:Path"
  }
}

$docPath = Resolve-Path $Doc
$docDir = Split-Path -Parent $docPath
$docName = Split-Path -Leaf $docPath

Push-Location $docDir
try {
  latexmk -pdf -interaction=nonstopmode -file-line-error -synctex=1 $docName
  exit $LASTEXITCODE
} finally {
  Pop-Location
}
