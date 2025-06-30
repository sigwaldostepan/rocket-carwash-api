"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const customer_entity_1 = require("./entities/customer.entity");
const typeorm_2 = require("typeorm");
let CustomerService = class CustomerService {
    constructor(customerRepo) {
        this.customerRepo = customerRepo;
    }
    async findCustomers({ limit, offset, q, by }) {
        const query = this.customerRepo.createQueryBuilder('customer');
        const whitelistSearchBy = ['phoneNumber', 'name'];
        const searchBy = whitelistSearchBy.includes(by) ? by : 'name';
        if (q) {
            query.where(`customer.${searchBy} ILIKE :keyword`, { keyword: `%${q}%` });
        }
        const [customers, total] = await query.orderBy('customer.name', 'ASC').take(limit).skip(offset).getManyAndCount();
        return {
            customers,
            total,
        };
    }
    async findCustomerById(id) {
        const customer = await this.customerRepo.findOne({
            where: { id },
        });
        if (!customer) {
            throw new common_1.NotFoundException('Customer nggak ketemu');
        }
        return customer;
    }
    async createCustomer(createCustomerDto) {
        const { name, phoneNumber } = createCustomerDto;
        const customer = this.customerRepo.create({
            code: this.generateCustomerCode(),
            name,
            phoneNumber,
        });
        await this.customerRepo.save(customer);
        return customer;
    }
    async updateCustomer(id, updateCustomerDto) {
        const customer = await this.findCustomerById(id);
        const updatedCustomer = this.customerRepo.merge(customer, updateCustomerDto);
        await this.customerRepo.save(updatedCustomer);
        return updatedCustomer;
    }
    generateCustomerCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const now = new Date();
        const year = now.getFullYear() % 100;
        const date = now.getDate().toString().padStart(2, '0');
        const month = now.getMonth().toString().padStart(2, '0');
        let uniqueCode = '';
        for (let i = 0; i < 5; i++) {
            uniqueCode += chars.charAt(Math.random() * chars.length).toUpperCase();
        }
        const customerCode = `RO${year}${month}${date}${uniqueCode}`;
        return customerCode;
    }
    async deleteCustomer(id) {
        const customer = await this.findCustomerById(id);
        return await this.customerRepo.delete(customer);
    }
};
exports.CustomerService = CustomerService;
exports.CustomerService = CustomerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(customer_entity_1.Customer)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CustomerService);
//# sourceMappingURL=customer.service.js.map