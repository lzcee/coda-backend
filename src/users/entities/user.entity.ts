import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  biography?: string;

  @Column({ nullable: true })
  photo?: string;

  @Column({ default: true })
  isActive: boolean;
}
