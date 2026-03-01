const { PermissionsBitField } = require("discord.js");
const { createEmbed } = require("../utils/embed");
const ms = require("ms");

module.exports = {
  name: "timeout",
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ModerateMembers))
      return message.reply("⚠️ Permissão insuficiente.");

    const member = message.mentions.members.first();
    if (!member) return message.reply("⚠️ Mencione um cidadão.");

    const tempo = args[1];
    const motivo = args.slice(2).join(" ") || "Sem motivo especificado.";
    if (!tempo) return message.reply("⚠️ Informe o tempo (ex: 10m, 1h).");

    await member.timeout(ms(tempo), motivo);

    const embed = createEmbed(
      "⛓️ Cidadão Silenciado",
      `${member.user.tag} foi silenciado por **${tempo}**.\n📌 Motivo: ${motivo}`
    );

    message.channel.send({ embeds: [embed] });
  }
};
