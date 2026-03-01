const { PermissionsBitField } = require("discord.js");
const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { createEmbed } = require("../utils/embed");
const { canPunish } = require("../utils/canPunish");

module.exports = {
  name: "ban",
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers))
      return message.reply("⚠️ Permissão insuficiente.");
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bane um usuário do reino.")
    .addUserOption(opt => opt.setName("usuario").setDescription("Quem será banido").setRequired(true))
    .addStringOption(opt => opt.setName("motivo").setDescription("Motivo do ban").setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    const member = message.mentions.members.first();
    if (!member) return message.reply("⚠️ Mencione um cidadão.");
  async execute(interaction, client) {
    const targetUser = interaction.options.getUser("usuario", true);
    const motivo = interaction.options.getString("motivo") || "Sem motivo especificado.";

    const motivo = args.slice(1).join(" ") || "Sem motivo especificado.";
    const guild = interaction.guild;
    const executorMember = interaction.member;
    const botMember = guild.members.me;

    await member.ban({ reason: motivo });
    const targetMember = await guild.members.fetch(targetUser.id).catch(() => null);
    if (!targetMember) {
      return interaction.reply({ content: "⚠️ Esse usuário não está no servidor.", ephemeral: true });
    }

    const check = canPunish({
      executorMember,
      targetMember,
      botMember,
      guildOwnerId: guild.ownerId,
    });

    if (!check.ok) return interaction.reply({ content: check.reason, ephemeral: true });

    await targetMember.ban({ reason: motivo });

    const embed = createEmbed(
      "🚫 Banimento Executado",
      `${member.user.tag} foi banido do reino.\n📌 Motivo: ${motivo}`,
      `${targetUser.tag} foi banido do reino.\n📌 Motivo: ${motivo}`,
      "#8B0000"
    );

    message.channel.send({ embeds: [embed] });
    return interaction.reply({ embeds: [embed] });
  }
};
