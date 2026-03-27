import { db_path } from '../constants'
import { DatabaseSync } from 'node:sqlite';
const path = require('node:path');

const pathToDB = (process.env.NODE_ENV === 'production') ? db_path : path.resolve(__dirname+"../../../data","gasbot.db");
const db = new DatabaseSync(pathToDB);

  export async function AddNewEntry(date:string, price:number, notes:string){
    return new Promise(function(resolve){
        try{
            let query = `INSERT INTO enprogas (date, price, note, updated) VALUES ('${date}', '${price}','${notes}','${updatedAtNow()}')`
            console.log("Query Executed from AddNewEntry:"+query);
            db.prepare(query).run();
            resolve(true);
        } catch (e) {
            console.log(e);
            resolve(false);
        }
    })
  }


function updatedAtNow(){
    return new Date().toISOString();
}