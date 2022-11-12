const http = require('http');
const TelegramBot = require('node-telegram-bot-api')
const API_KEY = process.env.API_KEY

let bot = new TelegramBot(API_KEY, { polling: true });

// Create a bot that uses 'polling' to
// fetch new updates
bot.on("polling_error", (err) => console.log(err));

// The 'msg' is the received Message from user and
// 'match' is the result of execution above
// on the text content
bot.onText(/\/start (.+)/, function (msg, match) {
    bot.sendMessage(msg.chat.id, "Hey, I'm a brand new Telegram bot. I live inside a Sanity tutorial.");
});

bot.on('message', (msg) => {
    console.log(msg);
    bot.sendMessage(msg.chat.id, "Message logged to console!")
})
