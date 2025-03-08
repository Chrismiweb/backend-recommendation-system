// CHAT GPT OPEN AI API


// const axios = require('axios');
// require('dotenv').config(); // Load environment variables

// const apiKey = 'api key here';

// const recommendation = async (req, res) => {
//     try {
//         const subjects = req.body.subjects;

//         // Validate input
//         if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
//             return res.status(400).json({ error: "Invalid input: subjects must be a non-empty array." });
//         }

//         const prompt = `Based on the following O'level results: ${JSON.stringify(subjects)}, recommend suitable courses for a student to study in a Nigerian university.`;

//         const response = await axios.post(
//             "https://api.openai.com/v1/chat/completions",
//             {
//                 // model: "gpt-4",
//                 model: "gpt-3.5-turbo", // Change "gpt-4" to "gpt-3.5-turbo"
//                 messages: [{ role: "user", content: prompt }],
//                 max_tokens: 200
//             },
//             {
//                 headers: {
//                     "Authorization": `Bearer ${apiKey}`,
//                     "Content-Type": "application/json"
//                 }
//             }
//         );

//         // Ensure OpenAI response is valid
//         if (response.data.choices && response.data.choices.length > 0) {
//             return res.json({ recommendations: response.data.choices[0].message.content });
//         } else {
//             return res.status(500).json({ error: "Unexpected response format from OpenAI." });
//         }
//     } catch (error) {
//         console.error("Error fetching recommendations:", error.response?.data || error.message);
//         return res.status(500).json({ error: "Failed to fetch recommendations from OpenAI." });
//     }
// };

// module.exports = { recommendation };





const axios = require("axios");
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const recommendation = async (req, res) => {
  try {
    const subjects = req.body.subjects;
    const grades = req.body.grades;

    // Validate input
    if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
      return res.status(400).json({ error: "Invalid input: subjects must be a non-empty array." });
    }

    const prompt = `Based on the following O'level results: 
      Subjects: ${JSON.stringify(subjects)} 
      Grades: ${JSON.stringify(grades)}
      list at least 10 suitable courses and the university the student can study in nigeria. please don't explain anything just list them straight up`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return res.json({ recommendations: text });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return res.status(500).json({ error: "Failed to fetch recommendations from Gemini API." });
  }
};

module.exports = { recommendation };
