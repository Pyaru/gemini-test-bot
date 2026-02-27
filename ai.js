require('dotenv').config(); // .env ফাইল লোড করা
const { GoogleGenerativeAI } = require("@google/generative-ai");

// API Key নেওয়া
const API_KEY = process.env.GEMINI_API_KEY; 

if (!API_KEY) {
    console.error("❌ Error: GEMINI_API_KEY পাওয়া যাচ্ছে না! .env ফাইল চেক করুন।");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "Gemini 2.5 Flash" });

// ১. মেইন AI রিপ্লাই ফাংশন
async function getGeminiReply(userMessage) {
    try {
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: "তুমি একজন ইসলামিক লাইব্রেরি অ্যাসিস্ট্যান্ট। তোমার নাম 'মাকতাবা বট'। সবসময় বাংলা ভাষায় ভদ্র ও সংক্ষিপ্ত উত্তর দেবে। সালাম দিলে ওয়ালাইকুমুস সালাম বলবে।" }],
                },
                {
                    role: "model",
                    parts: [{ text: "জি, আমি বুঝতে পেরেছি। আমি ইনশাআল্লাহ সবসময় ইসলামিক আদব রক্ষা করে সংক্ষিপ্ত ও সঠিক উত্তর দেওয়ার চেষ্টা করব।" }],
                },
            ],
        });

        const result = await chat.sendMessage(userMessage);
        const response = await result.response;
        return response.text();

    } catch (error) {
        console.error("Gemini Error:", error.message);
        return "দুঃখিত, আমি এখন উত্তর দিতে পারছি না।";
    }
}

// ২. কিওয়ার্ড বের করার ফাংশন
async function extractBookKeyword(userText) {
    try {
        const prompt = `Extract only the book name or topic from: "${userText}". Output ONLY the name in Bengali. If no book, return "NULL".`;
        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        return text.includes("NULL") ? userText : text.replace(/['"*]+/g, '');
    } catch (error) {
        return userText;
    }
}

module.exports = { getGeminiReply, extractBookKeyword };
