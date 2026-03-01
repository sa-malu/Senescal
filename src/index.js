const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

client.slashCommands = new Collection();

// Carregar slash commands
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
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
