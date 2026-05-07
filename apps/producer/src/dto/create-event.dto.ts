import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ApiProperty({ description: 'Название события', minLength: 1, maxLength: 50, example: 'user.registered' })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  event!: string;

  @ApiProperty({ description: 'Комментарий к событию', minLength: 1, maxLength: 4096, required: false, example: 'Новый пользователь зарегистрировался через OAuth' })
  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(4096)
  comment?: string;
}