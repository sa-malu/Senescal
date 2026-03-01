const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { createEmbed } = require("../utils/embed");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("limpar")
    .setDescription("Remove mensagens recentes do canal (1 a 100).")
    .addIntegerOption(opt =>
      opt
        .setName("quantidade")
        .setDescription("Número de mensagens (1 a 100)")
        .setMinValue(1)
        .setMaxValue(100)
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  async execute(interaction) {
    // evita “This interaction failed” por timeout
    await interaction.deferReply({ ephemeral: true });

    try {
      const quantidade = interaction.options.getInteger("quantidade", true);
      const channel = interaction.channel;

      if (!channel || !channel.isTextBased()) {
        return interaction.editReply("⚠️ Não posso limpar neste local.");
      }

      // checa permissão do BOT no canal
      const botMember = interaction.guild.members.me;
      const perms = channel.permissionsFor(botMember);
      if (!perms?.has(PermissionFlagsBits.ManageMessages)) {
        return interaction.editReply("⚠️ Eu não tenho permissão de **Gerenciar Mensagens** neste canal.");
      }

      const deleted = await channel.bulkDelete(quantidade, true);

      const embed = createEmbed(
        "🧹 Limpeza Executada",
        `Foram removidas **${deleted.size}** mensagens. (Mensagens com mais de 14 dias não podem ser apagadas em massa.)`
      );

      return interaction.editReply({ embeds: [embed] });
    } catch (err) {
      console.error("ERRO /limpar:", err);
      return interaction.editReply("⚠️ Falhei ao limpar. Veja se tenho permissão e se as mensagens são recentes.");
    }
  },
};
