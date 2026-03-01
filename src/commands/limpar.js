const { PermissionsBitField } = require("discord.js");
const { createEmbed } = require("../utils/embed");

module.exports = {
  name: "limpar",
  async execute(message, args) {
    if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages))
      return message.reply("⚠️ Apenas oficiais podem executar este decreto.");

    const quantidade = parseInt(args[0]);
    if (!quantidade || quantidade < 1 || quantidade > 100)
      return message.reply("⚠️ Informe um número entre 1 e 100.");

    await message.channel.bulkDelete(quantidade, true);

    const embed = createEmbed(
      "🧹 Limpeza Executada",
      `Foram removidas **${quantidade}** mensagens para preservar a ordem.`
    );

    message.channel.send({ embeds: [embed] });
  }
};
