require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const AI_API_KEY = process.env.AI_API_KEY ;
const AI_API_URL = 'https://api.together.xyz/v1/chat/completions';

app.post('/api/solve', async (req, res) => {
    try {
        const { problem } = req.body;

        const response = await axios.post(
            AI_API_URL,
            {
                model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free", 
                messages: [
                    {
                        role: "system",
                        content: "You are a helpful coding assistant."
                    },
                    {
                        role: "user",
                        content: problem
                    }
                ],
                temperature: 0.7
            },
            {
                headers: {
                    'Authorization': `Bearer ${AI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.json({
            solution: response.data.choices[0].message.content
        });
    } catch (error) {
        console.error('AI API error:', error.response?.data || error.message);
        res.status(500).json({
            error: 'Failed to get solution'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
