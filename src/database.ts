import { env } from "./env"; 
import { knex as setupKnex, Knex } from "knex";

if (!process.env.DATABASE_URL) {
    throw new Error("Database url env not found")
}

export const config: Knex.Config = {
    client: env.DATABASE_CLIENT,
    connection: 
        env.DATABASE_CLIENT === "sqlite" ? { filename: env.DATABASE_URL,} 
        : env.DATABASE_CLIENT,
    useNullAsDefault: true,
    migrations: {
        extension: "ts",
        directory: "./db/migrations"
    }
};

export const knex = setupKnex(config);