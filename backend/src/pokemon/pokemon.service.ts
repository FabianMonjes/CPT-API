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

    async searchPokemonCards(name: string): Promise<string[]> {
        try {
        const apiKey = this.configService.get<string>('POKEMON_TCG_API_KEY');
        if (!apiKey) {
            throw new HttpException('API Key no configurada', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        const url = `${this.apiUrl}?q=name:${name}`;
        const headers = { 'X-Api-Key': apiKey };

        const response = await firstValueFrom(this.httpService.get(url, { headers }));

        if (!response.data || !response.data.data.length) {
            throw new HttpException('No se encontraron cartas', HttpStatus.NOT_FOUND);
        }

        return response.data.data.map((card: any) => `${card.name}-#${card.number}`);
        
        } catch (error) {
        throw new HttpException(
            'Error al buscar cartas de Pokémon',
            HttpStatus.INTERNAL_SERVER_ERROR,
        );
        }
    }
    async getPokemonCardDetailsByNumber(name: string, number: string): Promise<{ name: string; number: string; imageUrl: string; price: number }> {
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
    
        return {
            name: `${card.name} ${card.number}`,
            number: card.number,
            imageUrl: card.images.large || card.images.small,
            price: card.cardmarket?.prices?.trendPrice || 0
        };
        } catch (error) {
        console.log(error);
        throw new HttpException('Error al obtener detalles de la carta', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
