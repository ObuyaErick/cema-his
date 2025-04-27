import { faker } from "@faker-js/faker";
import { hashSync } from "bcrypt";
import prisma from "~/lib/prisma";

// Number of clients to generate
const NUM_CLIENTS = 5;

async function main() {
  console.log("Starting to seed...");

  // Delete existing records to prevent duplicate data on re-runs
  await prisma.client.deleteMany();
  await prisma.user.deleteMany();
  console.log("Cleared existing client and user records");

  console.log("Seeding doctor");
  await prisma.user.create({
    data: {
      name: "App Admin",
      email: "admin@app.com",
      password: hashSync("admin1234", 10),
      role: "doctor",
    },
  });
  console.log("Seeded doctor");

  const clients = [];

  // Generate random client data
  for (let i = 0; i < NUM_CLIENTS; i++) {
    const gender = faker.person.sex();
    const firstName = faker.person.firstName(
      gender === "female" ? "female" : "male"
    );
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName }).toLowerCase();

    const clientUser = prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email,
        password: hashSync(email, 10),
        role: "client",
      },
    });

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
      userId: (await clientUser).id,
    };

    clients.push(client);
  }

  // Insert all clients in a single transaction for better performance
  const createdClients = await prisma.client.createMany({
    data: clients,
  });

  console.log(`Successfully seeded ${createdClients.count} clients`);
}

main()
  .catch((e) => {
    console.error("Error seeding clients:", e);
    process.exit(1);
  })
  .finally(async () => {
    // Close Prisma client connection
    await prisma.$disconnect();
  });
