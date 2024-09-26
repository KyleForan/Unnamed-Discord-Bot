const { SlashCommandBuilder } = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Pong'),
    async execute(interaction) {

        const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true, ephemeral: true})

        await interaction.editReply({
            content: `Pong! Latency is ${sent.createdTimestamp - interaction.createdTimestamp}ms`,
            ephemeral: true
        })
    }
}