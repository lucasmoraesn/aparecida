import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

console.log('🔍 DEBUG app.js:');
console.log('  PUBLIC_URL_NGROK:', process.env.PUBLIC_URL_NGROK);
console.log('  SUPABASE_URL:', process.env.SUPABASE_URL);

const app = express();
app.use(express.json());
app.use(cors({ origin: ["http://localhost:5173", /\.ngrok-free\.app$/] }));

// Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
console.log('✅ Supabase client created');

// Health-check
app.get('/health', (_req, res) => res.json({ ok: true }));

/* =============================
   TODO: Este arquivo (app.js) parece ser um servidor alternativo
   que não está sendo usado atualmente. O servidor principal é index.js.
   
   Se este arquivo não for necessário, considere removê-lo.
   Se for usado, adicione aqui as rotas necessárias sem Mercado Pago.
============================= */

export default app;
