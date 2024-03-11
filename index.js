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
    const userInput = req.body.contents[0].parts[0].text;
    sendMessage(userInput);
    getResponse(userInput)
        .then(response => {
            res.send({
                fulfillmentText: response.candidates[0].content.parts[0].text
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
    const API_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyD5LueDmR8LwoK7PcV0K4bayPjDZJGv7Ew";
    
    const data = {
        "contents": [
            {
                "parts": [
                    {
                        "text": inputText
                    }
                ]
            }
        ]
    };

    const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    if (!response.ok) {
        throw new Error("Error: Unable to fetch response from the model.");
    }

    const responseData = await response.json();
    return responseData;
};
