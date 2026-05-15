import { Turno } from "./Turno";

/**
 * Clase de dominio Cancha.
 * Contiene la lógica de negocio para la gestión de sus turnos.
 * PROHIBIDO usar console.log o interacción con el usuario en esta clase.
 */
export class Cancha {
    private id: number;
    private nombre: string;
    private turnos: Turno[];

    constructor(id: number, nombre: string) {
        this.id = id;
        this.nombre = nombre;
        this.turnos = [];
    }

    public getId(): number {
        return this.id;
    }

    public getNombre(): string {
        return this.nombre;
    }

    /**
     * Intenta reservar un turno en la cancha.
     * @param t Objeto Turno con la información de la persona y la hora.
     * @returns boolean true si es exitosa, false si está ocupado o fuera de horario.
     */
    public reservarTurno(t: Turno): boolean {
        const hora = t.getHora();

        // El complejo abre de 14:00 a 23:00 hs.
        // Los turnos válidos de una hora comienzan desde las 14 hasta las 22 inclusive.
        if (hora < 14 || hora > 22) {
            return false;
        }

        // Validar que no exista ya una reserva para esa misma hora
        if (this.estaOcupado(hora)) {
            return false;
        }

        // Agrega el turno a una lista y retorna true
        this.turnos.push(t);
        return true;
    }

    /**
     * Verifica si la cancha ya tiene un turno reservado en la hora indicada.
     * @param hora Hora a consultar.
     * @returns boolean true si está ocupado, false si está libre.
     */
    public estaOcupado(hora: number): boolean {
        for (const turno of this.turnos) {
            if (turno.getHora() === hora) {
                return true;
            }
        }
        return false;
    }

    /**
     * Devuelve el turno agendado en una hora específica, o null si está libre.
     * @param hora Hora a consultar.
     * @returns Turno | null
     */
    public getTurnoEnHora(hora: number): Turno | null {
        for (const turno of this.turnos) {
            if (turno.getHora() === hora) {
                return turno;
            }
        }
        return null;
    }

    /**
     * Elimina una reserva existente para una hora dada.
     * @param hora Hora del turno a cancelar.
     * @returns boolean true si se canceló correctamente, false si no existía el turno.
     */
    public cancelarTurno(hora: number): boolean {
        let indiceEncontrado = -1;
        for (let i = 0; i < this.turnos.length; i++) {
            if (this.turnos[i].getHora() === hora) {
                indiceEncontrado = i;
                break;
            }
        }

        if (indiceEncontrado !== -1) {
            this.turnos.splice(indiceEncontrado, 1);
            return true;
        }

        return false;
    }
}
