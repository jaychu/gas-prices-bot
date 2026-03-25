import { Client, Events, GatewayIntentBits } from "discord.js";
import { CronJob } from "cron";
import { getDiscordToken } from './helpers/secrets';
import { GrabGasPrediction } from './helpers/functions';
import {configFile} from './constants';

const config = (process.env.NODE_ENV === 'production') ? require(configFile) : require("../"+configFile);

const client = new Client({ intents: [
     GatewayIntentBits.Guilds,
     GatewayIntentBits.GuildMessages,
     GatewayIntentBits.MessageContent
] });

client.login(getDiscordToken());

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