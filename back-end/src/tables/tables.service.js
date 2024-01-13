const knex = require("../db/connection")


/*
Function to insert a new table into the "tables" table
*/ 
function create(newTable) {
    return knex("tables")
        .insert(newTable, "*")
        .then(table => table[0])
}
/*
Function to select all properties from the "tables table"
Orderes the tables by the table name
*/
function list() {
    return knex("tables")
        .select("*")
        .orderBy("table_name")
}
/*
Function to read a specific table by the table's ID
*/
function readTable(table_id) {
    return knex("tables").select("*").where({ table_id }).first();
}
/*
Function to read a specific reservation by the reservation ID
*/
function readReservation(reservation_id) {
    return knex("reservations").select("*").where({ reservation_id }).first();
  }
/*
    Function to update the seat reservation
    Finds the reservation, and updates the status to seated.
    Finds the table and updates the status to occupied
  */
function updateSeatReservation(reservation_id, table_id) {
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

module.exports = {
    create, list, readTable, updateSeatReservation,readReservation
}