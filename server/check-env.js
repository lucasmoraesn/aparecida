/**
 * 🔍 Diagnóstico de variáveis de ambiente
 * Roda na EC2: node check-env.js
 */

import 'dotenv/config';

console.log('\n🔍 Diagnóstico de variáveis de ambiente\n');

const vars = [
    // Servidor
    { key: 'PORT', show: true },
    { key: 'NODE_ENV', show: true },
    { key: 'PRODUCTION_DOMAIN', show: true },
    { key: 'FRONTEND_URL', show: true },
    // Supabase
    { key: 'SUPABASE_URL', show: true },
    { key: 'SUPABASE_SECRET_KEY', show: false, altKey: 'SUPABASE_SERVICE_KEY' },
    // Stripe
    { key: 'STRIPE_SECRET_KEY', show: false },
    { key: 'STRIPE_WEBHOOK_SECRET', show: false },
    // Resend
    { key: 'RESEND_API_KEY', show: false },
    { key: 'RESEND_FROM', show: true },
    { key: 'ADMIN_EMAIL', show: true },
    // Variáveis antigas (não devem existir - REMOVIDAS)
    { key: 'AWS_REGION', show: false, shouldBeAbsent: true },
    { key: 'EMAIL_FROM', show: false, shouldBeAbsent: true },
];

let hasError = false;

for (const { key, show, shouldBeAbsent, altKey } of vars) {
    const value = process.env[key] || (altKey ? process.env[altKey] : undefined);

    if (shouldBeAbsent) {
        if (value) {
            console.log(`❌ ${key}: PRESENTE (deveria ter sido removida!)`);
            hasError = true;
        } else {
            console.log(`✅ ${key}: removida corretamente`);
        }
        continue;
    }

    if (!value) {
        console.log(`❌ ${key}: NÃO CONFIGURADA`);
        hasError = true;
    } else if (show) {
        console.log(`✅ ${key}: ${value}`);
    } else {
        console.log(`✅ ${key}: configurada (${value.length} chars)`);
    }
}

console.log('');
if (hasError) {
    console.log('⚠️  Algumas variáveis precisam de atenção. Verifique o .env na EC2.');
} else {
    console.log('🎉 Todas as variáveis estão corretas! Backend pronto para produção.');
}
console.log('');
