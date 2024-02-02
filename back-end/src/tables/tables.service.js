const knex = require("../db/connection");

function create(table) {
  return knex("tables")
    .insert(table)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function readTable(table_id) {
  return knex("tables").select("*").where({ table_id }).first();
}

function readReservation(reservation_id) {
  return knex("reservations").select("*").where({ reservation_id }).first();
}

function updateSeatRes(reservation_id, table_id) {
  return knex("reservations")
    .where({ reservation_id })
    .update({ status: "seated" })
    .then(() => {
      return knex("tables")
        .where({ table_id })
        .update({
          reservation_id: reservation_id,
          table_status: "occupied",
        })
        .returning("*");
    });
}

function deleteTableAssignment(table_id, reservation_id) {
  return knex("tables")
    .where({ table_id })
    .update(
      {
        reservation_id: null,
        table_status: "free",
      },
      "*"
    )
    .then(() => {
      return knex("reservations")
        .where({ reservation_id })
        .update({ status: "finished" }, "*");
    });
}

function list() {
  return knex("tables").select("*").orderBy("table_name");
}

module.exports = {
  create,
  readReservation,
  readTable,
  updateSeatRes,
  deleteTableAssignment,
  list,
};
