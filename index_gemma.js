const express = require('express');
const fetch = require('node-fetch-npm'); // Add this line
const webApp = express();

require('dotenv').config();

const PORT = process.env.PORT || 5000;

webApp.use(express.urlencoded({
    extended: true
}));
webApp.use(express.json());

webApp.get('/', (req, res) => {
    res.sendStatus(200);
});

webApp.post('/dialogflow', async (req, res) => {
    const userInput = req.body.queryResult.queryText;
    sendMessage(userInput);
    getResponse(userInput)
        .then(response => {
            res.send({
                fulfillmentText: response
            });
        })
        .catch(error => {
            console.error(error);
            res.send({
                fulfillmentText: "Error: Unable to fetch response from the model."
            });
        });
});

webApp.listen(PORT, () => {
    console.log(`Server is up and running at ${PORT}`);
});

const sendMessage = (message) => {
    // You can implement logging or any UI updates here if needed
};

const getResponse = async (inputText) => {
    const API_ENDPOINT = "https://api-inference.huggingface.co/models/google/gemma-7b-it";
    const HEADERS = {
        "Authorization": "Bearer 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",
        "Content-Type": "application/json"
    };

    const data = {
        "inputs": inputText
    };

    const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: HEADERS,
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Error: Unable to fetch response from the model.");
    }

    const responseData = await response.json();
    const generatedText = responseData[0].generated_text;

    const cleanedResponse = generatedText.replace(/\*/g, '');
    
    return cleanedResponse;
};
