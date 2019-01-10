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

import { Address } from "./";

const defaultAvatar = path.resolve("public", "assets", "default-avatar.jpg");

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

  @IsUrl()
  @Column({ default: defaultAvatar })
  public avatar: string;

  @IsDate()
  @Column({ nullable: true })
  public birthday?: Date;

  @IsDate()
  @CreateDateColumn({ default: () => "NOW()" })
  public createdAt: Date;

  @IsEmail()
  @Column({ unique: true })
  public email: string;

  @IsNotEmpty()
  @Column({ nullable: true })
  public firstName?: string;

  @IsUUID()
  @IsNotEmpty()
  @Column({ nullable: true })
  public googleId?: string;

  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @IsNotEmpty()
  @Column({ nullable: true })
  public lastName?: string;

  @IsPhoneNumber("ZZ") // * "ZZ" for null --- prompt user for their region
  @Column({ nullable: true })
  public phoneNumber?: string;

  @IsNotEmpty()
  @Column()
  public password: string;

  @Column()
  public salt: string;

  @IsUUID()
  @Column({ nullable: true })
  public stripeId?: string;

  @Length(4, 16)
  @Column({ unique: true })
  public username: string;

  /**
   * One user can have many addresses.
   */
  @OneToMany(type => Address, address => address.user)
  public addresses?: Promise<Address[]>;

  /**
   * Virtual field for comparing changes in `password`.
   */
  /* tslint:disable-next-line:variable-name */
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
   * Compare a candidate password with a user's hashed
   * password in constant time (to prevent timing attacks).
   */
  public isValidPassword(encryptedCandidate: string): boolean {
    // const encryptedCandidate: string = User.encryptPassword(
    //   candidatePwd,
    //   this.salt
    // );

    if (this.password.length !== encryptedCandidate.length) return false;

    let result: number = 0;

    for (let i = encryptedCandidate.length - 1; i >= 0; i--) {
      // tslint:disable-next-line:no-bitwise
      result |= encryptedCandidate.charCodeAt(i) ^ this.password.charCodeAt(i);
    }

    return result === 0;
  }

  /**
   * Updates `_tempPassword` virtual field `AfterLoad`.
   */
  @AfterLoad()
  private _loadTempPassword(): void {
    this._tempPassword = this.password;
  }
}
