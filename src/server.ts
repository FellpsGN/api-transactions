import fastify from "fastify";
import { randomUUID } from "node:crypto";
import { knex } from "./database";
import { env } from "./env";

const app = fastify();

app
    .listen({
        port: env.PORT,
    })
    .then(() => {
        console.log(`Https server running on ${3333}`);
    });

app.get("/hello", async () => {
    const transactions = await knex("transactions")
        .select("*")
        .where("amount", 1000);
    return transactions;
});

app.get("/insert/exemplo", async () => {
    const transactions = await knex("transactions")
        .insert({
            id: randomUUID(),
            title: "Transação de teste",
            amount: 1000
        })
        .returning("*");

    return transactions;
});


