import { ArrayNotEmpty, IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateTransactionDto {
  @IsUUID()
  @IsNotEmpty({ message: 'ID Customer gak boleh kosong' })
  @IsString()
  customerId: string;

  @IsArray()
  @ArrayNotEmpty({ message: 'Item gk boleh kosong' })
  @IsString({ each: true })
  items: string[];

  @IsNotEmpty({ message: 'Metode pembayaran gk boleh kosong' })
  @IsString()
  paymentMethod: string;

  @IsOptional()
  @IsBoolean()
  isRedeemPoints?: boolean;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  redeemedItems: string[];

  @IsOptional()
  @IsBoolean()
  isCompliment?: boolean;
}
