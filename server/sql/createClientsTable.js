import { open } from 'sqlite'
import sqlite3 from 'sqlite3'
import path from 'node:path'

async function createClientsTable() {
    const db = await open({
        filename: path.join(import.meta.dirname, 'database.db'),
        driver: sqlite3.Database
    })

    await db.exec(
        `create table if not exists clients(
            client_id integer primary key autoincrement,
            name text not null,
            phone integer unique,
            email text not null unique,
            company text,
            notes text,
            currency text not null
        )`
    )

    await db.close()
    console.log('table created!')
}

createClientsTable()