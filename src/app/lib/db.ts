import mysql from 'serverless-mysql';

import { Sequelize } from "sequelize"

import mariadb from "mariadb"

export const sequelize = new Sequelize(process.env.MYSQL_DATABASE!, process.env.MYSQL_USER!, process.env.MYSQL_PASSWORD!, {
  host: process.env.MYSQL_HOST!,
  dialect: "mariadb",
  dialectModule: mariadb,
});

const db = mysql({
    config: {
        host: process.env.MYSQL_HOST,
        port: parseInt(process.env.MYSQL_PORT!),
        database: process.env.MYSQL_DATABASE,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD
    }
})

export default async function executeQuery(query: string, ...values: any) {
  try {
    const results = await db.query(query, values);
    await db.end();
    return results;
  } catch (error) {
    return { error };
  }
}