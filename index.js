const readline = require('readline');
const { getGeminiReply } = require('./ai'); // আপনার AI ফাইল

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("\n🤖 টেস্ট বট চালু হয়েছে! (টাইপ করুন এবং এন্টার দিন)");
console.log("--------------------------------------------------");

const askQuestion = () => {
    rl.question('You: ', async (userMessage) => {
        
        if (userMessage.toLowerCase() === 'exit') {
            console.log("👋 আল্লাহ হাফেজ!");
            rl.close();
            return;
        }

        try {
            process.stdout.write("🤖 ভাবছে..."); // লোডিং ইফেক্ট
            const aiResponse = await getGeminiReply(userMessage);
            
            // আগের লাইন মুছে উত্তর দেখানো
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            console.log(`Bot: ${aiResponse}\n`);
            
        } catch (error) {
            console.log("\n❌ Error:", error.message);
        }

        askQuestion(); // আবার প্রশ্ন চাইবে
    });
};

askQuestion();
