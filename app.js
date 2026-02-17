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
        // response_format: { type: 'json_object' },
        model: 'llama-3.3-70b-versatile',
        messages: [
            {
                //Setting persona of the llm agent
                role: 'system',
                content: `You are Jarvis, a smart personal assistant. Be always chaddi buddy and talk in hinglish. Respond in JSON format. You have access to following tools:
                1. webSearch({query}: {query: string}) // Search the latest information and realtime data on the internet`,
            },
            {
                role: "user",
                content: "When was iphone 16 launched?",
            },
        ],
        tools: [
            // Sample request body with tool definitions and messages
            {
                "type": "function",
                "function": {
                    "name": "webSearch",
                    "description": "Search the latest information and realtime data on the internet",
                    "parameters": {
                        // JSON Schema object
                        "type": "object",
                        "properties": {
                            "location": {
                                "type": "string",
                                "description": "The search query to perform search on"
                            }
                        },
                        "required": ["query"]
                    }
                }
            }

        ],
        tool_choice: 'auto'
    });

    const toolCalls = completion.choices[0].message.tool_calls;
    if(!toolCalls){
        console.log(`Assistant: ${completion.choices[0].content}`);
    }

    for(const tool of toolCalls){
        console.log(`tool:`, tool);
        const functionName = tool.function.name;
        const functionParams = tool.function.arguments;

        if(functionName === 'webSearch'){
            const toolResult = await webSearch(JSON.parse(functionParams));
            console.log(`ToolResult: `, toolResult);
        }
    }

    // console.log(JSON.stringify(completion.choices[0].message, null, 2));
}

main();

async function webSearch({ query }) {
    // Here we will do tavily api call

    console.log(`Calling web search...`)
    return 'iPhone 16 was launched on 20th September 2024';
}
