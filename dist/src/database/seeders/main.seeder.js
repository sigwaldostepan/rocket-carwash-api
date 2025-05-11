"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const typeorm_extension_1 = require("typeorm-extension");
const typeorm_config_1 = require("../typeorm.config");
const customer_seeder_1 = __importDefault(require("./customer.seeder"));
const options = {
    ...typeorm_config_1.options,
    seeds: [customer_seeder_1.default],
};
const dataSource = new typeorm_1.DataSource(options);
dataSource.initialize().then(async () => {
    await dataSource.synchronize(true);
    await (0, typeorm_extension_1.runSeeders)(dataSource);
    process.exit();
});
//# sourceMappingURL=main.seeder.js.map