import { Configuration, Value } from '@itgorillaz/configify'
import { IsNotEmpty } from 'class-validator';

@Configuration()
export class TelegramConfiguration {
    @IsNotEmpty()
    @Value('TELEGRAM_API_TOKEN')
    apiToken: string = "";

    @IsNotEmpty()
    @Value('TELEGRAM_API_URL')
    apiUrl: string = "";
}