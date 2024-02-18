import mysql from 'serverless-mysql';

import mariadb from "mariadb";
import { Sequelize } from 'sequelize';

const db = mysql({
    config: {
        host: process.env.MYSQL_HOST,
        port: parseInt(process.env.MYSQL_PORT!),
        database: process.env.MYSQL_DATABASE,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD
    }
})

export const pool = mariadb.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: parseInt(process.env.MYSQL_PORT!),
});

export default async function executeQuery({ query, values }: {query: any, values: any}) {
    try {
      const results = await db.query(query, values);
      await db.end();
      return results;
    } catch (error) {
      return { error };
    }
  }