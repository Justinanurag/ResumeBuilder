import OpenAI from "openai"
const openai =new OpenAI({
    apiKey:process.env.GEMINI_API_KEY,
    baseURL:process.env.BASE_URL

})

export default ai