import { createHash } from 'crypto';

const PUB = 'pub_test_Sn7wOZjlIgJQZW6Za1vUV6sw5HDQbZDf';
const INTEGRITY = 'test_integrity_KVcUHO2MwDFuLW46lws5ckTvCe1B44Ue';

function checkoutUrl(reference, amountInCents, redirectUrl, currency = 'COP') {
  const sig = createHash('sha256').update(`${reference}${amountInCents}${currency}${INTEGRITY}`).digest('hex');
  const params = [
    `public-key=${encodeURIComponent(PUB)}`,
    `currency=${currency}`,
    `amount-in-cents=${amountInCents}`,
    `reference=${encodeURIComponent(reference)}`,
    `redirect-url=${encodeURIComponent(redirectUrl)}`,
    `signature:integrity=${sig}`,
  ];
  return `https://checkout.wompi.co/p/?${params.join('&')}`;
}

console.log(checkoutUrl('CTL-123456', 3990000, 'http://localhost:3000/estado?ref=CTL-123456'));
