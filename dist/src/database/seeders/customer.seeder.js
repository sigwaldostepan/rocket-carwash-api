"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const customer_data_json_1 = __importDefault(require("../../../data/customer_data.json"));
const customer_entity_1 = require("../../modules/customer/entities/customer.entity");
class CustomerSeeder {
    async run(dataSource) {
        const customerRepo = dataSource.getRepository(customer_entity_1.Customer);
        console.log('Seeding customer data...');
        for (const customer of customer_data_json_1.default) {
            const { code, phone_number, point, name } = customer;
            const customerEntity = customerRepo.create({
                code,
                name: String(name),
                phoneNumber: phone_number,
                point,
            });
            await customerRepo.save(customerEntity);
        }
    }
}
exports.default = CustomerSeeder;
//# sourceMappingURL=customer.seeder.js.map