let Discord = require("discord.js");
let CronJob = require("cron").CronJob;
let config = require("./config.json");
let axios = require('axios');
let parse = require('node-html-parser').parse;

const discordClient = new Discord.Client();

discordClient.login(config.BOT_TOKEN);

var discordJob = new CronJob('0 15 * * *', function () {
  (async () => {
    GrabGasPrediction();  
    
  })();
}, null, true, config.TIMEZONE);

discordClient.on('ready', () => {  
  discordJob.start();  
  console.log("Yup");
});

async function GrabGasPrediction(){
  const channel = discordClient.channels.cache.find(channel => channel.name === config.CHANNEL_NAME)
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



