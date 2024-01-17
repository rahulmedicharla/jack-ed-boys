const roleText = "You are an assistant designed to provide the most healthy food ideas and recipes given a list of ingredients. Provide three ideas."

export type aiReturnType = {
    status: 'success' | 'error',
    message? : string,
    data?: string
}

export const submitOpenAIQuestion = async(question: string, openaikey: string) => {

    const messages = [
        {
            role: "system",
            content: roleText
        },
        {
            role: "user",
            content: question
        }
    ]

    try{

        /*

        NOT WORKING, NTBD

        */

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            headers: {
                ContentType: "application/json",
                Authorization: `Bearer ${openaikey}`
            },
            method: "POST",
            body:JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: messages,
            }),
            
        })

        const chatCompletion = await response.json()
        console.log(chatCompletion)
        console.log(chatCompletion['choices'][0]['message']['content'])
    
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