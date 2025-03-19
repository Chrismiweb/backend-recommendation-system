// both file upload and manual upload might be working here 

const fs = require("fs");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();



const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const recommendation = async (req, res) => {
  try {
    let sampleFile, uploadPath;
    const { subjects, grades, region } = req.body;

    // **Check if file or manual input is provided**
    if (!req.files?.sampleFile && (!subjects || !grades || !region)) {
      return res.status(400).json({ error: "Provide either subjects & grades or upload a result file including the region" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let prompt;
    let fileData;

    // **File Handling (if provided)**
    if (req.files?.sampleFile) {
      sampleFile = req.files.sampleFile;
      uploadPath = path.join(__dirname, "uploads", sampleFile.name);

      // Ensure uploads folder exists
      if (!fs.existsSync(path.join(__dirname, "uploads"))) {
        fs.mkdirSync(path.join(__dirname, "uploads"), { recursive: true });
      }

      // Save file locally
      await sampleFile.mv(uploadPath);

      // Read file buffer
      const fileBuffer = fs.readFileSync(uploadPath);
      const fileType = sampleFile.mimetype;

      // Convert file to base64 for Gemini API
      fileData = {
        inlineData: {
          mimeType: fileType,
          data: fileBuffer.toString("base64"),
        },
      };

      prompt = "Analyze this result file and List 10 suitable courses and the Nigerian higher institution where they can be studied. but after analyzing it highlight the subject you saw , then you recommend";
    } else {
      // If no file, use manual input
      prompt = `Based on these O'level results: 
        Subjects: ${JSON.stringify(subjects)}
        Grades: ${JSON.stringify(grades)} and this nigeria region:
        Region: ${JSON.stringify(region)}
        List 10 suitable courses and the Nigerian higher institution where they can be studied including the region inputed. No explanations, just list them. but after analyzing it highlight the subject you saw , then you recommend`;
    }

    // **AI Request**
    const aiRequest = {
      contents: [
        {
          role: "user",
          parts: fileData ? [fileData, { text: prompt }] : [{ text: prompt }],
        },
      ],
    };

    const result = await model.generateContent(aiRequest);
    const textResponse = await result.response.text(); // Extract response properly

    return res.json({ recommendations: textResponse });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Failed to fetch recommendations from Gemini API." });
  }
};

// **Express Route**
module.exports = {recommendation}







// yesterday code 


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





//////////////////////////////////////////////////////////////////////////////////
// manual subject and grade upload 


// const axios = require("axios");
// require("dotenv").config();
// const { GoogleGenerativeAI } = require("@google/generative-ai");
// // const fileUpload = require("express-fileupload");


// // app.use(fileUpload())

// const apiKey = process.env.GEMINI_API_KEY;
// const genAI = new GoogleGenerativeAI(apiKey);

// const recommendation = async (req, res) => {
//   try {
//     const subjects = req.body.subjects;
//     const grades = req.body.grades
//     let sampleFile;
//     let uploadPath;
    
//     // Validate input
//     if (!subjects || !Array.isArray(subjects) || subjects.length === 0) {
//       return res.status(400).json({ error: "Invalid input: subjects must be a non-empty array." });
//     }

//     if (!req.files || Object.keys(req.files).length === 0) {
//       res.status(400).send('No files were uploaded.');
//       return;
//     }
//     console.log('req.files >>>', req.files); // eslint-disable-line

//     sampleFile = req.files.sampleFile;

//     uploadPath = __dirname + '/upload/' + sampleFile.name;

//     sampleFile.mv(uploadPath, function(err) {
//       if (err) {
//         return res.status(500).send(err);
//       }
//     })

//     // upload file to gemini 

//     const fileUploadResponse = await model.uploadFile({
//       name: sampleFile.name,
//       mimeType: sampleFile.mimetype, // Detect file type automatically
//       data: fileBuffer,
//     });




//     const prompt = `Based on the following O'level results: 
//       Subjects: ${JSON.stringify(subjects)} 
//       Grades: ${JSON.stringify(grades)}
//       sampleFile : ${JSON.stringify(sampleFile)}
//       list at least 10 suitable courses and the university the student can study in nigeria. please don't explain anything just list them straight up`;


//       // Request AI Response

//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
//     const result = await model.generateContent({
//       contents: [
//         { file_data: { file: fileResource.name } }, // Reference uploaded file
//         { text: prompt }
//       ]
//     });
//     const response = await result.response;
//     const text = response.text();

//     return res.json({ recommendations: text });
//   } catch (error) {
//     console.error("Error fetching recommendations:", error);
//     return res.status(500).json({ error: "Failed to fetch recommendations from Gemini API." });
//   }
// };

// module.exports = { recommendation };
