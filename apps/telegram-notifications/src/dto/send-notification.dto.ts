import { IsString, IsNotEmpty, MaxLength, IsOptional, IsIn, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TELEGRAM_PARSE_MODES } from '../constants/messages';

export class SendNotificationDto {
  @ApiProperty({ description: 'Текст уведомления (поддерживает HTML/Markdown)', maxLength: 4096, example: '<b>Новое событие</b>: user.registered' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(4096)
  message!: string;

  @ApiProperty({ description: 'ID чата Telegram', example: -1001234567890 })
  @IsNumber()
  @IsNotEmpty()
  chatId!: number;

  @ApiProperty({ description: 'Режим форматирования сообщения', enum: TELEGRAM_PARSE_MODES, required: false, example: 'HTML' })
  @IsIn(TELEGRAM_PARSE_MODES)
  @IsOptional()
  parseMode?: typeof TELEGRAM_PARSE_MODES;
}
