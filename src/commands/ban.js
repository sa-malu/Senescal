const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { createEmbed } = require("../utils/embed");
const { canPunish } = require("../utils/canPunish");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Bane um usuário do reino.")
    .addUserOption(opt =>
      opt.setName("usuario")
        .setDescription("Quem será banido")
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName("motivo")
        .setDescription("Motivo do ban")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const targetUser = interaction.options.getUser("usuario", true);
    const motivo = interaction.options.getString("motivo") || "Sem motivo especificado.";

    const guild = interaction.guild;
    const executorMember = interaction.member;
    const botMember = guild.members.me;

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
      `${targetUser.tag} foi banido do reino.\n📌 Motivo: ${motivo}`,
      "#8B0000"
    );

    return interaction.reply({ embeds: [embed] });
  },
};
