import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';
// import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  // @Exclude()
  @Column()
  password: string;

  @AfterInsert()
  logInsert() {
    console.log('Entity inserted with id ' + this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Entity removed with id ' + this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Entity updated with id ' + this.id);
  }
}
