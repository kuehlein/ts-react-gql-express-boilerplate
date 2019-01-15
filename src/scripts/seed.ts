// tslint:disable:no-console

import { address, date, internet, name, phone, random } from "faker";
import { Connection, getConnection } from "typeorm";

import { Address, User } from "../server/db";
import { prettyLogger } from "../server/utils";
import { default as doggie } from "./doggie";

// ! how to sync db to overwrite data / error when drop tables + run

/**
 * Seeds the database with `process.env.SEED_NUM` random users and addresses.
 */
const seed = async (): Promise<Connection> => {
  const db = getConnection();
  if (db.isConnected === false) {
    await db.connect().catch(err => console.log(err));
  }

  createUsers(db, Number(process.env.SEED_NUM));

  prettyLogger("log", ...doggie(`Seeded ${process.env.SEED_NUM} users!`));

  return db;
};

/**
 * Creates `num` of new `user`s with associated `address`es,
 * bulk creates the users, then addresses.
 */
const createUsers = async (db: Connection, num: number): Promise<void> => {
  const users: User[] = [];
  const addresses: Address[] = [];

  for (let i = num; i > 0; i--) {
    const newUser = buildUser(i);
    users.push(newUser);
    createAddresses(addresses, newUser, i % 3);
  }

  await db
    .createQueryBuilder()
    .insert()
    .into(User)
    .values(users)
    .execute()
    .catch(err => console.log(err));

  await db
    .createQueryBuilder()
    .insert()
    .into(Address)
    .values(addresses)
    .execute()
    .catch(err => console.log(err));
};

/**
 * Build a `user` using fake data.
 */
const buildUser = (i: number): User => {
  const newUser = new User();

  newUser.avatar = internet.avatar();
  newUser.birthday = date.past(1920);
  newUser.firstName = name.firstName();
  newUser.email =
    newUser.firstName +
    random.uuid().split("-")[0] +
    "@" +
    internet.domainName();
  newUser.googleId = i % 4 === 0 ? random.uuid() : null;
  newUser.lastName = name.lastName();
  newUser.password = internet.password();
  newUser.phoneNumber = i % 3 === 0 ? phone.phoneNumber() : null;
  newUser.stripeId = i % 5 === 0 ? random.uuid() : null;
  newUser.username = internet.userName() + random.uuid().split("-")[0];

  return newUser;
};

/**
 * Given a `user`, creates a `num` (0 - 2) of associated `address`es.
 */
const createAddresses = (
  addresses: Address[],
  user: User,
  num: number
): Address[] => {
  for (let i = num; i > 0; i--) {
    addresses.push(buildAddress(user, i));
  }

  return addresses;
};

/**
 * Build a fake `address` associated to a given `user`.
 */
const buildAddress = (user: User, i: number): Address => {
  const newAddress = new Address();
  newAddress.city = address.city();
  newAddress.country = address.country();
  newAddress.googlePlaceId = random.uuid();
  newAddress.secondaryAddress =
    i % 2 === 0 ? address.secondaryAddress() : undefined;
  newAddress.state = address.state();
  newAddress.streetAddress = address.streetAddress();
  newAddress.streetName = address.streetName();
  newAddress.user = user;
  newAddress.zipCode = address.zipCode();

  return newAddress;
};

/**
 * Invokes the `seed` function, handles errors and logs output.
 */
const runSeed = async (): Promise<void> => {
  let db: Connection;

  console.log("seeding...");

  try {
    db = await seed();
    console.log("Closing db connection...");
    await db.close();
    console.log("Db connection closed.");
  } catch (err) {
    console.log(err);
    // ! vvv not properly logging
    // prettyLogger("error", "\n" + JSON.stringify(err, null, 2));
    process.exitCode = 1;
  }
};

// Execute the `seed` function if we ran from the terminal (`npm run seed`).
if (module === require.main) {
  runSeed();
}

// export for testing purposes (see `./seed.spec.ts`)
export default seed;
