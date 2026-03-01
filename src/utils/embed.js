const { EmbedBuilder } = require("discord.js");
const config = require("../config");

function createEmbed(title, description, color = config.color) {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description)
    .setTimestamp();
}

module.exports = { createEmbed };
