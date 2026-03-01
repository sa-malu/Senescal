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
    await interaction.deferReply({ ephemeral: true });

    const quantidade = interaction.options.getInteger("quantidade", true);
    const channel = interaction.channel;

    if (!channel || !channel.isTextBased()) {
      return interaction.editReply("⚠️ Não posso limpar aqui.");
    }

    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return interaction.editReply("⚠️ Eu não tenho permissão para apagar mensagens.");
    }

    try {
      const deleted = await channel.bulkDelete(quantidade, true);

      const embed = createEmbed(
        "🧹 Limpeza Executada",
        `Foram removidas **${deleted.size}** mensagens para preservar a ordem.`
      );

      await interaction.editReply({ embeds: [embed] });

    } catch (err) {
      console.error("Erro no limpar:", err);
      await interaction.editReply("⚠️ Ocorreu um erro ao tentar limpar mensagens.");
    }
  },
};
