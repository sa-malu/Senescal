const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { createEmbed } = require("../utils/embed");
const { canPunish } = require("../utils/canPunish");
const ms = require("ms");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Silencia temporariamente um usuário.")
    .addUserOption(opt => opt.setName("usuario").setDescription("Quem será silenciado").setRequired(true))
    .addStringOption(opt => opt.setName("tempo").setDescription("Ex: 10m, 1h, 2d").setRequired(true))
    .addStringOption(opt => opt.setName("motivo").setDescription("Motivo").setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const targetUser = interaction.options.getUser("usuario", true);
    const tempo = interaction.options.getString("tempo", true);
    const motivo = interaction.options.getString("motivo") || "Sem motivo especificado.";

    const guild = interaction.guild;
    const executorMember = interaction.member;
    const botMember = guild.members.me;

    const targetMember = await guild.members.fetch(targetUser.id).catch(() => null);
    if (!targetMember) return interaction.reply({ content: "⚠️ Usuário não encontrado no servidor.", ephemeral: true });

    const duration = ms(tempo);
    if (!duration || duration < 5_000) {
      return interaction.reply({ content: "⚠️ Tempo inválido. Ex: 10m, 1h, 2d.", ephemeral: true });
    }

    const check = canPunish({
      executorMember,
      targetMember,
      botMember,
      guildOwnerId: guild.ownerId,
    });

    if (!check.ok) return interaction.reply({ content: check.reason, ephemeral: true });

    await targetMember.timeout(duration, motivo);

    const embed = createEmbed(
      "⛓️ Cidadão Silenciado",
      `${targetUser.tag} foi silenciado por **${tempo}**.\n📌 Motivo: ${motivo}`
    );

    return interaction.reply({ embeds: [embed] });
  }
};
