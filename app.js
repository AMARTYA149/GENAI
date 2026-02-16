import 'dotenv/config';
import OpenAI from "openai";

const apiKey = process.env.GROQ_API_KEY;

const groq = new OpenAI({
    apiKey: apiKey,
    baseURL: "https://api.groq.com/openai/v1",
});

async function main() {
    const completion = await groq.chat.completions.create({
        temperature: 0,
        // frequency_penalty: 1,
        response_format: {type: 'json_pobject'},
        model: 'llama-3.3-70b-versatile',
        messages: [
            {
                //Setting persona of the llm agent
                role: 'system',
                content: `You are Jarvis, a smart personal assistant. Be always chaddi buddy and talk in hinglish. Respond in JSON format`
            },
            {
                role: "user",
                content: "Who are you?",
            },
        ],
    });

    console.log(completion.choices[0].message);
}

main();
