import prisma from "config/database";
import { faker } from "@faker-js/faker";

export async function createConsole() {
    return await prisma.console.create({
        data: {
            name: faker.name.firstName()
        }
    })
}

export function consoleBody() {
    return {
        name: faker.name.firstName()
    }
}