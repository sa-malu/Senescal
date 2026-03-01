
const { SlashCommandBuilder } = require("discord.js");
const { createEmbed } = require("../utils/embed");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warnings")
    .setDescription("Mostra as advertências de um usuário.")
    .addUserOption(opt => opt.setName("usuario").setDescription("Quem consultar").setRequired(true)),

  async execute(interaction, client) {
    if (!client.warns) client.warns = new Map();

    const targetUser = interaction.options.getUser("usuario", true);
    const lista = client.warns.get(targetUser.id) || [];

    const desc = lista.length
      ? lista.map((w, i) => `${i + 1}. ${w.motivo}`).join("\n")
      : "Nenhuma advertência registrada.";

    const embed = createEmbed("📜 Histórico de Advertências", desc, "#F1C40F");
    return interaction.reply({ embeds: [embed], ephemeral: true });
  }
};
