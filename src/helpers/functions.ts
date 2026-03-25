import axios from "axios";
import { parse } from 'node-html-parser';
import {configFile} from '../constants';
import { EmbedBuilder } from "discord.js";

const config = (process.env.NODE_ENV === 'production') ? require(configFile) : require("../../"+configFile);

export async function GrabGasPrediction(channel){
  if(channel.name === config.CHANNEL_NAME){
    let apiURL = config.Gas_Price_Page;
    let feed = await axios.get(apiURL);  
    let root = parse(feed.data.content);
    let arrow;
    var value = root.querySelector('.data-box-change').removeWhitespace().text.toString();
    var msg = root.querySelector('.data-box-change').parentNode.removeChild(root.querySelector('.data-box-change')).text.toString();
    if(feed.data.content.includes("class=\"up-arrow\" style=\"display:block\"")){
      arrow = "https://raw.githubusercontent.com/jaychu/gas-prices-bot/master/assets/up.JPG";
      value = " + "+value;
    }else if(feed.data.content.includes("class=\"down-arrow\" style=\"display:block\"")){
      arrow = "https://raw.githubusercontent.com/jaychu/gas-prices-bot/master/assets/down.JPG";
      value = " - "+value;
    }else{
      arrow = "";
    }    
    channel.send({
        content:"Your Gas Price Forecast for tomorrow:",
        embeds:[PostMessage(value,msg,arrow)]
    });
  }
}

function PostMessage(value,msg,arrow){
    let message = new EmbedBuilder()
        .setTitle(`Gas Price Delta: ${value}`)
        .setURL('https://toronto.citynews.ca/toronto-gta-gas-prices/')
        .setThumbnail(arrow) // Just pass the string URL here
        .setDescription(msg);
  return message;
}