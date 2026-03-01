const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

client.slashCommands = new Collection();

// Carregar slash commands
const slashPath = path.join(__dirname, "slash");
const slashFiles = fs.readdirSync(slashPath).filter(f => f.endsWith(".js"));

for (const file of slashFiles) {
  const command = require(path.join(slashPath, file));
  client.slashCommands.set(command.data.name, command);
}

client.on("ready", () => {
  console.log(`🛡️ Senescal ativo como ${client.user.tag}`);
  console.log(`📌 Em ${client.guilds.cache.size} servidor(es).`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.slashCommands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: "⚠️ Erro ao executar o comando.", ephemeral: true });
    } else {
      await interaction.reply({ content: "⚠️ Erro ao executar o comando.", ephemeral: true });
    }
  }
});

client.login(process.env.TOKEN);
