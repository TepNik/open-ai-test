import { Configuration, OpenAIApi } from "openai";

import { config } from "../config.js";

const configuration = new Configuration({
  apiKey: config.openAiApi,
});
const openai = new OpenAIApi(configuration);

const textResponse = await openai.createCompletion({
    model: "text-davinci-001",
    prompt: "Write description of a picture on the theme forest.\n",
    temperature: 0.4,
    max_tokens: 240,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    n: 10
});

for(let i = 0; i < textResponse.data.choices.length; ++i) {
    const text = textResponse.data.choices[i].text;
    const imageResponse = await openai.createImage({
        prompt: text,
    });

    console.log("Text:",text, "\nImage: ", imageResponse.data.data[0].url, "\n");
}