const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { createEmbed } = require("../utils/embed");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Remove o banimento de um usuário pelo ID.")
    .addStringOption(opt => opt.setName("id").setDescription("ID do usuário").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const id = interaction.options.getString("id", true);

    await interaction.guild.members.unban(id).catch(() => null);

    const embed = createEmbed(
      "⚖️ Perdão Concedido",
      "O cidadão foi readmitido ao reino.",
      "#2ECC71"
    );

    return interaction.reply({ embeds: [embed] });
  }
};
