import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, MaxLength, Min } from 'class-validator';

export class CreateItemDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama item gak boleh kosong' })
  @MaxLength(200, { message: 'Nama item maksimal 200 karakter' })
  name: string;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @Min(0, { message: 'Harga item gak boleh negatif' })
  price: number;
}
