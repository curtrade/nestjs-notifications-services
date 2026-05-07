import { IsString, IsNotEmpty, MaxLength, IsOptional, IsIn, IsNumber, IsPositive } from 'class-validator';
import { TELEGRAM_PARSE_MODES } from '../constants/messages';

export class SendNotificationDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(4096)
  message!: string;

  @IsNumber()
  @IsNotEmpty()
  chatId!: number;

  @IsIn(TELEGRAM_PARSE_MODES)
  @IsOptional()
  parseMode?: typeof TELEGRAM_PARSE_MODES;
}
