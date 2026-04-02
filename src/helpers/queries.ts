import { db_path } from '../constants.js'
import { DatabaseSync } from 'node:sqlite'
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pathToDB = (process.env.NODE_ENV === 'production') ? db_path : path.resolve(__dirname + "/data", "gasbot.db");
const db = new DatabaseSync(pathToDB);

export async function AddNewEntry(date: string, price: number, notes: string) {
    return new Promise(function (resolve) {
        try {
            let query = `INSERT INTO enprogas (date, price, note, updated) VALUES ('${date}', '${price}','${notes}','${updatedAtNow()}')`
            console.log("Query Executed from AddNewEntry:" + query);
            db.prepare(query).run();
            resolve(true);
        } catch (e) {
            console.log(e);
            resolve(false);
        }
    })
}

export async function CheckEntry(date: string) {
    return new Promise(function (resolve) {
        try {
            let query = `SELECT * FROM enprogas WHERE date=?`
            console.log(`Query Executed from CheckEntry:${query} with date ${date}`)
            let result = db.prepare(query).all(date);
            resolve(result.length > 0);
        } catch (e) {
            console.log(e);
            resolve(false);
        }
    })
}

export async function GetEntryRange(start: string, end: string) {
    return new Promise(function (resolve) {
        try {
            let query = `SELECT * FROM enprogas WHERE date BETWEEN ? AND ?`
            console.log(`Query Executed from CheckEntry:${query} with date ${start} & ${end}`)
            let result = db.prepare(query).all(start, end);
            resolve(result.length > 0);
        } catch (e) {
            console.log(e);
            resolve(false);
        }
    })
}

function updatedAtNow() {
    return new Date().toISOString();
}