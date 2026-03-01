
const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { createEmbed } = require("../utils/embed");
const { canPunish } = require("../utils/canPunish");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Aplica uma advertência.")
    .addUserOption(opt => opt.setName("usuario").setDescription("Quem será advertido").setRequired(true))
    .addStringOption(opt => opt.setName("motivo").setDescription("Motivo").setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction, client) {
    if (!client.warns) client.warns = new Map();

    const targetUser = interaction.options.getUser("usuario", true);
    const motivo = interaction.options.getString("motivo", true);

    const guild = interaction.guild;
    const executorMember = interaction.member;
    const botMember = guild.members.me;

    const targetMember = await guild.members.fetch(targetUser.id).catch(() => null);
    if (!targetMember) return interaction.reply({ content: "⚠️ Usuário não encontrado.", ephemeral: true });

    const check = canPunish({
      executorMember,
      targetMember,
      botMember,
      guildOwnerId: guild.ownerId,
    });

    if (!check.ok) return interaction.reply({ content: check.reason, ephemeral: true });

    if (!client.warns.has(targetUser.id)) client.warns.set(targetUser.id, []);
    client.warns.get(targetUser.id).push({ motivo, at: Date.now() });

    const embed = createEmbed(
      "⚠️ Advertência Registrada",
      `${targetUser.tag} recebeu uma advertência.\n📌 Motivo: ${motivo}`,
      "#F39C12"
    );

    return interaction.reply({ embeds: [embed] });
  }
};
