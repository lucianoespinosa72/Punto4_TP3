import * as readline from 'readline';
import { Cancha } from './Cancha';
import { Turno } from './Turno';

/**
 * Clase principal Main (Interfaz con el usuario).
 * Encargada EXCLUSIVAMENTE de mostrar mensajes y leer ingresos.
 * Implementa un menú interactivo por consola.
 */
export class Main {
    private canchas: Cancha[];
    private rl: readline.Interface;

    constructor() {
        // Instanciar las 3 canchas de Fútbol 5
        this.canchas = [
            new Cancha(1, "Fútbol 5 - Cancha 1"),
            new Cancha(2, "Fútbol 5 - Cancha 2"),
            new Cancha(3, "Fútbol 5 - Cancha 3")
        ];

        // Configuración de la interfaz de lectura/escritura estándar nativa de Node
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    /**
     * Promesa simple para leer una entrada del usuario desde la consola.
     */
    private question(query: string): Promise<string> {
        return new Promise((resolve) => {
            this.rl.question(query, (respuesta) => {
                resolve(respuesta.trim());
            });
        });
    }

    /**
     * Inicia el bucle del menú interactivo.
     */
    public async iniciar(): Promise<void> {
        let salir = false;

        while (!salir) {
            console.log("\n==================================================");
            console.log("    COMPLEJO DEPORTIVO - GESTIÓN DE CANCHAS       ");
            console.log("==================================================");
            console.log(" Horario de apertura: 14:00 a 23:00 hs            ");
            console.log(" Turnos de 1 hora disponibles (14:00 a 22:00 hs)  ");
            console.log("==================================================");
            console.log(" 1. Ver estado de las canchas                     ");
            console.log(" 2. Reservar turno                                ");
            console.log(" 3. Cancelar reserva                              ");
            console.log(" 4. Salir                                         ");
            console.log("==================================================");

            const opcion = await this.question("Seleccione una opción: ");

            switch (opcion) {
                case "1":
                    this.mostrarEstadoCanchas();
                    break;
                case "2":
                    await this.gestionarReserva();
                    break;
                case "3":
                    await this.gestionarCancelacion();
                    break;
                case "4":
                    console.log("\n¡Gracias por utilizar el sistema de gestión!");
                    salir = true;
                    break;
                default:
                    console.log("\nOpción no válida. Por favor ingrese una opción entre 1 y 4.");
                    break;
            }

            if (!salir) {
                await this.question("\nPresione Enter para volver al menú principal...");
            }
        }

        this.rl.close();
    }

    /**
     * Muestra los horarios libres y ocupados de las 3 canchas.
     */
    private mostrarEstadoCanchas(): void {
        console.log("\n--------------------------------------------------");
        console.log(" ESTADO ACTUAL DE LAS CANCHAS                     ");
        console.log("--------------------------------------------------");

        for (const cancha of this.canchas) {
            console.log(`\n[${cancha.getId()}] ${cancha.getNombre()}:`);
            for (let hora = 14; hora <= 22; hora++) {
                const turno = cancha.getTurnoEnHora(hora);
                const etiquetaHora = `${hora}:00 hs`;
                if (turno !== null) {
                    console.log(`  - ${etiquetaHora} -> Ocupado (Reservado a nombre de: ${turno.getPersona()})`);
                } else {
                    console.log(`  - ${etiquetaHora} -> Libre`);
                }
            }
        }
    }

    /**
     * Flujo de interacción para registrar una nueva reserva.
     */
    private async gestionarReserva(): Promise<void> {
        console.log("\n--------------------------------------------------");
        console.log(" RESERVAR UN TURNO                                ");
        console.log("--------------------------------------------------");

        this.imprimirOpcionesCanchas();
        const idCanchaStr = await this.question("Seleccione el ID de la cancha (1-3): ");
        const idCancha = parseInt(idCanchaStr, 10);
        const cancha = this.obtenerCanchaPorId(idCancha);

        if (cancha === undefined || isNaN(idCancha)) {
            console.log("\nError: ID de cancha no válido.");
            return;
        }

        const nombre = await this.question("Ingrese el nombre de la persona: ");
        if (nombre === "") {
            console.log("\nError: El nombre no puede estar vacío.");
            return;
        }

        const horaStr = await this.question("Ingrese la hora en punto para el turno (ej. 14 para 14:00 hs): ");
        const hora = parseInt(horaStr, 10);

        if (isNaN(hora) || hora < 14 || hora > 22) {
            console.log("\nError: Hora fuera del rango permitido (14 a 22).");
            return;
        }

        // Instanciamos el objeto Turno
        const nuevoTurno = new Turno(nombre, hora);

        // Llamamos al método de la Cancha y reaccionamos estrictamente a su retorno booleano
        const exito = cancha.reservarTurno(nuevoTurno);

        if (exito) {
            console.log("\nReserva exitosa");
        } else {
            console.log("\nError: Turno ocupado");
        }
    }

    /**
     * Flujo de interacción para cancelar una reserva existente.
     */
    private async gestionarCancelacion(): Promise<void> {
        console.log("\n--------------------------------------------------");
        console.log(" CANCELAR UNA RESERVA                             ");
        console.log("--------------------------------------------------");

        this.imprimirOpcionesCanchas();
        const idCanchaStr = await this.question("Seleccione el ID de la cancha (1-3): ");
        const idCancha = parseInt(idCanchaStr, 10);
        const cancha = this.obtenerCanchaPorId(idCancha);

        if (cancha === undefined || isNaN(idCancha)) {
            console.log("\nError: ID de cancha no válido.");
            return;
        }

        const horaStr = await this.question("Ingrese la hora en punto del turno a cancelar (14-22): ");
        const hora = parseInt(horaStr, 10);

        if (isNaN(hora)) {
            console.log("\nError: La hora ingresada no es un número válido.");
            return;
        }

        const exito = cancha.cancelarTurno(hora);

        if (exito) {
            console.log("\nCancelación exitosa. El horario ha quedado liberado.");
        } else {
            console.log("\nError: No se encontró una reserva en esa hora para la cancha seleccionada.");
        }
    }

    /**
     * Método auxiliar para listar las canchas en consola.
     */
    private imprimirOpcionesCanchas(): void {
        console.log("Canchas disponibles:");
        for (const c of this.canchas) {
            console.log(`  ${c.getId()}. ${c.getNombre()}`);
        }
    }

    /**
     * Búsqueda simple de cancha por ID aplicando POO básica.
     */
    private obtenerCanchaPorId(id: number): Cancha | undefined {
        for (const c of this.canchas) {
            if (c.getId() === id) {
                return c;
            }
        }
        return undefined;
    }
}

// Punto de entrada de la aplicación
const aplicacion = new Main();
aplicacion.iniciar();
