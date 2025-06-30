"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const transaction_entity_1 = require("../../modules/transaction/entities/transaction.entity");
const ExcelJS = __importStar(require("exceljs"));
const item_entity_1 = require("../../modules/item/entities/item.entity");
const transaction_detail_entity_1 = require("../../modules/transaction/entities/transaction-detail.entity");
const date_fns_1 = require("date-fns");
function parseExcelDate(excelValue) {
    if (excelValue instanceof Date) {
        return excelValue;
    }
    if (typeof excelValue === 'string') {
        const parsed = (0, date_fns_1.parse)(excelValue, 'dd-MM-yyyy HH:mm:ss', new Date());
        if (!isNaN(parsed.getTime())) {
            return parsed;
        }
    }
    if (typeof excelValue === 'number') {
        const date = new Date((excelValue - 25569) * 86400 * 1000);
        if (!isNaN(date.getTime())) {
            return date;
        }
    }
    console.warn('Could not parse date value:', excelValue);
    return null;
}
class TransactionSeeder {
    async run(dataSource) {
        try {
            const transactionRepo = dataSource.getRepository(transaction_entity_1.Transaction);
            const transactionDetailRepo = dataSource.getRepository(transaction_detail_entity_1.TransactionDetail);
            const getItem = async (name) => {
                const itemRepo = dataSource.getRepository(item_entity_1.Item);
                const item = await itemRepo.findOneBy({ name });
                return item;
            };
            console.log('Seeding transaction data...');
            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.readFile('data/transactions/sept24_transaction.xlsx');
            const worksheet = workbook.getWorksheet('Sheet1');
            console.log(`Data count : ${worksheet.actualRowCount}`);
            for (let i = 2; i <= worksheet.actualRowCount; i++) {
                console.log(`Processing row ${i}`);
                console.log(worksheet.getRow(i).values);
                const details = worksheet.getRow(i).values[5];
                const item = await getItem(details);
                const date = parseExcelDate(worksheet.getRow(i).values[3]);
                const transaction = transactionRepo.create({
                    invoiceNo: worksheet.getRow(i).values[1],
                    isNightShift: false,
                    transTotal: worksheet.getRow(i).values[8],
                    paymentMethod: worksheet.getRow(i).values[9],
                    isCompliment: false,
                    complimentValue: 0,
                    createdAt: date,
                });
                await transactionRepo.save(transaction);
                const transactionDetail = transactionDetailRepo.create({
                    transaction,
                    item,
                    quantity: 1,
                    redeemedQuantity: 0,
                });
                await transactionDetailRepo.save(transactionDetail);
            }
        }
        catch (error) {
            console.error('Error seeding transaction data:', error);
            throw error;
        }
    }
}
exports.default = TransactionSeeder;
//# sourceMappingURL=transaction.seeder.js.map