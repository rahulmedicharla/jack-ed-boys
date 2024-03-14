const mealRoleText = "You are an assistant designed to provide the most healthy food ideas and recipes given a list of ingredients. Provide three ideas. Don't ask any questions in return make assumptions as you need."
const exerciseRoleText = "You are an assistant designed to provide the most effective exercise routines and tips. Provide the best idea. Don't ask any questions in return make assumptions as you need. Make your answers short and simple."

export type aiReturnType = {
    status: 'success' | 'error',
    message? : string,
    data?: string
}

export const submitOpenAIQuestion = async(question: string) => {

    const openaikey = process.env.EXPO_PUBLIC_AI_KEY

    try{
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${openaikey}`
            },
            method: "POST",
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: mealRoleText
                    },
                    {
                        role: "user",
                        content: question
                    }
                ]
            })
        });

        const chatCompletion = await response.json();
        
        return {
            status: 'success',
            data: chatCompletion['choices'][0]['message']['content']
        }
    }catch(e){
        return {
            status: 'error',
            message: e.message
        }
    }
}

export const submitOpenAIQuestionExercise = async(question: string) => {
    
        const openaikey = process.env.EXPO_PUBLIC_AI_KEY
    
        try{
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${openaikey}`
                },
                method: "POST",
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "system",
                            content: exerciseRoleText
                        },
                        {
                            role: "user",
                            content: question
                        }
                    ]
                })
            });
    
            const chatCompletion = await response.json();
            
            return {
                status: 'success',
                data: chatCompletion['choices'][0]['message']['content']
            }
        }catch(e){
            return {
                status: 'error',
                message: e.message
            }
        }
    }