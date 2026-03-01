const { PermissionsBitField } = require("discord.js");
const { createEmbed } = require("../utils/embed");

module.exports = {
  name: "unban",
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers))
      return message.reply("⚠️ Permissão insuficiente.");

    const id = args[0];
    if (!id) return message.reply("⚠️ Informe o ID do cidadão.");

    await message.guild.members.unban(id);

    const embed = createEmbed(
      "⚖️ Perdão Concedido",
      "O cidadão foi readmitido ao reino.",
      "#2ECC71"
    );

    message.channel.send({ embeds: [embed] });
  }
};
