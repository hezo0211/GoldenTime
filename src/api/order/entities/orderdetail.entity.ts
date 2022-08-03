import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class OrderDetail{
    @PrimaryColumn("uuid")
    OrderID: string;
    @PrimaryColumn("uuid")
    WatchID: string;
    @Column()
    Price: number;
    @Column()
    Quantity: number;
}
