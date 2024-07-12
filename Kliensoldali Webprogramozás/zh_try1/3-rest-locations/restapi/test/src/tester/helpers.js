// Ezek általános könyvtárak, amik a tesztelő fejlesztését könnyítik meg
const chalk = require("chalk");
const { faker } = require("@faker-js/faker");
const slug = require("slug");
const lodash = require("lodash");
const axios = require("axios");
const date = require("date-and-time");

const toJSON = (data) => JSON.parse(JSON.stringify(data));

module.exports = {
    chalk,
    faker,
    slug,
    lodash,
    axios,
    date,
    toJSON,
};
