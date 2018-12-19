// tslint:disable:no-console

import { address, date, internet, name, phone, random } from "faker";
import { Connection, getConnection } from "typeorm";

import { Address, User } from "../server/db";
import { prettyLogger } from "../server/utils";
import { default as doggie } from "./doggie";

/**
 * Seeds the database with `process.env.SEED_NUM` random users and addresses.
 */
const seed = async (): Promise<Connection> => {
  const db = getConnection();
  if (db.isConnected == false) await db.connect();

  const seedUsers: Promise<User>[] = [];
  const seedAddresses: Promise<Address>[] = [];

  await createUsers(db, Number(process.env.SEED_NUM), seedUsers, seedAddresses);

  await Promise.all(seedUsers);
  await Promise.all(seedAddresses);

  prettyLogger("log", ...doggie(`Seeded ${process.env.SEED_NUM} users!`));

  return db;
};

/**
 * Creates `num` of new `user`s with associated `address`es (by invoking `createAddresses`).
 */
const createUsers = async (
  db: Connection,
  num: number,
  seedUsers: Promise<User>[],
  seedAddresses: Promise<Address>[]
): Promise<void> => {
  for (let i = num; i > 0; i--) {
    const newUser = buildUser(i);
    const createdUser = db.getRepository(User).save(newUser);

    seedUsers.push(createdUser);
    createdUser.then(() => createAddresses(db, newUser, i % 3, seedAddresses));
  }
};

/**
 * Build a `user` using fake data.
 */
const buildUser = (i: number): User => {
  const newUser = new User();
  newUser.avatar = internet.avatar();
  newUser.birthday = date.past(1920);
  newUser.email =
    newUser.firstName +
    random.uuid().split("-")[0] +
    "@" +
    internet.domainName();
  newUser.firstName = name.firstName();
  newUser.googleId = i % 4 === 0 ? random.uuid() : null;
  newUser.lastName = name.lastName();
  newUser.password = internet.password();
  newUser.phoneNumber = i % 3 === 0 ? phone.phoneNumber() : null;
  newUser.stripeId = i % 5 === 0 ? random.uuid() : null;
  newUser.username = internet.userName();

  return newUser;
};

/**
 * Given a `user`, creates a `num` of associated `address`es.
 */
const createAddresses = async (
  db: Connection,
  user: User,
  num: number,
  seedAddresses: Promise<Address>[]
): Promise<void> => {
  for (let i = num; i > 0; i--) {
    const newAddress = buildAddress(user, i);

    seedAddresses.push(db.getRepository(Address).save(newAddress));
  }
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
    prettyLogger("error", "\n" + JSON.stringify(err, null, 2));
    process.exitCode = 1;
  }
};

// Execute the `seed` function if we ran from the terminal (`npm run seed`).
if (module === require.main) {
  runSeed();
}

// export for testing purposes (see `./seed.spec.ts`)
export default seed;
