import { Client, Events, GatewayIntentBits } from "discord.js";
import express, { Request, Response } from 'express';
import { CronJob } from "cron";
import { getDiscordToken } from './helpers/secrets.js';
import { GrabGasPrediction } from './helpers/functions.js';
import { configFile } from './constants.js';

const configFilePath = (process.env.NODE_ENV === 'production') ? configFile : "./helpers/" + configFile;

const { default: config } = await import(configFilePath, {
  with: { type: 'json' }
});



const app = express();
const port = 8031

app.use(express.json());;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

let discordToken = await getDiscordToken();
client.login(discordToken);

client.on(Events.ClientReady, readyClient => {

  var job = new CronJob('0 15 * * *', function () {
    (async () => {
      client.channels.cache.each(
        (channel) => GrabGasPrediction(channel)
      )
    })();
  }, null, true, config.TIMEZONE);
  console.log("GasPriceBot is now online!");
});


app.get('/hello', (req: Request, res: Response) => {
  res.send('Hello World!');
});
// A POST route receiving data
app.post('/getEntryRange', (req: Request, res: Response) => {
  console.log(req.body);
  res.status(201).json({ message: "Data received" });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});