const {Client, Events, GatewayIntentBits} = require('discord.js')
const setup = require('./commandHandler')

const bot = new Client({ intents: [GatewayIntentBits.Guilds] })

bot.once(Events.ClientReady, async client => {
    console.log(`> ${client.user.username} Logged in.`)
    setup(client)
})

require('dotenv/config')
bot.login(process.env.TOKEN)