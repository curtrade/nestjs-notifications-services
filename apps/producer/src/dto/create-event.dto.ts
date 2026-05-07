import { IsString, IsNotEmpty, MinLength, MaxLength, IsOptional } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  event!: string;

  @IsString()
  @IsOptional()
  @MinLength(1)
  @MaxLength(4096)
  comment?: string;
}