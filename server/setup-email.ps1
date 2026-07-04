# Run once: right-click → Run with PowerShell, OR in terminal:
#   cd server
#   .\setup-email.ps1

$envPath = Join-Path $PSScriptRoot ".env"

Write-Host ""
Write-Host "=== FinBiz Gmail Setup ===" -ForegroundColor Cyan
Write-Host "You need a Gmail App Password (16 chars), NOT your normal Gmail password."
Write-Host "Get it: https://myaccount.google.com/apppasswords" -ForegroundColor Yellow
Write-Host ""

$email = Read-Host "Gmail address (default: kumarakash030528@gmail.com)"
if ([string]::IsNullOrWhiteSpace($email)) { $email = "kumarakash030528@gmail.com" }

$pass = Read-Host "Paste Gmail App Password (16 characters)" -AsSecureString
$passPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
  [Runtime.InteropServices.Marshal]::SecureStringToBSTR($pass)
)
$passPlain = $passPlain -replace '\s', ''

if ($passPlain.Length -lt 10) {
  Write-Host "Password too short. Use the full App Password." -ForegroundColor Red
  exit 1
}

$content = @"
PORT=3001
OWNER_EMAIL=$email
EMAIL_USER=$email
EMAIL_PASS=$passPlain
EMAIL_FROM=FinBiz Solutions <$email>
"@

Set-Content -Path $envPath -Value $content -Encoding UTF8 -NoNewline
Add-Content -Path $envPath -Value ""

Write-Host ""
Write-Host "Saved server/.env" -ForegroundColor Green
Write-Host "Testing SMTP..." -ForegroundColor Cyan

Set-Location $PSScriptRoot
node test-email.js

if ($LASTEXITCODE -eq 0) {
  Write-Host ""
  Write-Host "Done! Restart server: npm start" -ForegroundColor Green
  Write-Host "Open: http://localhost:3001" -ForegroundColor Green
} else {
  Write-Host "Test failed. Check App Password and 2-Step Verification on Google." -ForegroundColor Red
}
