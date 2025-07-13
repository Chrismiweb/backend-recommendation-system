// // both file upload and manual upload might be working here 

// const fs = require("fs");
// const path = require("path");
// const { GoogleGenerativeAI } = require("@google/generative-ai");
// require("dotenv").config();



// const apiKey = process.env.GEMINI_API_KEY;
// const genAI = new GoogleGenerativeAI(apiKey);

// const recommendation = async (req, res) => {
//   try {
//     let sampleFile, uploadPath;
//     const { subjects, grades, region, questionnaire } = req.body;

//     // **Check if file or manual input is provided**
//     if (!req.files?.sampleFile && (!subjects || !grades )) {
//       return res.status(400).json({ error: "Provide either subjects & grades or upload a result file including the region" });
//     }

//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     let prompt;
//     let fileData;

//     // **File Handling (if provided)**
//     if (req.files?.sampleFile) {
//       sampleFile = req.files.sampleFile;
//       uploadPath = path.join(__dirname, "uploads", sampleFile.name);

//       // Ensure uploads folder exists
//       if (!fs.existsSync(path.join(__dirname, "uploads"))) {
//         fs.mkdirSync(path.join(__dirname, "uploads"), { recursive: true });
//       }

//       // Save file locally
//       await sampleFile.mv(uploadPath);

//       // Read file buffer
//       const fileBuffer = fs.readFileSync(uploadPath);
//       const fileType = sampleFile.mimetype;

//       // Convert file to base64 for Gemini API
//       fileData = {
//         inlineData: {
//           mimeType: fileType,
//           data: fileBuffer.toString("base64"),
//         },
//       };

//       prompt = "Analyze this result file based on the selected region and list 10 suitable courses along with Nigerian higher institutions where they can be studied.";
//     } else {
//       // If no file, use manual input
//       prompt = `Based on these O'level results: 
//         Subjects: ${JSON.stringify(subjects)}
//         Grades: ${JSON.stringify(grades)} and this nigeria region:
//         Region: ${JSON.stringify(region)}
//         Generate a list of 10 suitable courses along with Nigerian higher institutions where they can be studied, based on the selected region. `;
//     }

//     // **AI Request**
//     const aiRequest = {
//       contents: [
//         {
//           role: "user",
//           parts: fileData ? [fileData, { text: prompt }] : [{ text: prompt }],
//         },
//       ],
//     };

//     const result = await model.generateContent(aiRequest);
//     const textResponse = await result.response.text(); // Extract response properly

//     return res.json({ recommendations: textResponse });

//   } catch (error) {
//     console.error("Error:", error);
//     return res.status(500).json({ error: "Failed to fetch recommendations from Gemini API." });
//   }
// };

// // **Express Route**
// module.exports = {recommendation}





// new recommendation backend code 

const fs = require("fs");
const path = require("path");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const recommendation = async (req, res) => {
  try {
    const { subjects, grades, region, questionnaire } = req.body;

    // Parse nested data (because it arrives as stringified JSON in multipart/form-data)
    const parsedSubjects = typeof subjects === "string" ? JSON.parse(subjects) : subjects;
    const parsedGrades = typeof grades === "string" ? JSON.parse(grades) : grades;
    const parsedQuestionnaire = typeof questionnaire === "string" ? JSON.parse(questionnaire) : questionnaire;

    let sampleFile = req.files?.sampleFile;
    let fileData = null;
    let prompt = "";

    // Validate input
    if (!sampleFile && (!parsedSubjects || !parsedGrades || !region)) {
      return res.status(400).json({
        error: "Please provide either a result file or manually input subjects, grades, and region.",
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // File-based recommendation
    if (sampleFile) {
      const uploadPath = path.join(__dirname, "uploads", sampleFile.name);

      // Ensure upload folder exists
      if (!fs.existsSync(path.join(__dirname, "uploads"))) {
        fs.mkdirSync(path.join(__dirname, "uploads"), { recursive: true });
      }

      // Save file
      await sampleFile.mv(uploadPath);

      // Prepare file for AI
      const fileBuffer = fs.readFileSync(uploadPath);
      const fileType = sampleFile.mimetype;

      fileData = {
        inlineData: {
          mimeType: fileType,
          data: fileBuffer.toString("base64"),
        },
      };

      prompt = `You are an educational advisor.
Analyze this student's O'level result file and also consider their personal interests and region to recommend suitable careers.

- Region: ${region}
- Interests & Preferences:
${JSON.stringify(parsedQuestionnaire, null, 2)}

Based on the result file (50% weight) and the interest data (50% weight), recommend atleast 13 suitable university/college courses in Nigeria.
For each course, suggest an institution and explain why it fits.`;
    }

    // Manual input
    else {
      prompt = `You are an educational advisor.
Here is a student's manually entered academic and personal interest data:

1. O'level Results:
Subjects: ${JSON.stringify(parsedSubjects)}
Grades: ${JSON.stringify(parsedGrades)}

2. Region: ${region}

3. Interests & Preferences:
${JSON.stringify(parsedQuestionnaire, null, 2)}

Using 50% academic performance and 50% user interests, recommend atleast 13 suitable career paths or university courses.
For each, suggest a Nigerian university and give a short explanation. also make it a personalized response when giving out recommendations`;
    }

    // Gemini AI request
    const aiRequest = {
      contents: [
        {
          role: "user",
          parts: fileData ? [fileData, { text: prompt }] : [{ text: prompt }],
        },
      ],
    };

    const result = await model.generateContent(aiRequest);
    const responseText = await result.response.text();

    return res.json({ recommendations: responseText });
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return res.status(500).json({
      error: "Something went wrong while generating recommendations. Please try again later.",
    });
  }
};

module.exports = { recommendation };
