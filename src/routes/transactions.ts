import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { randomUUID } from "node:crypto";

export async function transactionsRoutes(app: FastifyInstance) {
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
}