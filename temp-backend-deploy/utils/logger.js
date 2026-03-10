/**
 * Utilitários de logging seguro
 * NUNCA loga dados sensíveis: PAN (número do cartão), CVV, validade, CPF completo
 */

/**
 * Mascara dados sensíveis para logs seguros
 * @param {Object|Array|string} data - Dados a serem mascarados
 * @returns {Object|Array|string} Dados mascarados
 */
export function maskSensitiveData(data) {
  if (!data) return data;

  // Se for string, retorna como está (não processa strings diretamente)
  if (typeof data === 'string') return data;

  // Se for array, processa cada elemento
  if (Array.isArray(data)) {
    return data.map(item => maskSensitiveData(item));
  }

  // Se não for objeto, retorna como está
  if (typeof data !== 'object') return data;

  // Clonar objeto para não modificar o original
  const masked = { ...data };

  // Mascarar PAN (Primary Account Number - número do cartão)
  if (masked.card_number || masked.cardNumber || masked.number) {
    const cardField = masked.card_number || masked.cardNumber || masked.number;
    const cardStr = String(cardField).replace(/\s/g, '');
    masked[masked.card_number ? 'card_number' : masked.cardNumber ? 'cardNumber' : 'number'] = 
      `**** **** **** ${cardStr.slice(-4)}`;
  }

  // ⚠️ NUNCA logar CVV - substituir por asteriscos
  if (masked.card_security_code || masked.cardSecurityCode || masked.security_code || masked.cvv) {
    const field = masked.card_security_code ? 'card_security_code' :
                  masked.cardSecurityCode ? 'cardSecurityCode' :
                  masked.security_code ? 'security_code' : 'cvv';
    masked[field] = '***';
  }

  // Mascarar validade do cartão
  if (masked.card_exp_month || masked.cardExpMonth || masked.exp_month) {
    const field = masked.card_exp_month ? 'card_exp_month' :
                  masked.cardExpMonth ? 'cardExpMonth' : 'exp_month';
    masked[field] = '**';
  }

  if (masked.card_exp_year || masked.cardExpYear || masked.exp_year) {
    const field = masked.card_exp_year ? 'card_exp_year' :
                  masked.cardExpYear ? 'cardExpYear' : 'exp_year';
    masked[field] = '****';
  }

  // Mascarar CPF/CNPJ (mantém apenas últimos 2 dígitos e parte do meio)
  if (masked.card_holder_tax_id || masked.cardHolderTaxId || masked.tax_id || masked.cpf || masked.cnpj) {
    const field = masked.card_holder_tax_id ? 'card_holder_tax_id' :
                  masked.cardHolderTaxId ? 'cardHolderTaxId' :
                  masked.tax_id ? 'tax_id' :
                  masked.cpf ? 'cpf' : 'cnpj';
    
    const taxId = String(masked[field]).replace(/\D/g, '');
    
    if (taxId.length === 11) {
      // CPF: ***.***.###-XX
      masked[field] = `***.***.${ taxId.slice(6, 9)}-${taxId.slice(-2)}`;
    } else if (taxId.length === 14) {
      // CNPJ: **.***.***/####-XX
      masked[field] = `**.***.***/${taxId.slice(8, 12)}-${taxId.slice(-2)}`;
    }
  }

  // Mascarar email (mostra apenas 2 primeiros caracteres e domínio)
  if (masked.payer_email || masked.email || masked.customer_email) {
    const field = masked.payer_email ? 'payer_email' :
                  masked.email ? 'email' : 'customer_email';
    
    const emailStr = String(masked[field]);
    if (emailStr.includes('@')) {
      const [local, domain] = emailStr.split('@');
      masked[field] = `${local.slice(0, 2)}***@${domain}`;
    }
  }

  // Mascarar campos aninhados (recursivo)
  if (masked.customer && typeof masked.customer === 'object') {
    masked.customer = maskSensitiveData(masked.customer);
  }

  if (masked.card && typeof masked.card === 'object') {
    masked.card = maskSensitiveData(masked.card);
  }

  if (masked.holder && typeof masked.holder === 'object') {
    masked.holder = maskSensitiveData(masked.holder);
  }

  if (masked.payment_method && typeof masked.payment_method === 'object') {
    masked.payment_method = maskSensitiveData(masked.payment_method);
  }

  if (masked.charges && Array.isArray(masked.charges)) {
    masked.charges = masked.charges.map(charge => maskSensitiveData(charge));
  }

  return masked;
}

/**
 * Logger seguro para requisições de pagamento
 * @param {string} message - Mensagem do log
 * @param {Object} data - Dados a serem logados
 */
export function safeLog(message, data) {
  const timestamp = new Date().toISOString();
  const maskedData = maskSensitiveData(data);
  
  console.log(`[${timestamp}] ${message}`);
  if (maskedData) {
    console.log(JSON.stringify(maskedData, null, 2));
  }
}

/**
 * Logger de erro seguro
 * @param {string} message - Mensagem do erro
 * @param {Error|Object} error - Erro a ser logado
 */
export function safeErrorLog(message, error) {
  const timestamp = new Date().toISOString();
  
  console.error(`[${timestamp}] ❌ ${message}`);
  
  if (error instanceof Error) {
    console.error(`  → Erro: ${error.message}`);
    if (error.stack) {
      console.error(`  → Stack: ${error.stack.split('\n').slice(0, 3).join('\n')}`);
    }
  } else if (error?.response?.data) {
    // Erro de API (axios)
    const maskedData = maskSensitiveData(error.response.data);
    console.error(`  → Status: ${error.response.status}`);
    console.error(`  → Response:`, JSON.stringify(maskedData, null, 2));
  } else {
    const maskedError = maskSensitiveData(error);
    console.error(`  → Detalhes:`, JSON.stringify(maskedError, null, 2));
  }
}
