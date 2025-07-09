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
exports.ItemService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const item_entity_1 = require("./entities/item.entity");
const typeorm_2 = require("@nestjs/typeorm");
let ItemService = class ItemService {
    constructor(itemRepo) {
        this.itemRepo = itemRepo;
    }
    async findItems(keyword) {
        const query = this.itemRepo.createQueryBuilder('item');
        if (keyword) {
            query.where('item.name ILIKE :keyword', { keyword: `%${keyword}%` });
        }
        const items = await query.orderBy('item.name', 'ASC').getMany();
        return items;
    }
    async findItemById(id) {
        const item = await this.itemRepo.findOne({ where: { id } });
        if (!item) {
            throw new common_1.NotFoundException('Item gak ketemu');
        }
        return item;
    }
    async createItem(createItemDto) {
        const { name, price, isRedeemable, isGetPoint, canBeComplimented } = createItemDto;
        const item = this.itemRepo.create({
            name,
            price,
            isRedeemable,
            isGetPoint,
            canBeComplimented,
        });
        return this.itemRepo.save(item);
    }
    async updateItem(id, updateItemDto) {
        const item = await this.findItemById(id);
        const updatedItem = this.itemRepo.merge(item, updateItemDto);
        await this.itemRepo.save(updatedItem);
        return updatedItem;
    }
    async deleteItem(id) {
        const item = await this.findItemById(id);
        return await this.itemRepo.delete(item);
    }
};
exports.ItemService = ItemService;
exports.ItemService = ItemService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(item_entity_1.Item)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], ItemService);
//# sourceMappingURL=item.service.js.map