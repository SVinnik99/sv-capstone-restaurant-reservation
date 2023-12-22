const service = require("./reservations.service")






/**
 * List handler for reservation resources
 */

async function list(req, res) {

  const data = await service.list()

  res.json({ data });
}

async function create(req,res){
  const newReservation = await service.create(req.body.data)

  newReservation.reservation_id++

  res.status(201).json({
    data: newReservation
  })
}

module.exports = {
  list, create
};
