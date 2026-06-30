$env:VERCEL_TELEMETRY_DISABLED="1"
$env:UPDATE_NOTIFIER="false"

$vars = @{
    "WOMPI_CHECKOUT_URL" = "https://checkout.wompi.co/p/"
    "WOMPI_API_BASE" = "https://sandbox.wompi.co/v1"
    "PRICE_COP" = "39900"
    "SNR_COST_COP" = "23000"
    "N8N_WEBHOOK_SECRET" = "***REDACTED***"
}

foreach ($key in $vars.Keys) {
    Write-Host "Removing $key..."
    Start-Process -FilePath "npx.cmd" -ArgumentList "vercel","env","rm",$key,"production","-y" -Wait -NoNewWindow
    
    Write-Host "Adding $key..."
    $val = $vars[$key]
    Start-Process -FilePath "npx.cmd" -ArgumentList "vercel","env","add",$key,"production","--value",$val,"--yes" -NoNewWindow
    
    Write-Host "Waiting 5 seconds for background task to complete..."
    Start-Sleep -Seconds 5
}

Write-Host "Redeploying..."
Start-Process -FilePath "npx.cmd" -ArgumentList "vercel","deploy","--prod","--yes" -NoNewWindow
Start-Sleep -Seconds 5
Write-Host "Done! Please check Vercel dashboard for deploy progress."
