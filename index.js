require('dotenv').config()
const express = require('express')
const axios = require('axios')
const crypto = require("crypto")

const { PORT, API_KEY, SERVER_URL, SECRET_MD5, GOOGLE_FORMS } = process.env

// app initialization
const app = express()

// middlewares
app.use(express.json())

// Telegram API Configuration
const TELEGRAM_API = `https://api.telegram.org/bot${API_KEY}`
const URI = `/webhook/${API_KEY}`
const webhookURL = `${SERVER_URL}${URI}`

// configuring the bot via Telegram API to use our route below as webhook
const setupWebhook = async () => {
    try {
        const { data } = await axios.get(`${TELEGRAM_API}/setWebhook?url=${webhookURL}&drop_pending_updates=true`)
        console.log(`setupWebhook:`, data)
    } catch (error) {
        console.log(`Error:`, error)
        return error
    }
}

app.get('/', (req, res) => {
    res.send('Hello World!')
    console.log('Hello World!')
})


app.listen(PORT, async () => {
    // setting up our webhook url on server start
    try {
        console.log(`Server is up and Running at PORT : ${PORT}`)
        await setupWebhook()
    } catch (error) {
        console.log(error.message)
    }
})

app.post(URI,  async (req, res) => {
    try {
        const {message} = req.body
        const username = message.from.username || ''

        // console.log(`message:`, message)
        // console.log(`Message from ${username}: ${message.text}`)

        if (message.text === '/start') {
            // Typing chat action
            await axios.post(`${TELEGRAM_API}/sendChatAction`, {
                chat_id: message.chat.id,
                action: 'typing'
            })

            // Sleep for 2 seconds
            await new Promise(resolve => setTimeout(resolve, 2000))

            // Send message
            await axios.post(`${TELEGRAM_API}/sendMessage`, {
                chat_id: message.chat.id,
                text: `¡Hola ${username}!\nPara ingresar al grupo escribe:\n /ingresar`
            })
        } else if(message.text === '/ingresar') {
            // Typing chat action
            await axios.post(`${TELEGRAM_API}/sendChatAction`, {
                chat_id: message.chat.id,
                action: 'typing'
            })
            // MD5 Hash
            const MD5 = crypto.createHmac("md5", SECRET_MD5).update(message.from.id.toString()).digest("hex")
            // Sleep for 2 seconds
            await new Promise(resolve => setTimeout(resolve, 2000))
            // Send message
            await axios.post(`${TELEGRAM_API}/sendMessage`, {
                chat_id: message.chat.id,
                text: `Para ingresar al grupo es necesario que cuentes con correo @ciencias.
                \n1. Llena el siguiente formulario ${GOOGLE_FORMS + message.from.id + ',' + message.chat.id + ',' + username}
                \n2. Espera el correo de confirmación y el link por este chat.
                \n3. Si tienes problemas para ingresar envía un mensaje a @rigomortiz.`
            })
        }

        res.status(200).send('ok');
    } catch (error) {
        console.log(error.message)
    }
})
