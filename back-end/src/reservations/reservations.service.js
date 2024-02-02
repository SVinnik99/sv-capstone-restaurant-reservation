const knex = require("../db/connection");

function create(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function read(reservation_id) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id })
    .then((result) => result[0]);
}

function list() {
  return knex("reservations")
    .select("*")
    .whereNot({ status: "finished" })
    .orderBy("reservation_time");
}

function listReservationsForDate(date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .whereNot({ status: "finished" })
    .orderBy("reservation_time");
}

function listByPhone(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

function createTable(table) {
  return knex("tables")
    .insert(table)
    .select("*")
    .then((createdRecords) => createdRecords[0]);
}

function updateReservation(reservation) {
  const {
    reservation_id,
    first_name,
    last_name,
    mobile_number,
    reservation_date,
    reservation_time,
    people,
  } = reservation;
  return knex("reservations").where({ reservation_id }).update(
    {
      first_name: first_name,
      last_name: last_name,
      mobile_number: mobile_number,
      reservation_date: reservation_date,
      reservation_time: reservation_time,
      people: people,
    },
    [
      "first_name",
      "last_name",
      "mobile_number",
      "reservation_date",
      "reservation_time",
      "people",
    ]
  );
}

function updateResStatus(reservation_id, status) {
  return knex("reservations")
    .where({ reservation_id })
    .update({ status: status }, "*");
}

function listTables() {
  return knex("tables").select("*").orderBy("table_name");
}

module.exports = {
  create,
  read,
  updateReservation,
  updateResStatus,
  list,
  listReservationsForDate,
  listByPhone,
  createTable,
  listTables,
};
