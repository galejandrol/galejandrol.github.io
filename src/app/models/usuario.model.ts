export class Usuario {
    constructor(
        public nombre: string = '',
        public usuarioId: number = 0,
        public loginResult: number = 0,
        public loginError: string = '',
        public logueado: boolean = false,
    ){}
}
