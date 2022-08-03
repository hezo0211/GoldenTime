import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  refreshTokenId: string;

  @Column({
    type: 'text',
  })
  token: string;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
  })
  expiredAt: Date;
}
