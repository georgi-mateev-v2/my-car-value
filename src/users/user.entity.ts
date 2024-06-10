import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany
} from 'typeorm';
import { Report } from '../reports/report.entity'

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  // @Exclude()
  @Column()
  password: string;

  @Column({ default: true })
  admin: boolean;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

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
