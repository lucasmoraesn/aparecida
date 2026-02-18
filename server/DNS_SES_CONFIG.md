# Configuração DNS — Amazon SES para aparecidadonortesp.com.br

> **Importante:** Use **somente** os registros abaixo. Remova qualquer registro de outros provedores de e-mail (ex: `resend._domainkey`, MX do Resend, etc.).

---

## 1. Verificação de Domínio — DKIM (3 CNAMEs)

O Amazon SES gera 3 registros CNAME únicos para seu domínio.  
Acesse: **AWS Console → SES (us-east-2) → Verified Identities → aparecidadonortesp.com.br → DKIM**

Os registros terão o formato abaixo (os valores `XXXX...` são gerados pelo SES para você):

| Tipo  | Nome (Host)                                          | Valor (Destino)                                   |
|-------|------------------------------------------------------|---------------------------------------------------|
| CNAME | `XXXXXXXXXXXX._domainkey.aparecidadonortesp.com.br`  | `XXXXXXXXXXXX.dkim.amazonses.com`                 |
| CNAME | `YYYYYYYYYYYY._domainkey.aparecidadonortesp.com.br`  | `YYYYYYYYYYYY.dkim.amazonses.com`                 |
| CNAME | `ZZZZZZZZZZZZ._domainkey.aparecidadonortesp.com.br`  | `ZZZZZZZZZZZZ.dkim.amazonses.com`                 |

> ⚠️ Copie os valores **exatos** do painel SES — eles são únicos para sua conta.

---

## 2. MAIL FROM customizado — Registro MX

Permite que o SES use `mail.aparecidadonortesp.com.br` como subdomínio de envio.

| Tipo | Nome (Host)                           | Valor                                     | Prioridade |
|------|---------------------------------------|-------------------------------------------|------------|
| MX   | `mail.aparecidadonortesp.com.br`      | `feedback-smtp.us-east-2.amazonses.com`   | `10`       |

---

## 3. SPF — Autorização de envio

Autoriza o SES a enviar e-mails pelo subdomínio `mail`.

| Tipo | Nome (Host)                      | Valor                                  |
|------|----------------------------------|----------------------------------------|
| TXT  | `mail.aparecidadonortesp.com.br` | `"v=spf1 include:amazonses.com ~all"`  |

---

## 4. DMARC — Política de autenticação

Protege o domínio contra spoofing e phishing.

| Tipo | Nome (Host)                        | Valor                                                                  |
|------|------------------------------------|------------------------------------------------------------------------|
| TXT  | `_dmarc.aparecidadonortesp.com.br` | `"v=DMARC1; p=quarantine; rua=mailto:dmarc@aparecidadonortesp.com.br"` |

> Comece com `p=none` para monitorar sem bloquear, depois mude para `p=quarantine` ou `p=reject`.

---

## Resumo dos Registros

```
# DKIM (3 CNAMEs — valores gerados pelo SES no painel)
CNAME  XXXXXXXXXXXX._domainkey.aparecidadonortesp.com.br  →  XXXXXXXXXXXX.dkim.amazonses.com
CNAME  YYYYYYYYYYYY._domainkey.aparecidadonortesp.com.br  →  YYYYYYYYYYYY.dkim.amazonses.com
CNAME  ZZZZZZZZZZZZ._domainkey.aparecidadonortesp.com.br  →  ZZZZZZZZZZZZ.dkim.amazonses.com

# MAIL FROM (MX)
MX     mail.aparecidadonortesp.com.br  →  feedback-smtp.us-east-2.amazonses.com  (prioridade 10)

# SPF
TXT    mail.aparecidadonortesp.com.br  →  "v=spf1 include:amazonses.com ~all"

# DMARC
TXT    _dmarc.aparecidadonortesp.com.br  →  "v=DMARC1; p=quarantine; rua=mailto:dmarc@aparecidadonortesp.com.br"
```

---

## Verificação

Após adicionar os registros DNS (propagação pode levar até 72h):

1. Acesse **AWS Console → SES (us-east-2) → Verified Identities**
2. O status do domínio deve mudar para **"Verified"**
3. Execute o script de teste **na instância EC2**:
   ```bash
   cd /caminho/para/server
   node scripts/test-ses-email.js seu@email.com
   ```

---

## IAM Role da EC2 — Permissões Necessárias

Crie ou edite a IAM Role associada à sua instância EC2 e adicione a seguinte política inline:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ses:SendEmail",
        "ses:SendRawEmail"
      ],
      "Resource": "*"
    }
  ]
}
```

> **Nenhuma credencial AWS é necessária no `.env`.**  
> O SDK detecta automaticamente a IAM Role via Instance Metadata Service (IMDS).

---

## Saindo do Sandbox SES

Por padrão, o SES está em **modo sandbox** (só envia para e-mails verificados).  
Para produção, solicite saída do sandbox:

**AWS Console → SES (us-east-2) → Account Dashboard → Request Production Access**

Preencha o formulário explicando o caso de uso (e-mails transacionais de SaaS).
