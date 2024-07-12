const TesterPlugin = require("./plugin.js");
const io = require("socket.io-client");

class SocketIO extends TesterPlugin {
    constructor(tester, logger, config) {
        super(tester);
        return this;
    }

    onTaskBegin({ task }) {
        task.ctx._sockets = {};

        // Task végén takarítás
        task.afterAll(async () => {
            await task.ctx.disconnectSockets();
        });

        task.ctx.connectSocket = async function connectSocket(address, timeout = 2000) {
            let socket = io(address);
            if (!socket) throw new Error(`Nem jött létre a socket, nem sikerült kapcsolódni ide: ${address}`);
            const timeOutPromise = new Promise((resolve, reject) => setTimeout(() => resolve("TIMED_OUT"), timeout));
            const connectionPromise = new Promise((resolve, reject) => {
                socket.once("connect", () => resolve());
                socket.once("error", (error) => {
                    reject(new Error(`Nem sikerült kapcsolódni ide: ${address} (${error.message})`));
                });
            });
            try {
                await Promise.race([connectionPromise, timeOutPromise]);
                task.ctx._sockets[socket.id] = socket;
                return task.ctx._sockets[socket.id];
            } catch (error) {
                await socket.close();
                throw error;
            }
        };

        task.ctx.disconnectSocket = async (socket) => {
            return await socket.close();
        };

        task.ctx.disconnectSockets = async () => {
            for (const socketId of Object.keys(task.ctx._sockets)) {
                await task.ctx._sockets[socketId].close();
            }
        };

        task.ctx.emitSocket = async function emit(socket, event, data, timeout = 2000) {
            // Két promise-ot kell indítani. Az egyik a timeout lejárta után fixen resolvál:
            const timeOutPromise = new Promise((resolve, reject) => setTimeout(() => reject(new Error(`Legalább ${timeout} ms-en keresztül nem jött válasz a szervertől`)), timeout));
            // A másik, ha megkapja a szerver felől az ACK-t, akkor azt resolválja (ha pedig hiba
            // történt, akkor azt):
            const ackPromise = new Promise((resolve, reject) => {
                try {
                    task.ctx._sockets[socket.id].emit(event, data, (ack) => {
                        // Két speciális esetet kell kezeljünk: az egyik, ha abszolút nincs ilyen event,
                        if (ack.hasOwnProperty("eventNotExists") && ack.eventNotExists === true) {
                            reject(new Error(`A(z) ${event} nevű esemény nem létezik a szerveren`));
                        }
                        // a másik, hogyha van, de emberünk nem adott meg hozzá ack-t, vagy az nem hívódik meg:
                        if (ack.hasOwnProperty("eventHasNoAck") && ack.eventHasNoAck === true) {
                            reject(new Error(`A(z) ${event} nevű esemény létezik ugyan, de nem adott nyugtázást (ack-t)`));
                        }
                        // Minden egyéb esetben a Promise a szerver felől érkező választ fogja feloldani.
                        resolve(ack);
                    });
                } catch (error) {
                    reject(error);
                }
            });
            // Végeredményében versenyeztetjük a fenti két promise-ot, szóval ha nem jön időben
            // válasz, akkor timeout lesz.
            return await Promise.race([ackPromise, timeOutPromise]);
        };
    }

    async load() {}

    async unload() {}
}

module.exports = SocketIO;
