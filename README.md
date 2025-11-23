# Aparecida - Sistema de Cadastro de Estabelecimentos

Sistema de cadastro de estabelecimentos com pagamento integrado via **PagBank (PagSeguro)**.

```sh
# Backend
cp server/.env.example server/.env  # configurar variáveis de ambiente
npm run dev --prefix server

# Frontend
npm run dev
```

## Funcionalidades

- Cadastro de estabelecimentos (hotéis, restaurantes, lojas religiosas, atrações turísticas)
- Sistema de assinaturas para planos de negócio
- Integração com Supabase
- Sistema de pagamentos (em desenvolvimento)
