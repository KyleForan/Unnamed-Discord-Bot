const { SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user')
        .setDescription('Information about the user'),
    async execute(interaction) {

        const JoinedDate = new Date(interaction.member.joinedTimestamp).toLocaleDateString()
        const username = interaction.member.nickname || interaction.user.globalName
        
        await interaction.reply({
            content: `User ${username} joined the server on ${JoinedDate}`,
            ephemeral: true
        })
    }
}