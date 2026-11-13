import { open } from 'sqlite'
import sqlite3 from 'sqlite3'
import path from 'node:path'

async function createUsersTable() {

    const db = await open({
        filename: path.join(import.meta.dirname, 'database.db'),
        driver: sqlite3.Database
    })

    await db.exec(
        `create table if not exists users(
            user_id integer primary key autoincrement,
            name text not null,
            email text not null,
            password text not null,
            created_at datetime default current_timestamp
        )`
    )

    await db.close()
    console.log('table created!')

}

createUsersTable()