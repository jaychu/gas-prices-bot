let Discord = require("discord.js");
let CronJob = require("cron").CronJob;
let config = require("./config.json");
let axios = require('axios');
let parse = require('node-html-parser').parse;

const client = new Discord.Client();

client.login(config.BOT_TOKEN);

var job = new CronJob('0 15 * * *', function () {
  (async () => {
    GrabGasPrediction();  
  })();
}, null, true, config.TIMEZONE);

client.on('ready', () => {  
  job.start();  
});

async function GrabGasPrediction(){
  const channel = client.channels.cache.find(channel => channel.name === config.CHANNEL_NAME)
  let apiURL = config.Gas_Price_Page;
  let feed = await axios.get(apiURL);  
  let root = parse(feed.data.content);
  let arrow;
  if(feed.data.content.includes(".up-arrow{display:block;")){
    arrow = "https://raw.githubusercontent.com/jaychu/gas-prices-bot/master/assets/up.JPG";
  }else if(feed.data.content.includes(".down-arrow{display:block;")){
    arrow = "https://raw.githubusercontent.com/jaychu/gas-prices-bot/master/assets/down.JPG";
  }else{
    arrow = "";
  }
  
  var value = root.querySelector('.data-box-change').removeWhitespace().text.toString();
  var msg = root.querySelector('.data-box-change').nextElementSibling.text.toString();
  channel.send(PostMessage(value,msg,arrow));
}

function PostMessage(value,msg,arrow){
  var message = new Discord.MessageEmbed({
    title:"Gas Price Delta: "+value,
    url:"https://toronto.citynews.ca/toronto-gta-gas-prices/",
    thumbnail:{
      url:arrow
    },
    description:msg
  });
  return message;
}