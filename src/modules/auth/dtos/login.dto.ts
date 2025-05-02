import { IsDefined, IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @IsDefined({ message: 'Email gak boleh kosong' })
  @IsNotEmpty({ message: 'Email gak boleh kosong' })
  @IsEmail({}, { message: 'Invalid email' })
  email: string;

  @IsString()
  @IsDefined({ message: 'Password gak boleh kosong' })
  @IsNotEmpty({ message: 'Password gak boleh kosong' })
  @MinLength(8, { message: 'Password minimal 8 karakter' })
  @MaxLength(30, { message: 'Password maksimal 30 karakter' })
  password: string;
}
