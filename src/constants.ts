export const db_path = (process.env.NODE_ENV === 'production') ? "/gaspricebot-data/gasbot.db" : "./data/gasbot.db";
export const configFile: string = (process.env.NODE_ENV === 'production') ? "/gaspricebot-data/config.json" : "./data/config.json";

export const noteFromGasbot_noUpdate = "EnPro did not provide an updated prediction today, so we're operating under the assumption for now that no gas price will change tomorrow."

export const serverPort = 8031;