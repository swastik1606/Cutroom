import { open } from 'sqlite'
import sqlite3 from 'sqlite3'
import path from 'node:path'

export async function getDb(){
    return await open({
        filename: path.join(import.meta.dirname, 'database.db'),
        driver: sqlite3.Database
    })
}