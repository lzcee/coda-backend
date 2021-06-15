import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BaseEntity,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  biography?: string;

  @Column({ nullable: true })
  photo?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  portfolio?: string;

  @Column({ nullable: true })
  area?: string;

  @Column('text', { nullable: true, array: true, default: [] })
  programmingLanguages?: string[];

  @Column('text', { nullable: true, array: true, default: [] })
  softwares?: string[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 8);
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
