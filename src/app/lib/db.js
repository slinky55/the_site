import { QueryTypes, Sequelize } from "sequelize"

export const sequelize = new Sequelize(process.env.POSTGRES_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: true,
  }
});

export default async function executeQuery({ query, values }) {
  try {
    const results = await sequelize.query(query, {
      replacements: values,
      type: QueryTypes.SELECT,
    })
    return results;
  } catch (error) {
    return { error };
  }
}