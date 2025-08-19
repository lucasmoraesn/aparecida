import fs from "fs";
import fetch from "node-fetch";

const ENV_FILE = ".env.local";

async function updateEnv() {
  try {
    // pega o JSON da API do ngrok
    const res = await fetch("http://127.0.0.1:4040/api/tunnels");
    const data = await res.json();

    // pega o primeiro túnel https
    const tunnel = data.tunnels.find(t => t.public_url.startsWith("https"));
    if (!tunnel) throw new Error("Nenhum túnel HTTPS encontrado.");

    const ngrokUrl = tunnel.public_url;
    console.log("✅ URL do ngrok encontrada:", ngrokUrl);

    // lê o arquivo .env.local
    let envContent = fs.readFileSync(ENV_FILE, "utf-8");

    // substitui ou adiciona a linha
    if (envContent.includes("VITE_PUBLIC_URL_NGROK=")) {
      envContent = envContent.replace(
        /VITE_PUBLIC_URL_NGROK=.*/g,
        `VITE_PUBLIC_URL_NGROK=${ngrokUrl}`
      );
    } else {
      envContent += `\nVITE_PUBLIC_URL_NGROK=${ngrokUrl}\n`;
    }

    // salva de volta
    fs.writeFileSync(ENV_FILE, envContent, "utf-8");
    console.log("🎉 Arquivo .env.local atualizado com sucesso!");
  } catch (err) {
    console.error("❌ Erro ao atualizar:", err.message);
  }
}

updateEnv();
