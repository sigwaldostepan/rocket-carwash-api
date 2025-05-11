import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';
import { FindCustomersDto } from './dtos/find-customer.dto';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
export declare class CustomerService {
    private readonly customerRepo;
    constructor(customerRepo: Repository<Customer>);
    findCustomers({ limit, offset, q }: FindCustomersDto): Promise<{
        customers: Customer[];
        total: number;
    }>;
    findCustomerById(id: string): Promise<Customer>;
    createCustomer(createCustomerDto: CreateCustomerDto): Promise<Customer>;
    updateCustomer(id: string, updateCustomerDto: UpdateCustomerDto): Promise<Customer>;
    private generateCustomerCode;
}
