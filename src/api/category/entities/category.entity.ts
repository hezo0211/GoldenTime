import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Category{
    @PrimaryGeneratedColumn("uuid")
    CategoryID: string;
    @Column()
    CategoryName: string;
    @Column()
    Description: string;
    @CreateDateColumn()
    CreatedAt: Date;
    @UpdateDateColumn()
    UpdatedAt: Date;
}