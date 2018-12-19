import { IsNotEmpty, IsUUID, Length } from "class-validator";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";

import { User } from "./";

/**
 * Address model. Contains fields for name, email, phone, password and other user related information,
 * as well as methods for password encryption and verification.
 */
@Entity()
export default class Address extends BaseEntity {
  @IsNotEmpty()
  @Column({ nullable: false })
  public city: string;

  @Column({ nullable: false })
  public country: string;

  @IsUUID()
  @Column({ nullable: true })
  public googlePlaceId?: string;

  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({ nullable: true }) // !!!!!!! ?????????????
  public secondaryAddress: string;

  @Column({ nullable: false })
  public state: string;

  @IsNotEmpty()
  @Column({ nullable: false })
  public streetAddress: string;

  @IsNotEmpty()
  @Column({ nullable: false })
  public streetName: string;

  @Length(3, 12)
  @IsNotEmpty()
  @Column({ nullable: false })
  public zipCode: string;

  /**
   * Many addresses can be associated with one user.
   */
  @IsNotEmpty()
  @ManyToOne(type => User, user => user.addresses, { nullable: false })
  public user: User;
}
