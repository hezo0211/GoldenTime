import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Brand{
    @PrimaryGeneratedColumn("uuid")
    BrandID: string;
    @Column()
    BrandName: string;
    @Column()
    Description: string;
    @CreateDateColumn()
    CreatedAt: Date;
    @UpdateDateColumn()
    UpdatedAt: Date;
}