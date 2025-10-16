(async () => {
  try {
    // Node 18+ has fetch; if not, this script will attempt to import node-fetch
    if (typeof fetch === 'undefined') {
      try {
        const mod = await import('node-fetch');
        global.fetch = mod.default;
      } catch (e) {
        console.error('fetch não disponível e node-fetch não pôde ser importado', e);
        process.exit(1);
      }
    }

    const url = 'http://localhost:3001/api/create-subscription';
    const body = {
      planTitle: 'Teste Automático',
      amount: 1.0,
      frequency: 1,
      frequency_type: 'months',
      payer_email: 'test_user_7399030955017435892@testuser.com'
    };

    console.log('Enviando POST para', url, '\npayload:', body);
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const text = await resp.text();
    let parsed = null;
    try { parsed = JSON.parse(text); } catch (e) { parsed = text; }

    console.log('Status:', resp.status);
    console.log('Response body:', parsed);
    process.exit(resp.ok ? 0 : 2);
  } catch (err) {
    console.error('Erro ao executar teste:', err);
    process.exit(3);
  }
})();
