let Discord = require("discord.js");
let CronJob = require("cron").CronJob;
let config = require("./config.json");
let axios = require('axios');
let parse = require('node-html-parser').parse;
let {MongoClient} = require('mongodb');

const discordClient = new Discord.Client();

discordClient.login(config.BOT_TOKEN);
const uri = `mongodb://${config.MongoDB_Hostname}:${config.MongoDB_Port}/?maxPoolSize=20&w=majority`;

const mongoClient = new MongoClient(uri);

var discordJob = new CronJob('0 15 * * *', function () {
  (async () => {
    GrabGasPrediction();  
  })();
}, null, true, config.TIMEZONE);

var mongoDBJob = new CronJob('0 23 * * *', function () {
  (async () => {
    GrabGasTableforDb();
  })();
}, null, true, config.TIMEZONE);

discordClient.on('ready', () => {  
  discordJob.start();  
  mongoDBJob.start();
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

async function GrabGasTableforDb(){
  let apiURL = config.Gas_Price_Page;
  let feed = await axios.get(apiURL);  
  let root = parse(feed.data.content);
  var value = root.querySelector('.page-table-body tbody tr:nth-child(2)').text.trim().split('\n');
  let date = value[0].trim();
  let delta = Number(value[1].trim().split(' ')[0]);
  let price = Number(value[2].trim().split(' ')[0]);

  insertIntoDb(date,delta,price);
}
async function insertIntoDb(date,delta,price){
  try {
    // Connect the client to the server (optional starting in v4.7)
    await mongoClient.connect();
    // Establish and verify connection
    const db = await mongoClient.db("GasPrice");
    const col = db.collection("GasTrend");
    let entry = {
      date:date,
      delta:delta,
      price:price
    }
    await col.insertOne(entry);
    console.log("Submission successful!");
  } finally {
    // Ensures that the client will close when you finish/error
    await mongoClient.close();
  }
}


