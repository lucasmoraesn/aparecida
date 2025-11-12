import axios from "axios";
import dotenv from "dotenv";

// Garantir que variáveis de ambiente estão carregadas
dotenv.config();

// Criar cliente HTTP para API do PagBank
// Formato correto: Authorization: TOKEN_DIRETO (sem "Bearer")
export const pagbankClient = axios.create({
  baseURL: process.env.PAGBANK_BASE_URL || "https://sandbox.api.pagseguro.com",
  headers: {
    Authorization: process.env.PAGBANK_TOKEN,
    "Content-Type": "application/json",
  },
  timeout: 30000,
});
