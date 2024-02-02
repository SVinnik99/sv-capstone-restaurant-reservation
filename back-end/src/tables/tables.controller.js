const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

async function create(req, res, next) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

async function updateSeatRes(req, res) {
  const { reservation, table } = res.locals;
  const data = await service.updateSeatRes(
    reservation.reservation_id,
    table.table_id
  );
  res.json({ data });
  console.log("potato", data);
}

async function deleteTableAssignment(req, res, next) {
  const { table } = res.locals;
  await service.deleteTableAssignment(table.table_id, table.reservation_id);
  const data = await service.list();
  res.status(200).json({ data });
}

async function list(req, res, next) {
  const data = await service.list();
  res.status(200).json({ data });
}

// VALIDATION MIDDLEWARE

async function tableExists(req, res, next) {
  const table_id = req.params.table_id;
  const table = await service.readTable(table_id);
  if (table) {
    res.locals.table = table;
    return next();
  }
  next({
    status: 404,
    message: `Table ${table_id} does not exist`,
  });
}

async function reservationExists(req, res, next) {
  const reservation = await service.readReservation(
    req.body.data.reservation_id
  );
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `reservation_id ${req.body.data.reservation_id} does not exist`,
  });
}

function reservationPeopleFewerThanCapacity(req, res, next) {
  const { reservation, table } = res.locals;
  if (reservation.people > table.capacity) {
    next({
      status: 400,
      message: "table capacity is smaller than reservation size",
    });
  }
  return next();
}

function hasData(req, res, next) {
  if (req.body.data) {
    return next();
  }
  next({
    status: 400,
    message: "Body must have a data property.",
  });
}

const hasRequiredProperties = hasProperties("table_name", "capacity");

function hasReservationID(req, res, next) {
  const reservation = req.body.data.reservation_id;
  if (reservation) {
    return next();
  }
  next({
    status: 400,
    message: "reservation_id required",
  });
}

function validTableName(req, res, next) {
  const tableName = req.body.data.table_name;
  if (tableName.length >= 2) {
    return next();
  }
  next({
    status: 400,
    message: "table_name must be longer than 2 characters.",
  });
}

function validTableCapacity(req, res, next) {
  const capacity = req.body.data.capacity;
  if (typeof capacity === "number" && capacity >= 1) {
    return next();
  }
  next({
    status: 400,
    message: "capacity not valid.",
  });
}

function tableOpen(req, res, next) {
  const table = res.locals.table;
  if (!table.reservation_id) {
    return next();
  }
  next({
    status: 400,
    message: `table_id is occupied`,
  });
}

function tableOccupied(req, res, next) {
  const table = res.locals.table;
  if (table.reservation_id) {
    return next();
  }
  next({
    status: 400,
    message: `Table ${table.table_id} is not occupied.`,
  });
}

function resNotAlreadySeated(req, res, next) {
  const reservation = res.locals.reservation;
  if (reservation.status !== "seated") {
    return next();
  }
  next({
    status: 400,
    message: "Reservation is already seated.",
  });
}

module.exports = {
  create: [
    hasData,
    hasRequiredProperties,
    validTableName,
    validTableCapacity,
    asyncErrorBoundary(create),
  ],
  updateSeatRes: [
    hasData,
    hasReservationID,
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(reservationExists),
    resNotAlreadySeated,
    tableOpen,
    asyncErrorBoundary(reservationPeopleFewerThanCapacity),
    asyncErrorBoundary(updateSeatRes),
  ],
  delete: [
    asyncErrorBoundary(tableExists),
    tableOccupied,
    asyncErrorBoundary(deleteTableAssignment),
  ],
  list: asyncErrorBoundary(list),
};
