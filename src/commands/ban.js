const { PermissionsBitField } = require("discord.js");
const { createEmbed } = require("../utils/embed");

module.exports = {
  name: "ban",
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers))
      return message.reply("⚠️ Permissão insuficiente.");

    const member = message.mentions.members.first();
    if (!member) return message.reply("⚠️ Mencione um cidadão.");

    const motivo = args.slice(1).join(" ") || "Sem motivo especificado.";

    await member.ban({ reason: motivo });

    const embed = createEmbed(
      "🚫 Banimento Executado",
      `${member.user.tag} foi banido do reino.\n📌 Motivo: ${motivo}`,
      "#8B0000"
    );

    message.channel.send({ embeds: [embed] });
  }
};
