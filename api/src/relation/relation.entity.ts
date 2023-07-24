import {
    Column, Entity, PrimaryGeneratedColumn, Timestamp
} from 'typeorm';

@Entity()
export class Relation {
    @PrimaryGeneratedColumn() 
    id: number;

    @Column()
    relation_id: string;
    
    @Column()
    relation_key: string;

    @Column()
    node_code: string;

    @Column()
    interface_port: string;

    @Column()
    node_type: string;

    @Column()
    node_code_relation: string;

    @Column()
    interface_port_relation: string;

    @Column() 
    node_type_relation: string;

    @Column({nullable: true})
    link_id: string;

    @Column({nullable: true}) 
    mac_relation: string;

    @Column({nullable: true})
    type: number;

    @Column({nullable: true})
    update_time: string;

    @Column({nullable: true})
    create_date: string;

    @Column({nullable: true})
    row_status: number;

    @Column({nullable: true})
    data_source: number;

    @Column({nullable: true})
    link_type: string;

    @Column({nullable: true})
    vendor: string;
}