import { IsDate, IsEmail, IsPhoneNumber } from "class-validator";
import crypto from "crypto";
import {
  AfterLoad,
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn
} from "typeorm";

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

  @IsDate()
  @Column({ nullable: false })
  public birthday: Date;

  @IsDate()
  @CreateDateColumn({ default: () => "NOW()", nullable: false })
  public createdAt: Date;

  @IsEmail()
  @Column({ nullable: false, unique: true })
  public email: string;

  @Column({ nullable: false })
  public firstName: string;

  @Column({ unique: true })
  public googleId: string;

  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({ nullable: false })
  public lastName: string;

  @IsPhoneNumber("ZZ") // * "ZZ" for null, prompt user for their region
  @Column()
  public phoneNumber: string;

  @Column({ nullable: false })
  public password: string;

  @Column({ nullable: false })
  public salt: string;

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
