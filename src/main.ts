import { Configuration, OpenAIApi } from 'openai';

import { config } from '../config.js';

const configuration = new Configuration({
    apiKey: config.openAiApi,
});
const openai = new OpenAIApi(configuration);

interface ImageGenerationResponse {
    text: string;
    imageUrl?: string;
    b64_json?: string;
}

async function getImagesFromText(
    initialPrompt: string,
    n: number,
): Promise<ImageGenerationResponse[]> {
    const textResponse = await openai.createCompletion({
        model: 'text-davinci-001',
        prompt: initialPrompt,
        temperature: 0.4,
        max_tokens: 240,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        n: n,
    });

    const result: ImageGenerationResponse[] = [];
    for (let i = 0; i < textResponse.data.choices.length; ++i) {
        const text = textResponse.data.choices[i].text.replace('\n', '');
        const imageResponse = await openai.createImage({
            prompt: text,
        });

        result.push({
            text,
            imageUrl: imageResponse.data.data[0].url,
            b64_json: imageResponse.data.data[0].b64_json,
        });
    }

    return result;
}

console.log(
    await getImagesFromText(
        'Write description of a picture on the theme forest.',
        1,
    ),
);
