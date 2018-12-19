import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsUrl,
  IsUUID,
  Length
} from "class-validator";
import crypto from "crypto";
import path from "path";
import {
  AfterLoad,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";

const defaultAvatar = path.resolve(
  "..",
  "..",
  "..",
  "..",
  "public",
  "assets",
  "default-avatar.jpg"
);
import { Address } from "./";

/**
 * User model. Contains fields for name, email, phone, password and other user related information,
 * as well as methods for password encryption and verification.
 */
@Entity()
export default class User extends BaseEntity {
  /**
   * Generates a salt with which to encrypt the user's password in `encryptPassword`.
   */
  private static generateSalt(): string {
    return crypto.randomBytes(16).toString("base64");
  }

  /**
   * Encrypts the user's password using the salt generated in `generateSalt`.
   */
  private static encryptPassword(plainText: string, salt: string): string {
    return crypto
      .createHash("RSA-SHA256")
      .update(plainText)
      .update(salt)
      .digest("hex");
  }

  // ! upload to the interwebz client side...
  @IsUrl()
  @Column({ default: defaultAvatar })
  public avatar: string;

  @IsDate()
  @Column({ nullable: false })
  public birthday: Date;

  @IsDate()
  @CreateDateColumn({ default: () => "NOW()", nullable: false })
  public createdAt: Date;

  @IsEmail()
  @Column({ nullable: false, unique: true })
  public email: string;

  @IsNotEmpty()
  @Column({ nullable: false })
  public firstName: string;

  @IsUUID()
  @IsNotEmpty()
  @Column({ nullable: true, unique: true })
  public googleId?: string;

  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @IsNotEmpty()
  @Column({ nullable: false })
  public lastName: string;

  @IsPhoneNumber("ZZ") // * "ZZ" for null --- prompt user for their region
  @Column({ nullable: true })
  public phoneNumber?: string;

  @IsNotEmpty()
  @Column({ nullable: false })
  public password: string;

  @Column({ nullable: false })
  public salt: string;

  @IsUUID()
  @Column({ nullable: true })
  public stripeId?: string;

  @Length(4) // ! minimum length is 4 characters
  @IsNotEmpty()
  @Column({ nullable: false })
  public username: string;

  /**
   * One user can have many addresses.
   */
  @OneToMany(type => Address, address => address.user)
  public addresses?: Address[];

  /**
   * Virtual field for comparing changes in `password`.
   */
  /* tslint:disable-next-line */
  private _tempPassword: string;

  /**
   * Hook that generates salt and encrypts a password when a new user is created, or a password is updated.
   */
  @BeforeInsert()
  @BeforeUpdate()
  public setSaltAndPassword(): void {
    if (this.password !== this._tempPassword) {
      this.salt = User.generateSalt();
      this.password = User.encryptPassword(this.password, this.salt);
    }
  }

  /**
   * correctPassword (instance method)
   */
  public correctPassword(candidatePwd: any): boolean {
    return User.encryptPassword(candidatePwd, this.salt) === this.password;
  }

  /**
   * Updates `_tempPassword` virtual field `AfterLoad`.
   */
  @AfterLoad()
  private _loadTempPassword(): void {
    this._tempPassword = this.password;
  }
}
