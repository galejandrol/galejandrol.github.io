import { FiltroOptions } from "./filtro-options.model";

export class Filtro {
    constructor(
        public name: string = '',
        public label: string = '',
        public filterOptions: Array<FiltroOptions> = []
    ){}
}
