@echo off
set VERCEL_TELEMETRY_DISABLED=1
set UPDATE_NOTIFIER=false

call npx vercel env rm WOMPI_EVENTS_SECRET production -y
call npx vercel env add WOMPI_EVENTS_SECRET production --value test_events_dzplsZ25YLGY8PcLGzRMGSptEBBgWCnn --yes

call npx vercel env rm WOMPI_INTEGRITY_SECRET production -y
call npx vercel env add WOMPI_INTEGRITY_SECRET production --value test_integrity_KVcUHO2MwDFuLW46lws5ckTvCe1B44Ue --yes

call npx vercel env rm WOMPI_CHECKOUT_URL production -y
call npx vercel env add WOMPI_CHECKOUT_URL production --value https://checkout.wompi.co/p/ --yes

call npx vercel env rm WOMPI_API_BASE production -y
call npx vercel env add WOMPI_API_BASE production --value https://sandbox.wompi.co/v1 --yes

call npx vercel env rm PRICE_COP production -y
call npx vercel env add PRICE_COP production --value 39900 --yes

call npx vercel env rm SNR_COST_COP production -y
call npx vercel env add SNR_COST_COP production --value 23000 --yes

call npx vercel env rm N8N_WEBHOOK_SECRET production -y
call npx vercel env add N8N_WEBHOOK_SECRET production --value ***REDACTED*** --yes

echo RE-DEPLOYING...
call npx vercel deploy --prod --yes
