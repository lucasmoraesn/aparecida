import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function atualizarParaR5() {
  console.log("💰 Atualizando plano para R$ 5,00 (valor ideal para aprovação)...\n");
  
  const { data, error } = await supabase
    .from("business_plans")
    .update({ 
      price: 5.00,
      name: "Plano de Teste R$5",
      description: "Plano de teste para validação final - R$ 5,00/mês"
    })
    .eq("id", "b6192eba-cf12-4bbf-bd91-686d961b1f13")
    .select();

  if (error) {
    console.error("❌ Erro:", error);
    return;
  }

  console.log("✅ Plano atualizado:", data);
  console.log("💰 Novo valor: R$ 5,00/mês");
  console.log("\n🎯 Por que R$ 5,00 tem maior taxa de aprovação:");
  console.log("- Valor acima do suspeito (R$ 1,00 pode ser bloqueado)");
  console.log("- Ainda é baixo para testes, mas legítimo");
  console.log("- Recomendado pelo MP para validação final");
  console.log("\n⚠️  IMPORTANTE:");
  console.log("- Use outro cartão (diferente do teste anterior)");
  console.log("- OU use outra conta Mercado Pago para pagar");
  console.log("- OU aguarde 24-48h se for conta nova no MP");
}

atualizarParaR5();
