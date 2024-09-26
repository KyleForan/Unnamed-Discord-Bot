const fs = require('node:fs')
const path = require('node:path')
const Discord = require('discord.js')
require('dotenv/config')

const guildId = process.env.GUILDID
const clientId = process.env.CLIENTID

module.exports = async client => {

    // Load commands from files
    client.commands = new Discord.Collection()
    
    const foldersPath = path.join(__dirname,'commands')
    const commandsFolder = fs.readdirSync(foldersPath)
    
    for (folder of commandsFolder) {
        const commandPath = path.join(foldersPath, folder)
        const commandFiles = fs.readdirSync(commandPath).filter(filename => filename.endsWith('.js'))
        
        for (file of commandFiles) {
            const filePath = path.join(commandPath, file)
            const command = require(filePath)
            
            if ('data' in command && 'execute' in command) {
                client.commands.set(command.data.name, command)
            } else {
                console.warn(`Command file [${filePath}] missing 'data' or 'execute' properties`)
            }
        }
        
    }
    

    // deploys commands
    // ? To guilds
    // TODO: command loading needs work
    commands = client.commands.map(el => {
        return el.data.toJSON()
    })

    const rest = new Discord.REST().setToken(process.env.TOKEN)

    try {
        console.log(`> Refreshing ${commands.length} application (/) commands`)

        // TODO: System to deploy commands globally and keep in development commands in test server
        const data = await rest.put(
            Discord.Routes.applicationGuildCommands(clientId, guildId),
            { body: commands}
        )

        console.log(`> Loaded ${data.length} application (/) commands`)
    } catch (err) {
        console.error(err)
    }

    



    // Executes commands when called by (/)
    client.on(Discord.Events.InteractionCreate, async interaction => {
        if (!interaction.isChatInputCommand()) return
        
        const command = interaction.client.commands.get(interaction.commandName)
        
        if (!command) {
            console.error('Command not found')
            return
        }
        
        try {
            await command.execute(interaction)            
        } catch (err) {
            console.error(err)
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
            } else {
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            }
        }
    })
    
}