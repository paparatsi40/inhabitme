# InhabitMe - Deploy Script
# Uso: .\deploy.ps1 "mensaje de commit"

param(
    [Parameter(Mandatory=$false)]
    [string]$message = "Update"
)

Write-Host "🚀 InhabitMe Deploy Script" -ForegroundColor Cyan
Write-Host ""

# Git operations
Write-Host "📝 Staging changes..." -ForegroundColor Yellow
git add .

Write-Host "💾 Committing: $message" -ForegroundColor Yellow
git commit -m "$message"

Write-Host "⬆️  Pushing to production..." -ForegroundColor Yellow
git push origin production

Write-Host "🔄 Triggering Vercel deployment..." -ForegroundColor Yellow
$deployUrl = "https://api.vercel.com/v1/integrations/deploy/prj_pIlF8oUAULuSAQCIfuS54V9Vc7e2/KSVKJ26Kk8"

try {
    $response = Invoke-RestMethod -Uri $deployUrl -Method POST
    $jobId = $response.job.id
    $state = $response.job.state
    
    Write-Host "✅ Deployment triggered!" -ForegroundColor Green
    Write-Host "   Job ID: $jobId" -ForegroundColor Gray
    Write-Host "   State: $state" -ForegroundColor Gray
    Write-Host ""
    Write-Host "🌐 Monitor at: https://vercel.com/paparatsi40s-projects" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Failed to trigger deployment" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "✨ Done!" -ForegroundColor Green
