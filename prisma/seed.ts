import { faker } from "@faker-js/faker";
import prisma from "~/lib/prisma";

// Number of clients to generate
const NUM_CLIENTS = 50;

async function main() {
  console.log("Starting to seed clients...");

  // Delete existing records to prevent duplicate data on re-runs
  await prisma.client.deleteMany();
  console.log("Cleared existing client records");

  const clients = [];

  // Generate random client data
  for (let i = 0; i < NUM_CLIENTS; i++) {
    const gender = faker.person.sex();
    const firstName = faker.person.firstName(
      gender === "female" ? "female" : "male"
    );
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName }).toLowerCase();

    const client = {
      firstName,
      lastName,
      dateOfBirth: faker.date.birthdate({ min: 18, max: 80, mode: "age" }),
      gender: gender === "female" ? "Female" : "Male",
      contactNumber: faker.phone.number(),
      email,
      address: faker.location.streetAddress({ useFullAddress: true }),
      createdAt: faker.date.between({ from: "2023-01-01", to: new Date() }),
      updatedAt: new Date(),
    };

    clients.push(client);
  }

  // Add a few non-binary/other gender clients for diversity
  for (let i = 0; i < 5; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName }).toLowerCase();

    const client = {
      firstName,
      lastName,
      dateOfBirth: faker.date.birthdate({ min: 18, max: 80, mode: "age" }),
      gender: "Other",
      contactNumber: faker.phone.number(),
      email,
      address: faker.location.streetAddress({ useFullAddress: true }),
      createdAt: faker.date.between({ from: "2023-01-01", to: new Date() }),
      updatedAt: new Date(),
    };

    clients.push(client);
  }

  // Insert all clients in a single transaction for better performance
  const createdClients = await prisma.client.createMany({
    data: clients,
  });

  console.log(`Successfully seeded ${createdClients.count} clients`);
}

// main()
//   .catch((e) => {
//     console.error('Error seeding clients:', e)
//     process.exit(1)
//   })
//   .finally(async () => {
//     // Close Prisma client connection
//     await prisma.$disconnect()
//   })

console.log("Seeding");
