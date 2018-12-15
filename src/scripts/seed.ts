// tslint:disable:no-console

import { address, date, internet, name, phone, random } from "faker";
import { Connection, getConnection } from "typeorm";

import db, { Address, User } from "../server/db";

let dbConnection: Connection;

const seed = async (): Promise<void> => {
  dbConnection = await getConnection(); // require("../server/db");
  console.log("db synced!");

  console.log("DB______________________\n", dbConnection); // JSON.stringify(db, null, 2));

  // constant user
  const user: User = await User.create({
    birthday: "1990-05-20",
    email: "jerry@fuzzduck.org",
    firstName: "Jerry",
    googleId: "7dfa2b86-b1ef-4ea2-bc48-4eb9dac60f69",
    lastName: "Muzsik",
    password: "password",
    phoneNumber: "5558675309",
    stripeId: "2e0a4505-83b7-475d-b9bb-a5a8bf0ff141",
    username: "jman11"
  });
  await Address.create({
    city: "Montanita",
    country: "Ecuador",
    googlePlaceId: "ca1990eb-5fec-4210-aaab-8a26e8a1ab49",
    state: "Santa-Elena",
    streetAddress: "420",
    streetName: "Main Street",
    user,
    zipCode: "092050"
  });

  const users: void[] = await Promise.all([createUsers(150)]);

  console.log(`seeded ${users.length} users`);
  console.log(`seeded successfully`);
};

// We've separated the `seed` function from the `runSeed` function.
// This way we can isolate the error handling and exit trapping.
// The `seed` function is concerned only with modifying the database.
const runSeed = async (): Promise<void> => {
  console.log("seeding...");
  try {
    await seed();
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    console.log("closing db connection");
    await dbConnection.close(); // ! ---------------------- not a function
    console.log("db connection closed");
  }
};

const createUsers = async (num: number): Promise<void> => {
  for (let i = num; i > 0; i--) {
    const user = await User.create({
      avatar: internet.avatar(),
      birthday: date.past(1920),
      email: internet.email(),
      firstName: name.firstName(),
      googleId: i % 4 === 0 ? random.uuid() : null,
      lastName: name.lastName(),
      password: internet.password(),
      phoneNumber: i % 3 === 0 ? phone.phoneNumber() : null,
      stripeId: i % 5 === 0 ? random.uuid() : null,
      username: internet.userName()
    });
    await createAddresses(user, i % 3);
  }
};

const createAddresses = async (user: User, num: number): Promise<void> => {
  for (let i = num; i > 0; i--) {
    await Address.create({
      city: address.city(),
      country: address.country(),
      googlePlaceId: random.uuid(),
      secondaryAddress: i % 2 === 0 ? address.secondaryAddress() : undefined,
      state: address.state(),
      streetAddress: address.streetAddress(),
      streetName: address.streetName(),
      user,
      zipCode: address.zipCode()
    });
  }
};

// Execute the `seed` function, IF we ran this module directly (`node seed`).
// `Async` functions always return a promise, so we can use `catch` to handle
// any errors that might occur inside of `seed`.
if (module === require.main) {
  runSeed();
}

// we export the seed function for testing purposes (see `./seed.spec.js`)
export default seed;
