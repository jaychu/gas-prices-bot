import axios from "axios";
import { parse } from 'node-html-parser';
import {configFile} from '../constants';
import { EmbedBuilder } from "discord.js";
import { AddNewEntry } from "./queries"

const config = (process.env.NODE_ENV === 'production') ? require(configFile) : require("../../"+configFile);
const priceRegex = /(\d+(\.\d+)?) (?=cent\(s\))/g;


export async function GrabGasPrediction(channel){
  if(channel.name === config.CHANNEL_NAME){
    let apiURL = config.Gas_Price_Page;
    let feed = await axios.get(apiURL);  
    let root = parse(feed.data.content);
    let arrow, delta, finalPrice;
    let msg = root.querySelector('.data-box-change').parentNode.removeChild(root.querySelector('.data-box-change')).text.toString();
    let notes = noteExtractor(root.querySelectorAll('p strong'));
    let matches = msg.match(priceRegex);
    if (matches) {
        delta = matches[0].trim();
        finalPrice = matches[1].trim();
        console.log(`Change: ${delta}, New Price: ${finalPrice}`);
    }
    if(feed.data.content.includes("class=\"up-arrow\" style=\"display:block\"")){
      arrow = "https://raw.githubusercontent.com/jaychu/gas-prices-bot/master/assets/up.JPG";
      delta = "+" + delta;
    }else if(feed.data.content.includes("class=\"down-arrow\" style=\"display:block\"")){
      arrow = "https://raw.githubusercontent.com/jaychu/gas-prices-bot/master/assets/down.JPG";
      delta = "-" + delta;
    }else{
      arrow = "";
    }    
     channel.send({
        content:"Your Gas Price Forecast for tomorrow:",
        embeds:[PostMessage(delta, finalPrice, msg + notes, arrow)]
    }); 
    
    AddEntryIntoDB(finalPrice, notes);
  }
}

function PostMessage(delta:string, finalPrice:string, msg:string, arrow:string){
    let message = new EmbedBuilder()
        .setTitle(`Gas Price: ${finalPrice} (${delta}) cent(s)/litre`)
        .setURL('https://toronto.citynews.ca/toronto-gta-gas-prices/')
        .setThumbnail(arrow) 
        .setDescription(msg);
  return message;
}

function noteExtractor(noteNodes){
    let note = "";
    noteNodes.forEach((node) => {
        if(node.textContent.includes("NOTE")){
            note+="\n\n"+node.parentNode.textContent;
        }
    });
    return note;
}

function AddEntryIntoDB(finalPrice: number, notes: string){
    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    AddNewEntry(tomorrow.toISOString().split('T')[0],finalPrice,notes)
}