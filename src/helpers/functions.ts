import axios from "axios";
import { parse } from 'node-html-parser';
import { configFile, noteFromGasbot_noUpdate } from '../constants.js';
import { EmbedBuilder, Role, GuildMember, Guild, MessageFlags } from "discord.js";
import { AddNewEntry, CheckEntry } from "./queries.js"

const { default: config } = await import(configFile, {
  with: { type: 'json' }
});

const priceRegex = /(\d+(\.\d+)?) (?=cent\(s\))/g;
const dateRegex = / on\s+([A-Z][a-z]+\s+\d{1,2},\s+\d{4})/;

export async function GrabGasPrediction(channel) {
  if (channel.name === config.CHANNEL_NAME) {
    let apiURL = config.Gas_Price_Page;
    let feed = await axios.get(apiURL);
    let root = parse(feed.data.content);
    let arrow, delta, finalPrice;
    let msg = root.querySelector('.data-box-change').parentNode.removeChild(root.querySelector('.data-box-change')).text.toString();
    let notes = noteExtractor(root.querySelectorAll('p strong'));
    let matches = msg.match(priceRegex);

    if (matches && msg.includes("expected to remain unchanged")) {
      finalPrice = matches[0].trim();
    }
    else if (matches) {
      delta = matches[0].trim();
      finalPrice = matches[1].trim();
      console.log(`Change: ${delta}, New Price: ${finalPrice}`);
    }

    if (feed.data.content.includes("class=\"up-arrow\" style=\"display:block\"")) {
      arrow = "https://raw.githubusercontent.com/jaychu/gas-prices-bot/master/assets/up.JPG";
      delta = "+" + delta;
    } else if (feed.data.content.includes("class=\"down-arrow\" style=\"display:block\"")) {
      arrow = "https://raw.githubusercontent.com/jaychu/gas-prices-bot/master/assets/down.JPG";
      delta = "-" + delta;
    } else {
      arrow = null;
    }

    let extractedDate = msg.match(dateRegex);
    let dateObj = new Date(`${extractedDate[1].trim()} 00:01:00`);
    let isoStringDate = dateObj.toISOString().split('T')[0];

    let CheckRowDuplicate = await CheckEntry(isoStringDate);
    if (CheckRowDuplicate) {
      console.log("No update From EnPro!")
      channel.send({
        content: `<@&${config.ROLE_ID}>, EnPro did not provide an update.`,
        embeds: [PostMessage("0", finalPrice, noteFromGasbot_noUpdate, null)]
      });
      AddEntryIntoDB(finalPrice, "");
    } else if (delta == null) {
      console.log("No Change expected From EnPro!")
      channel.send({
        content: `<@&${config.ROLE_ID}>, gas price expected to be ${finalPrice} (${delta}) cent(s)/litre.`,
        embeds: [PostMessage("0", finalPrice, msg + notes, null)]
      });
      AddEntryIntoDB(finalPrice, notes);

    } else {
      console.log("Change expected From EnPro!")
      channel.send({
        content: `<@&${config.ROLE_ID}>, gas price expected to be ${finalPrice} (${delta}) cent(s)/litre.`,
        embeds: [PostMessage(delta, finalPrice, msg + notes, arrow)]
      });
      AddEntryIntoDB(finalPrice, notes);
    }


  }
}

export async function addGasWatcher(interaction) {
  let user = interaction.user;
  let guild = interaction.member.guild as Guild;
  let member = await guild.members.fetch(user.id) as GuildMember;
  let role = await guild.roles.fetch(config.ROLE_ID) as Role;
  member.roles.add(role);
  await interaction.reply({
    content: "You have been added to the group and will now be notified when gas prices change!",
    flags: [MessageFlags.Ephemeral]
  });
}

export async function removeGasWatcher(interaction) {
  let user = interaction.user;
  let guild = interaction.member.guild as Guild;
  let member = await guild.members.fetch(user.id) as GuildMember;
  let role = await guild.roles.fetch(config.ROLE_ID) as Role;
  member.roles.remove(role);
  await interaction.reply({
    content: "You have been removed from the group and will no longer be notified",
    flags: [MessageFlags.Ephemeral]
  });
}


function PostMessage(delta: string, finalPrice: string, msg: string, arrow: string) {
  let message = new EmbedBuilder()
    .setTitle(`Gas Price: ${finalPrice} (${delta}) cent(s)/litre`)
    .setURL('https://gaswatch.justinchu.com/')
    .setDescription(msg);
  if (delta == "0") {
    message.setTitle(`Gas Price: ${finalPrice} cent(s)/litre`)
  }
  if (arrow != null) {
    message.setThumbnail(arrow);
  }
  return message;
}

function noteExtractor(noteNodes) {
  let note = "";
  noteNodes.forEach((node) => {
    if (node.textContent.includes("NOTE")) {
      note += "\n\n" + node.parentNode.textContent;
    }
  });
  return note;
}

function AddEntryIntoDB(finalPrice: number, notes: string) {
  let tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  AddNewEntry(tomorrow.toISOString().split('T')[0], finalPrice, notes)
}
