$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$paths = @(
  (Join-Path $root "packages\presentation\src"),
  (Join-Path $root "packages\fuzzy-core\src")
)

function Build-Presentation {
  Push-Location $root
  try {
    pnpm --filter "@academic-risk/presentation" build
  } finally {
    Pop-Location
  }
}

Build-Presentation
Write-Host "Vigilando PPTX: fuzzy-core + presentation. Ctrl+C para salir." -ForegroundColor Green

$watchers = @()
foreach ($path in $paths) {
  $watcher = New-Object System.IO.FileSystemWatcher
  $watcher.Path = $path
  $watcher.Filter = "*.*"
  $watcher.IncludeSubdirectories = $true
  $watcher.EnableRaisingEvents = $true
  $watchers += $watcher

  foreach ($eventName in @("Changed", "Created", "Deleted", "Renamed")) {
    Register-ObjectEvent $watcher $eventName -Action {
      $global:pptxNeedsBuild = $true
    } | Out-Null
  }
}

$global:pptxNeedsBuild = $false
while ($true) {
  Start-Sleep -Milliseconds 700
  if ($global:pptxNeedsBuild) {
    $global:pptxNeedsBuild = $false
    Build-Presentation
  }
}
