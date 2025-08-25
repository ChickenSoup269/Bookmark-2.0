// lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY as string
)
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

export async function sendMessageToGemini(
  history: string,
  userMessage: string
) {
  const prompt = `
Bạn là chatbot quản lý bookmark. 
Nếu người dùng muốn thêm bookmark, hãy TRẢ VỀ JSON trong code block markdown (dùng \`\`\`json ... \`\`\`).
JSON phải có dạng:
{
  "action": "add",
  "url": "https://...",
  "title": "..."
}

Nếu người dùng muốn xoá bookmark:
{
  "action": "delete",
  "url": "https://..."  // hoặc "id": "xxx"
}

Nếu không liên quan bookmark thì chỉ trả lời bình thường, không trả JSON.

---
Lịch sử chat:
${history}

User: ${userMessage}
`

  const result = await model.generateContent(prompt)

  return result.response.text()
}
