export class Licencia {
    constructor(
        public alias: string = '',
        public razonSocial: string = '',
        public dbProvider: Number = 0,
        public URL: string = '',
        public cnnCatalog: string = '',
        public cnnUser: string = '',
        public cnnPassword: string = '',
        public fechaDeVencimiento: string = '',
        public connectionString: string = '',
    ){}
}
