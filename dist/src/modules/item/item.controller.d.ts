import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
export declare class ItemController {
    private readonly itemService;
    constructor(itemService: ItemService);
    findItems(keywordParams: string): Promise<import("./entities/item.entity").Item[]>;
    findItem(id: string): Promise<import("./entities/item.entity").Item>;
    createItem(createItemDto: CreateItemDto): Promise<import("./entities/item.entity").Item>;
    editItem(id: string, updateItemDto: UpdateItemDto): Promise<import("./entities/item.entity").Item>;
    deleteItem(id: string): Promise<import("typeorm").DeleteResult>;
}
