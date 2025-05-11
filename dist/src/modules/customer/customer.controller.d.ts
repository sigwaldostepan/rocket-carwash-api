import { FindCustomersDto } from './dtos/find-customer.dto';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { UpdateCustomerDto } from './dtos/update-customer.dto';
export declare class CustomerController {
    private readonly customerService;
    constructor(customerService: CustomerService);
    findCustomers(findCustomersDto: FindCustomersDto): Promise<{
        data: import("./entities/customer.entity").Customer[];
        meta: {
            currentPage: number;
            perPage: number;
            totalItems: number;
            totalPages: number;
        };
    }>;
    findCustomer(id: string): Promise<import("./entities/customer.entity").Customer>;
    createCustomer(createCustomerDto: CreateCustomerDto): Promise<import("./entities/customer.entity").Customer>;
    updateCustomer(id: string, updateCustomerDto: UpdateCustomerDto): Promise<import("./entities/customer.entity").Customer>;
}
