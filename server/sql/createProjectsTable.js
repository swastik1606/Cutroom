import { open } from 'sqlite'
import sqlite3 from 'sqlite3'
import path from 'node:path'

async function createProjectsTable() {
    const db = await open({
        filename: path.join(import.meta.dirname, 'database.db'),
        driver: sqlite3.Database
    })

    await db.exec(
        `create table if not exists projects(
            project_id integer primary key autoincrement,
            status text not null,
            deadline text not null,
            notes text,
            client_email text not null unique,
            client_id integer not null,
            user_id integer not null,
            foreign key(client_id) references clients(client_id),
            foreign key(client_email) references clients(email),
            foreign key(user_id) references user(user_id)
        )`
    )

    await db.close()
    console.log('table created!')
}

createProjectsTable()