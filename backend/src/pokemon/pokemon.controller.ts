import { Controller, Get, Query } from '@nestjs/common';
import { PokemonService } from './pokemon.service';

@Controller('pokemon')
export class PokemonController {
    constructor(private readonly pokemonService: PokemonService) {}

    @Get('cards')
    async getPokemonCards(@Query('name') name: string) {
        return this.pokemonService.searchPokemonCards(name);
    }
    @Get('card-details')
    async getPokemonCardDetails(@Query('name') name: string, @Query('number') number: string) {
        return this.pokemonService.getPokemonCardDetailsByNumber(name, number);
    }
}
