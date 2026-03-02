import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT = `
Você é KULO, o assistente virtual humanitário da plataforma KULONDA – Encontra Angola.
Sua missão é apoiar famílias angolanas em situações de desaparecimento de pessoas.

DIRECTRIZES:
- Seja sempre empático, claro, directo e culturalmente sensível ao contexto angolano.
- Responda SEMPRE em português de Angola.
- Forneça orientações práticas e passos concretos.
- NÚMEROS DE EMERGÊNCIA ANGOLA: Polícia 113, Bombeiros 115, SOS/SAMU 117, Protecção Civil 118.
- Nunca forneça diagnósticos médicos ou pareceres jurídicos definitivos.
- Incentive sempre o contacto com as autoridades competentes.
- Quando adequado, oriente o utilizador para funcionalidades da plataforma KULONDA.

TÓPICOS QUE DOMINA:
1. Primeiros passos ao descobrir um desaparecimento.
2. Como usar a plataforma KULONDA para registar casos e avistamentos.
3. Direitos das famílias e procedimentos junto à Polícia Nacional de Angola.
4. Apoio emocional e orientação para famílias em crise.
5. Como mobilizar a comunidade para ajudar na busca.
6. Procedimentos para crianças desaparecidas (prioridade máxima).
`;

// Use the environment variable for the API key
const apiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

export async function chatWithKULO(
  mensagem: string,
  historico: Array<{ role: "user" | "model"; parts: [{ text: string }] }> = []
) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...historico,
        { role: "user", parts: [{ text: mensagem }] }
      ],
      config: {
        systemInstruction: SYSTEM_PROMPT,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Erro ao comunicar com KULO:", error);
    return "Lamento, estou com dificuldades técnicas agora. Por favor, tente novamente mais tarde ou contacte as autoridades (113).";
  }
}
