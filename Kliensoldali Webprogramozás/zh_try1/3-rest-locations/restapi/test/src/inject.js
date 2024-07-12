// A tesztelő a szervert egy child process-ként indítja el, és onnan tudja, hogy
// minden felállt a szerverben, hogy ez az üzenet megjelenik a szerver konzolon.
// Csak tesztelési környezetben működik, így a hallgatót nem zavarja majd.

const signal = "AUTOTESTER_API_SERVER_STARTED";

module.exports = {
    signal,
    handleStart: function () {
        if (process.env.NODE_ENV === "test") {
            process.send(signal);
        }
    },
};
