import { IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationDto } from '../../../common/dto';

export class FindCustomersDto extends PaginationDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => decodeURIComponent(value))
  q?: string;
}
