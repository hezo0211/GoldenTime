import { User } from "src/api/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { OrderStatus } from "../enum/orderstatus.enum";
import { PaymentMethod } from "../enum/PaymentMethod.enum";
import { OrderDetail } from "./orderdetail.entity";

@Entity()
export class Order{
    @PrimaryGeneratedColumn()
    OrderID: string;
    @ManyToOne(()=>User)
    @JoinColumn()
    Owner: User;
    @Column()
    Status: OrderStatus;
    @Column()
    PostCode: string; 
    @Column()
    Note: string;
    @Column()
    OrderFirstName: string;
    @Column()
    OrderLastName: string;
    @Column()
    OrderCity: string;
    @Column()
    OrderAddress:string;
    @Column()
    PaymentMethod:PaymentMethod;
    @Column()
    DatePurchase: Date;
    @CreateDateColumn()
    CreatedAt: Date;
    @UpdateDateColumn()
    UpdatedAt: Date;
    @OneToMany(()=>OrderDetail,(Detail)=>Detail.OrderID)
    Detail:[OrderDetail];
}