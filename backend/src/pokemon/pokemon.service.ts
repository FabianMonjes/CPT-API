import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PokemonService {
    private apiUrl = 'https://api.pokemontcg.io/v2/cards';

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {}

    async searchPokemonCards(name: string): Promise<{ result: string[]; status: number }> {
        try {
            if (!name) {
                throw new HttpException('Nombre no proporcionado', HttpStatus.BAD_REQUEST);

            }

            const apiKey = this.configService.get<string>('POKEMON_TCG_API_KEY');
            if (!apiKey) {
                throw new HttpException('API Key no configurada', HttpStatus.INTERNAL_SERVER_ERROR);
            }
    
            // Hacemos que la búsqueda sea más flexible con '*name*' (como un LIKE en SQL)
            const url = `${this.apiUrl}?q=name:*${name}*`;
            const headers = { 'X-Api-Key': apiKey };
    
            const response = await firstValueFrom(this.httpService.get(url, { headers }));
    
            if (!response.data || !response.data.data.length) {
                throw new HttpException('No se encontraron cartas', HttpStatus.NOT_FOUND);
            }
            return {
                result: response.data.data.map((card: any) => `${card.name}-#${card.number}`),
                status: HttpStatus.OK,
            };
            
        } catch (error) {
            console.log(error);
            throw new HttpException(
                'Error al buscar cartas de Pokémon',
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
            
        }
    }

    async getPokemonCardDetailsByNumber(name: string, number: string): Promise<{ nombre: string; numero: string; imagen: string; valor_actual: string; valor_minimo: string; valor_reversa: string; valor_maximo: string; }> {
        try {
        const apiKey = this.configService.get<string>('POKEMON_TCG_API_KEY');
        if (!apiKey) {
            throw new HttpException('API Key no configurada', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    
        const url = `${this.apiUrl}?q=name:"${name}" number:${number}`;
        const headers = { 'X-Api-Key': apiKey };
    
        const response = await firstValueFrom(this.httpService.get(url, { headers }));
    
        if (!response.data || !response.data.data.length) {
            throw new HttpException('No se encontró la carta', HttpStatus.NOT_FOUND);
        }
    
        const card = response.data.data.find(c => c.number === number); // Filtramos por número exacto
        if (!card) {
            throw new HttpException('No se encontró la carta con ese número', HttpStatus.NOT_FOUND);
        }
        // console.log(card.cardmarket);
        // console.log(card.cardmarket?.prices?.trendPrice);

        return {
            nombre: `${card.name} ${card.number}`,
            numero: card.number,
            imagen: card.images.large || card.images.small,
            valor_actual: await this.convertPriceToChileanPesos(card.cardmarket?.prices?.trendPrice) || '',
            valor_minimo: await this.convertPriceToChileanPesos(card.cardmarket?.prices?.lowPriceExPlus) || '',
            valor_reversa : await this.convertPriceToChileanPesos(card.cardmarket?.prices?.reverseHoloTrend) || '',
            valor_maximo : await this.convertPriceToChileanPesos(card.cardmarket?.prices?.avg30) || '',
        };
        } catch (error) {
        console.log(error);
        throw new HttpException('Error al obtener detalles de la carta', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async convertPriceToChileanPesos(price: number): Promise<string> {
        try {
            const apiKey = this.configService.get<string>('CURRENCY_API_KEY');
            if (!apiKey) {
                throw new HttpException('API Key no configurada', HttpStatus.INTERNAL_SERVER_ERROR);
            }
    
            const url = `https://open.er-api.com/v6/latest/USD`;
            const headers = { 'X-Api-Key': apiKey };
    
            const response = await firstValueFrom(this.httpService.get(url, { headers }));
    
            if (!response.data || !response.data.rates || !response.data.rates.CLP) {
                throw new HttpException('No se pudo obtener la tasa de cambio', HttpStatus.NOT_FOUND);
            }
    
            const exchangeRate = response.data.rates.CLP;
            
            const priceChilean = Math.round(price * exchangeRate);

            //colocar el precio en miles y con el signo $
            const priceChileanFormatted = priceChilean.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            const priceChileanWithSign = `$${priceChileanFormatted}`;

            return priceChileanWithSign;
        } catch (error) {
            console.log(error);
            throw new HttpException('Error al convertir el precio', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
