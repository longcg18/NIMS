export interface Relation {
    start_device_code: string;

    start_device_type: string;

    start_device_int_port: string;

    end_device_code: string[];

    end_device_type: string[];

    end_device_int_port: string[];

    relation_id: string[];

    relation_key: string[];
}