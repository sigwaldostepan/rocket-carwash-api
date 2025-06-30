"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const typeorm_config_1 = require("../typeorm.config");
const transaction_seeder_1 = __importDefault(require("./transaction.seeder"));
const options = {
    ...typeorm_config_1.options,
    seeds: [transaction_seeder_1.default],
};
const dataSource = new typeorm_1.DataSource(options);
dataSource.initialize().then(async () => {
    process.exit();
});
//# sourceMappingURL=main.seeder.js.map