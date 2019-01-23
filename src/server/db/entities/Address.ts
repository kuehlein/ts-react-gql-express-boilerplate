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
  @Column()
  public city: string;

  @IsNotEmpty()
  @Column()
  public country: string;

  @IsUUID()
  @Column({ nullable: true })
  public googlePlaceId?: string;

  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({ nullable: true })
  public secondaryAddress?: string;

  @IsNotEmpty()
  @Column()
  public state: string;

  @IsNotEmpty()
  @Column()
  public streetAddress: string;

  @IsNotEmpty()
  @Column()
  public streetName: string;

  @Length(3, 12)
  @IsNotEmpty()
  @Column()
  public zipCode: string;

  /**
   * Many addresses can be associated with one user.
   */
  @IsNotEmpty()
  @ManyToOne(type => User, user => user.addresses, { nullable: false })
  public user: User;
}
