// import crypto from "crypto";
// import {
//   AllowNull,
//   AutoIncrement,
//   BeforeCreate,
//   BeforeUpdate,
//   Column,
//   CreatedAt,
//   Model,
//   Table,
//   Unique
// } from "sequelize-typescript";

// @Table
// export default class User extends Model<User> {
//   /**
//    * generateSalt (class method)
//    */
//   public static generateSalt(): string {
//     return crypto.randomBytes(16).toString("base64");
//   }

//   /**
//    * encryptPassword (class method)
//    */
//   public static encryptPassword(plainText: string, salt: string): string {
//     return crypto
//       .createHash("RSA-SHA256")
//       .update(plainText)
//       .update(salt)
//       .digest("hex");
//   }

//   /**
//    * setSaltAndPassword (hook)
//    */
//   @BeforeCreate
//   @BeforeUpdate
//   public static setSaltAndPassword(user: User): void {
//     if (user.changed("password")) {
//       user.salt = User.generateSalt();
//       user.password = User.encryptPassword(user.password, user.salt);
//     }
//   }

//   @AllowNull(false)
//   @AutoIncrement
//   @Unique
//   @Column
//   public id: string;

//   @AllowNull(false)
//   @Unique
//   @Column
//   public email: string;

//   @Column
//   public googleId: string;

//   @Column
//   public password: string;

//   @Column
//   public salt: string;

//   @CreatedAt
//   @Column
//   public createdAt: Date;

//   /**
//    * correctPassword (instance method)
//    */
//   public correctPassword(candidatePwd: any): boolean {
//     return User.encryptPassword(candidatePwd, this.salt) === this.password;
//   }
// }

const User = "Not actually User";

export default User;
