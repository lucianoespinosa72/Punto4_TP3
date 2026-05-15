/**
 * Clase de entidad Turno.
 * Registra el nombre de la persona y la hora (en punto).
 * No contiene interacción con el usuario (sin console.log ni lectura de teclado).
 */
export class Turno {
    private persona: string;
    private hora: number; // Hora en punto (ej. 14, 15, ...)

    constructor(persona: string, hora: number) {
        this.persona = persona;
        this.hora = hora;
    }

    public getPersona(): string {
        return this.persona;
    }

    public getHora(): number {
        return this.hora;
    }
}
