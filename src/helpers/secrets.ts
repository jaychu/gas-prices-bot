import fs from 'fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let discord_token_path = (process.env.NODE_ENV === 'production') ? '/gaspricebot-data/discord_token.txt' : path.resolve(__dirname + "/data", "discord_token.txt");

// Function to get the Discord_Token from the secret file
export async function getDiscordToken(): Promise<string> {
  return new Promise(function (resolve) {
    try {
      // Docker mounts secrets at this specific path
      resolve(fs.readFileSync(discord_token_path, 'utf8').trim());
    }
    catch (err) {
      console.error("Could not find discord_token file in data/!");
      console.error(err);
      resolve("");
    }
  })
};