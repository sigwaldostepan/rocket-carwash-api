import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Repository } from 'typeorm';
import { Item } from './entities/item.entity';
export declare class ItemService {
    private readonly itemRepo;
    constructor(itemRepo: Repository<Item>);
    findItems(keyword: string): Promise<Item[]>;
    findItemById(id: string): Promise<Item>;
    createItem(createItemDto: CreateItemDto): Promise<Item>;
    updateItem(id: string, updateItemDto: UpdateItemDto): Promise<Item>;
    deleteItem(id: string): Promise<import("typeorm").DeleteResult>;
}
