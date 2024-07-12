const Tester = require("./index");

const points = (points) => ["points", points];
const title = (title) => ["title", title];
const id = (id) => ["id", id];
const timeout = (timeout) => ["timeout", timeout];
const url = (url) => ["url", url];
const init = (fn) => ["init", fn];
const category = (category) => ["category", category];

const tester = (...args) => {
    let testerObject = { tasks: [], timeout: 2000, baseUrl: "http://127.0.0.1:3000", plugins: [] };
    for (const arg of args) {
        if (Array.isArray(arg)) {
            if (arg[0] === "tasks") testerObject.tasks = arg[1];
            if (arg[0] === "timeout") testerObject.timeout = arg[1];
            if (arg[0] === "url") testerObject.baseUrl = arg[1];
            if (arg[0] === "plugins") testerObject.plugins = arg[1];
            if (arg[0] === "init") testerObject.init = arg[1];
        }
    }
    new Tester(testerObject).run(process.argv);
};

const plugins = (...plugins) => {
    const pluginsArray = [];
    for (const plugin of plugins) {
        pluginsArray.push(plugin);
    }
    return ["plugins", pluginsArray];
};

const plugin = (plugin, config = null) => {
    if (!config) return plugin;
    else {
        return {
            module: plugin,
            config,
        };
    }
};

const tasks = (...tasks) => {
    const tasksArray = [];
    for (const task of tasks) {
        tasksArray.push(task);
    }
    return ["tasks", tasksArray];
};

const task = (...args) => {
    let taskObject = { title: "Nincs cím", category: "none", hooks: {}, prerequisite: () => {}, subtasks: [] };
    for (const arg of args) {
        if (Array.isArray(arg)) {
            if (arg[0] === "title") taskObject.title = arg[1];
            if (arg[0] === "hooks") taskObject.hooks = arg[1];
            if (arg[0] === "prerequisite") taskObject.prerequisite = arg[1];
            if (arg[0] === "subtasks") taskObject.subtasks = arg[1];
            if (arg[0] === "category") taskObject.category = arg[1];
        }
    }
    return taskObject;
};

const prerequisite = (fn) => {
    return ["prerequisite", fn];
};

const beforeAll = (fn) => ["beforeAll", fn];
const afterAll = (fn) => ["afterAll", fn];
const beforeEach = (fn) => ["beforeEach", fn];
const afterEach = (fn) => ["afterEach", fn];

const hooks = (...hooks) => {
    let hooksObject = {};
    for (const hook of hooks) {
        hooksObject[hook[0]] = hook[1];
    }
    return ["hooks", hooksObject];
};

const requires = (...args) => ["requires", [...args]];

const createSubtask = (...args) => {
    let subtaskObject = { title: "Nincs cím", points: 0, requires: [], required: false, fn: () => {} };
    for (const arg of args) {
        if (typeof arg === "function") subtaskObject.fn = arg;
        else if (Array.isArray(arg)) {
            if (arg[0] === "title") subtaskObject.title = arg[1];
            if (arg[0] === "points") subtaskObject.points = arg[1];
            if (arg[0] === "id") subtaskObject.id = arg[1];
            if (arg[0] === "requires") subtaskObject.requires = arg[1];
            if (arg[0] === "required") subtaskObject.required = arg[1];
        }
    }
    return subtaskObject;
};

const subtask = createSubtask;
const required = (...args) => createSubtask(...args, ["required", true]);

const subtasks = (...subtasks) => {
    let subtasksArray = [];
    // "Eddigi" id-k
    let IDs = [];
    // "Eddigi" required subtaskok id-jei
    let requiredIDs = [];
    for (const subtask of subtasks) {
        if (subtask.hasOwnProperty("requires")) {
            for (const id of subtask.requires) {
                if (!IDs.includes(id)) {
                    throw new Error(`A(z) ${subtask.title} részfeladat olyan részfeladatot követel meg, ami nem létezik előtte: ${id}`);
                }
            }
        }
        if (subtask.hasOwnProperty("id")) {
            if (IDs.includes(subtask.id)) {
                throw new Error(`A(z) ${subtask.title} részfeladat olyan azonosítót akar használni, amit egy korábbi részfeladat használ: ${id}`);
            }
            IDs.push(subtask.id);
        }
        subtask.requires = Array.from(new Set(requiredIDs.concat(subtask.requires)));
        subtasksArray.push(subtask);
        if (subtask.required === true) {
            if (!subtask.hasOwnProperty("id")) {
                throw new Error(`A(z) ${subtask.title} részfeladat required típusú, ezért kötelező neki ID-t adni: title(név, id)`);
            }
            requiredIDs.push(subtask.id);
        }
    }
    return ["subtasks", subtasksArray];
};

module.exports = {
    tester,
    plugins,
    plugin,
    timeout,
    url,
    init,
    tasks,
    points,
    title,
    task,
    beforeAll,
    afterAll,
    beforeEach,
    afterEach,
    hooks,
    subtask,
    id,
    required,
    requires,
    subtasks,
    prerequisite,
    category
};
