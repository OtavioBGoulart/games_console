import supertest from "supertest";
import app from "app";
import { consoleBody, createConsole } from "../factories/console-factory";
import prisma from "config/database";

beforeAll(async () => {
    await prisma.game.deleteMany({})
    await prisma.console.deleteMany({})
})

beforeEach(async () => {
    await prisma.game.deleteMany({})
    await prisma.console.deleteMany({})
})

const server = supertest(app);

describe("GET /consoles", () => {
    it("should respond with status 200 when receive the console list", async () => {
        const response = await server.get("/consoles");

        expect(response.status).toBe(200);
        expect(response.body).toEqual([])
    })

    it("should respond with status 200 when receive the console list", async () => {
        const console = await createConsole()
        const response = await server.get("/consoles");


        expect(response.status).toBe(200);
        expect(response.body).toEqual([{
            id: console.id,
            name: console.name
        }])
    })
})

describe("GET /consoles/:id", () => {

    it("should respond with status 404 if id not exist", async () => {
        const response = await server.get("/consoles/0");

        expect(response.status).toBe(404);
    })

    it("should respond with status 200 when receive the console by id", async () => {
        const console = await createConsole()
        const response = await server.get(`/consoles/${console.id}`);


        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            id: console.id,
            name: console.name
        })
    })
})

describe("POST /consoles", () => {
    
    it("should respond with status 409 when console name already exist", async () => {
        const console = await createConsole()
        const response = await server.post("/consoles").send({
            name: console.name
        });

        expect(response.status).toBe(409);

    })

    it("should respond with status 201 when create console was sucessfull", async () => {
        const nameBody = await consoleBody()
        const response = await server.post("/consoles").send(nameBody);

        expect(response.status).toBe(201);
    })

})