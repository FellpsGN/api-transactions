import { knex } from "../database";
import { FastifyInstance } from "fastify";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { checkSessionIdExists } from "../middlewares/check-session-id-exists";

export async function transactionsRoutes(app: FastifyInstance) {

    //criando um pedaço de código para rodar independente da roda que o usuário acessar
    // app.addHook("preHandler", async (request, reply) => {
    //     console.log(`[${request.method}] ${request.url}`);
    // });

    app.get("/", { preHandler: [checkSessionIdExists]} ,async (request, reply) => {
        const { sessionId } = request.cookies;
        
        const transactions = await knex("transactions").select("*").where("session_id", sessionId);


        return { transactions };
    });


    app.get("/:id", { preHandler: [checkSessionIdExists]}, async (request) => {
        const { sessionId } = request.cookies;
        const getTransactionsParamsSchema = z.object({
            id: z.string().uuid(),
        });

        const { id } = getTransactionsParamsSchema.parse(request.params);
        const transaction = await knex("transactions")
            .where(
                {
                    id,
                    session_id: sessionId
                }
            )
            .first();

        return { transaction };
    });


    app.get("/summary", { preHandler: [checkSessionIdExists]}, async (request) => {
        const { sessionId } = request.cookies;
        const summary = await knex("transactions")
            .sum("amount", {as: "amount"})
            .where("session_id", sessionId)
            .first();

        return { summary };
    });


    app.post("/", async (request, reply) => {
        
        const createTransactionBodySchema = z.object({
            title: z.string(),
            amount: z.number(),
            type: z.enum(["credit", "debit"])
        });

        const { title, amount, type } = createTransactionBodySchema.parse(request.body);

        let sessionId = request.cookies.sessionId;
        const sevenDays = 60 * 60 * 24 * 7

        if (!sessionId) {
            sessionId = randomUUID();
            reply.cookie("sessionId", sessionId, {
                path: "/",
                maxAge: sevenDays
            });
        }

        await knex("transactions")
            .insert({
                id: randomUUID(),
                title: title,
                amount: type === "credit" ? amount : (amount * -1),
                session_id: sessionId 
            });

        return reply.status(201).send();
    });
}