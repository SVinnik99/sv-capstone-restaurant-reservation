/**
 * Knex configuration file.
 *
 * You will not need to make changes to this file.
 */

require("dotenv").config();
const path = require("path");

const {
  DATABASE_URL = "postgres://pcubeheq:W7yUTxM01mKTNELHFzWTexZuwbXD_xee@otto.db.elephantsql.com/pcubeheq",
  DATABASE_URL_DEVELOPMENT = "postgres://pcubeheq:W7yUTxM01mKTNELHFzWTexZuwbXD_xee@otto.db.elephantsql.com/pcubeheq",
  DATABASE_URL_TEST = "postgres://pcubeheq:W7yUTxM01mKTNELHFzWTexZuwbXD_xee@otto.db.elephantsql.com/pcubeheq",
  DATABASE_URL_PREVIEW = "postgres://pcubeheq:W7yUTxM01mKTNELHFzWTexZuwbXD_xee@otto.db.elephantsql.com/pcubeheq",
  DEBUG,
} = process.env;

module.exports = {
  development: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_DEVELOPMENT,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  test: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_TEST,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  preview: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL_PREVIEW,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
  production: {
    client: "postgresql",
    pool: { min: 1, max: 5 },
    connection: DATABASE_URL,
    migrations: {
      directory: path.join(__dirname, "src", "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "src", "db", "seeds"),
    },
    debug: !!DEBUG,
  },
};
