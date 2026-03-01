const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { createEmbed } = require("../utils/embed");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("limpar")
    .setDescription("Remove mensagens do canal.")
    .addIntegerOption(opt =>
      opt.setName("quantidade")
        .setDescription("1 a 100")
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    const quantidade = interaction.options.getInteger("quantidade", true);

    const channel = interaction.channel;
    if (!channel || !channel.isTextBased()) {
      return interaction.reply({ content: "⚠️ Não posso limpar aqui.", ephemeral: true });
    }

    const deleted = await channel.bulkDelete(quantidade, true);

    const embed = createEmbed(
      "🧹 Limpeza Executada",
      `Foram removidas **${deleted.size}** mensagens para preservar a ordem.`
    );

    return interaction.reply({ embeds: [embed] });
  }
};
