import { Brand } from "src/api/brand/entities/brand.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Watch{
    @PrimaryGeneratedColumn()
    WatchID: string;
    @Column()
    WatchName: string;
    @Column()
    SKU: string;
    @ManyToOne(()=>Brand)
    @JoinColumn()
    Brand: Brand;
    @Column()
    Price: number;
    @Column()
    ImportPrice: number;
    @Column()
    WatchImage: string;
    @CreateDateColumn()
    CreatedAt: Date;
    @UpdateDateColumn()
    UpdatedAt: Date;
}