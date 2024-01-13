const knex = require("../db/connection")


function create(newReservation) {
    return knex("reservations")
    .insert(newReservation, "*")    
    .then(reservation => reservation[0])
    
    
    
    }

function list() {
    return knex("reservations")
    .select("*")
}

function read(reservation_id) {
    return knex("reservations")
      .select("*")
      .where({reservation_id})
      .then((result) => result[0]);
  }

module.exports = {
    create, list,read
}