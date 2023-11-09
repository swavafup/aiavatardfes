const express = require('express');
const { Configuration, OpenAIApi } = require("openai");

require('dotenv').config();

const webApp = express();

webApp.use(express.urlencoded({
    extended: true
}));
webApp.use(express.json());

const PORT = process.env.PORT || 5000;

var data = Buffer.from('c2staUE2cG5aWE1Pc3ZxUGc0TXZZdVhUM0JsYmtGSnRrTHEzUHVGcUVvZVZlY2lLTENy', 'base64')

var decoded_data = data.toString();

const configuration = new Configuration({
    apiKey: decoded_data,
});

const openai = new OpenAIApi(configuration);

const textGeneration = async (prompt) => {

    try {
        const response = await openai.createCompletion({
            model: 'text-davinci-003',
            prompt: `Human: ${prompt}\nAI: `,
            temperature: 0.5,
            max_tokens: 200,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0.6,
            stop: ['Human:', 'AI:']
        });

        return {
            status: 1,
            response: 'For IT Marathon 2023, our theme is AI for a Sustainable Future. We are excited to have projects from various schools, in which we have around 120 schools participated in this marathon with more than 300 students. This competition will inspire creative thinking and effective collaboration, fostering young tech enthusiasts. We are proud to be your partners in this exciting journey. I believe every participant today will enjoy todays event. Now I would like to invite Asma to take over the stage.'
	    //response: `${response.data.choices[0].text}`
        };
    } catch (error) {
        return {
            status: 0,
            response: ''
        };
    }
};

const formatResponseForDialogflow = (texts, sessionInfo, targetFlow, targetPage) => {

    messages = []

    texts.forEach(text => {
        messages.push(
            {
                text: {
                    text: [text],
                }
				  
											   
									   
            }
        );
    });

    let responseData = {
        fulfillmentMessages: messages
							  
		 
    };

							 


    return responseData
};

const getErrorMessage = () => {

    return formatResponseForDialogflow(
        [
            'We are facing a technical issue.'
        ],
        '',
        '',
        ''
    );
};

webApp.get('/', (req, res) => {
    res.sendStatus(200);
});


webApp.post('/dialogflow', async (req, res) => {
    
    let action = req.body.queryResult.action;
    let queryText = req.body.queryResult.queryText;

    if (action === 'input.unknown') {
        let result = await textGeneration(queryText);
        if (result.status == 1) {
            res.send(
                {
                    fulfillmentText: result.response
                }
            );
        } else {
            res.send(
                {
                    fulfillmentText: `Sorry, I'm not able to help with that.`
                }
            );
        }
    } else {
        res.send(
            {
                fulfillmentText: `No handler for the action ${action}.`
            }
        );
    }
});




webApp.listen(PORT, () => {
    console.log(`Server is up and running at ${PORT}`);
});
