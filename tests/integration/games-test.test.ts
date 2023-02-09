import supertest from "supertest";
import app from "app";
import prisma from "config/database";
import { createConsole } from "../factories/console-factory";
import { createGame, gameBody } from "../factories/games-factory";

beforeAll(async () => {
    await prisma.game.deleteMany({})
    await prisma.console.deleteMany({})
})

beforeEach(async () => {
    await prisma.game.deleteMany({})
    await prisma.console.deleteMany({})
})

// afterAll(async () => {
//     await prisma.game.deleteMany({})
//     await prisma.console.deleteMany({})
// })

const server = supertest(app);

describe("GET /games", () => {
    it("should respond with status 200 when receive empty games list", async () => {
        const response = await server.get("/games");

        expect(response.status).toBe(200);
        expect(response.body).toEqual([])
    })

    it("should respond with status 200 when receive the games list", async () => {
        const console = await createConsole()
        const games = await createGame(console.id)
        const response = await server.get("/games");


        expect(response.status).toBe(200);
        expect(response.body).toEqual([{
            Console: {
                id: console.id,
                name: console.name
            },
            consoleId: games.consoleId,
            id: games.id,
            title: games.title
        }])
    })
})

describe("GET /games/:id", () => {

    it("should respond with status 404 if id not exist", async () => {
        const response = await server.get("/games/0");

        expect(response.status).toBe(404);
    })

    it("should respond with status 200 when receive the games by id", async () => {
        const console = await createConsole()
        const games = await createGame(console.id)
        const response = await server.get(`/games/${games.id}`);


        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            id: games.id,
            title: games.title,
            consoleId: games.consoleId
        })
    })
})

describe("POST /games", () => {
    
    it("should respond with status 409 when games name already exist", async () => {
        const console = await createConsole()
        const games = await createGame(console.id)
        const response = await server.post("/games").send({
            title: games.title,
            consoleId: games.consoleId
        });

        expect(response.status).toBe(409);

    })

    it("should respond with status 201 when create games was sucessfull", async () => {
        const console = await createConsole()
        const nameBody = await gameBody(console.id)
        const response = await server.post("/games").send(nameBody);

        expect(response.status).toBe(201);
    })

})