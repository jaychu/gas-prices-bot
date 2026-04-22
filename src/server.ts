import { Events, GatewayIntentBits, type Interaction } from "discord.js";
import { Client } from "discordx";
import { importx } from "@discordx/importer";
import express, { Request, Response } from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { CronJob } from "cron";
import { getDiscordToken } from './helpers/secrets.js';
import { GrabGasPrediction } from './helpers/functions.js';
import { GetEntryRange } from "./helpers/queries.js";
import { configFile, serverPort } from './constants.js';

const configFilePath = (process.env.NODE_ENV === 'production') ? configFile : "./helpers/" + configFile;

const { default: config } = await import(configFilePath, {
  with: { type: 'json' }
});



const app = express();

app.use(express.json());

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.MessageContent
  ],
  silent: false,
  // If you only want to use global commands only, comment this line
  botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)]
});

start();

client.on(Events.ClientReady, async () => {
  await client.initApplicationCommands();
  var job = new CronJob('0 15 * * *', function () {
    (async () => {
      client.channels.cache.each(
        (channel) => GrabGasPrediction(channel)
      )
    })();
  }, null, true, config.TIMEZONE);
  console.log("GasPriceBot is now online!");
});

client.on("interactionCreate", (interaction: Interaction) => {
  client.executeInteraction(interaction);
});

async function start() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  await importx(__dirname + "/commands/**/*.{js,ts}");
  let discordToken = await getDiscordToken();
  await client.login(discordToken);
}

// A POST route to receive date range, send back corresponding rows
app.post('/getEntryRange', (req: Request, res: Response) => {
  console.log(req.body);
  (async () => {
    let result = await GetEntryRange(req.body.start, req.body.end)
    res.status(201).json(result);
  })();
});

app.listen(serverPort, () => {
  console.log(`Server running at http://localhost:${serverPort}`);
});