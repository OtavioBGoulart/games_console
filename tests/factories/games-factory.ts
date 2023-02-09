import prisma from "config/database";
import { faker } from "@faker-js/faker";

export async function createGame(consoleId: number) {
    return await prisma.game.create({
        data: {
            title: faker.name.firstName(),
            consoleId
        }
    })
}

export async function gameBody(consoleId: number) {
    return {
        title: faker.name.firstName(),
        consoleId: consoleId
    }
}