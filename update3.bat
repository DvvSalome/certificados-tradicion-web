@echo off
set VERCEL_TELEMETRY_DISABLED=1
set UPDATE_NOTIFIER=false

echo Updating WOMPI_INTEGRITY_SECRET...
call npx vercel env rm WOMPI_INTEGRITY_SECRET production -y > NUL 2>&1
call npx vercel env add WOMPI_INTEGRITY_SECRET production --value test_integrity_KVcUHO2MwDFuLW46lws5ckTvCe1B44Ue --yes > NUL 2>&1

echo Updating WOMPI_CHECKOUT_URL...
call npx vercel env rm WOMPI_CHECKOUT_URL production -y > NUL 2>&1
call npx vercel env add WOMPI_CHECKOUT_URL production --value https://checkout.wompi.co/p/ --yes > NUL 2>&1

echo Updating WOMPI_API_BASE...
call npx vercel env rm WOMPI_API_BASE production -y > NUL 2>&1
call npx vercel env add WOMPI_API_BASE production --value https://sandbox.wompi.co/v1 --yes > NUL 2>&1

echo Updating PRICE_COP...
call npx vercel env rm PRICE_COP production -y > NUL 2>&1
call npx vercel env add PRICE_COP production --value 39900 --yes > NUL 2>&1

echo Updating SNR_COST_COP...
call npx vercel env rm SNR_COST_COP production -y > NUL 2>&1
call npx vercel env add SNR_COST_COP production --value 23000 --yes > NUL 2>&1

echo Updating N8N_WEBHOOK_SECRET...
call npx vercel env rm N8N_WEBHOOK_SECRET production -y > NUL 2>&1
call npx vercel env add N8N_WEBHOOK_SECRET production --value ***REDACTED*** --yes > NUL 2>&1

echo RE-DEPLOYING...
call npx vercel deploy --prod --yes
