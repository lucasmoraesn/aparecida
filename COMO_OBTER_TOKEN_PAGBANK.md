# 🔑 Como Obter Token do PagBank Sandbox

## 1️⃣ Acessar Portal do Desenvolvedor

URL: https://dev.pagseguro.uol.com.br/

## 2️⃣ Fazer Login ou Criar Conta

- Se ainda não tem conta, clique em "Criar conta"
- Se já tem, faça login

## 3️⃣ Acessar Credenciais

1. No menu lateral, clique em **"Credenciais"**
2. Ou acesse direto: https://dev.pagseguro.uol.com.br/credentials

## 4️⃣ Gerar Token de Sandbox

1. Você verá duas seções:
   - **Sandbox** (Testes)
   - **Produção** (Pagamentos reais)

2. Na seção **SANDBOX**, procure por:
   - **"Token"** ou **"Authorization Token"**
   - Pode estar escrito: **"Gerar novo token"**

3. Clique em **"Gerar Token"** ou **"Copiar Token"**

4. O token deve ter este formato:
   ```
   EXEMPLO: 7a9f3d5c-2b8e-4f1a-9c3d-5e6f8a9b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b
   ```
   (É uma string longa com hífens)

## 5️⃣ Copiar e Configurar

1. Copie o token gerado
2. Cole no arquivo `server/.env`:
   ```bash
   PAGBANK_TOKEN=SEU_TOKEN_AQUI
   ```

## ⚠️ IMPORTANTE

- Use token de **SANDBOX** para testes
- Token de **PRODUÇÃO** só quando for ao ar
- Nunca commite o token no Git
- Token expira? Verifique na documentação

## 🔍 Como Verificar se o Token está Correto

Execute este comando para testar:

```bash
curl -X GET "https://sandbox.api.pagseguro.com/public-keys" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

Se retornar dados, o token está válido! ✅
Se retornar erro 401, o token está errado ❌

## 📞 Precisa de Ajuda?

- Documentação: https://dev.pagseguro.uol.com.br/reference/autenticacao
- Suporte: suporte@pagseguro.com.br
