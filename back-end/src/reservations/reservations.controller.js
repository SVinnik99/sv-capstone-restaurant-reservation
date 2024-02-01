const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const { date, currentDate, mobile_number } = req.query;
  let reservations;

  if (date || currentDate) {
    const targetDate = date || currentDate;
    reservations = await service.listReservationsForDate(targetDate);
  } else if (mobile_number) {
    reservations = await service.listByPhone(mobile_number);
  } else {
    reservations = await service.list();
  }
  res.json({ data: reservations });
}

async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

async function createTable(req, res, next) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

async function listTables(req, res, next) {
  const data = await service.list();
  res.status(201).json({ data });
}

function read(req, res, next) {
  const data = res.locals.reservation;
  res.status(200).json({ data });
}

async function updateReservation(req, res, next) {
  const reservation = req.body.data;
  const newRes = await service.updateReservation(reservation);
  const result = newRes[0];
  res.status(200).json({ data: result });
}

async function updateResStatus(req, res, next) {
  const { status } = req.body.data;
  const reservation = res.locals.reservation;
  const data = await service.updateResStatus(
    reservation.reservation_id,
    status
  );
  res.status(200).json({ data: { status: data[0].status } });
}

// VALIDATION MIDDLEWARE

async function reservationExists(req, res, next) {
  const { reservation_id } = req.params;
  const reservation = await service.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation ${reservation_id} not found`,
  });
}

function notFinishedForUpdate(req, res, next) {
  const reservation = res.locals.reservation;
  if (reservation.status === "finished") {
    next({
      status: 400,
      message: "reservation cannot already be finished.",
    });
  } else {
    return next();
  }
}

function updateValidStatus(req, res, next) {
  const status = req.body.data.status;
  if (status !== "unknown") {
    return next();
  }
  next({
    status: 400,
    message: "status cannot be unknown.",
  });
}

const hasRequiredProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "reservation_time",
  "people"
);

function peopleIsANumber(req, res, next) {
  const people = req.body.data.people;

  if (people > 0 && typeof people === "number") {
    return next();
  }
  next({
    status: 400,
    message: "Valid people property required.",
  });
}

function reservationDateIsADate(req, res, next) {
  const date = req.body.data.reservation_date;
  const valid = Date.parse(date);

  if (valid) {
    return next();
  }
  next({
    status: 400,
    message: "reservation_date must be a valid date.",
  });
}

function reservationTimeIsATime(req, res, next) {
  const regex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
  const time = req.body.data.reservation_time;
  const valid = time.match(regex);
  if (valid) {
    return next();
  }
  next({
    status: 400,
    message: "reservation_time must be valid time.",
  });
}

function notTuesday(req, res, next) {
  const date = req.body.data.reservation_date;
  const weekday = new Date(date).getUTCDay();
 
  if (weekday === 2) {
    return next({
      status: 400,
      message: "Restaurant is closed on Tuesdays.",
    });
  }
  next();
}

function notInThePast(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  const today = Date.now();
  const proposedDate = new Date(
    `${reservation_date} ${reservation_time}`
  ).valueOf();
  if (proposedDate > today) {
    return next();
  }
  next({
    status: 400,
    message: "Reservation must be in the future.",
  });
}

function isWithinOpenHours(req, res, next) {
  let openingTime = "10:30";
  let closingTime = "21:30";

  let { reservation_time } = req.body.data;
 
  if (reservation_time < openingTime || reservation_time > closingTime) {
    return next({
      status: 400,
      message: "Reservation can only be between 10:30 AM and 9:30 PM.",
    });
  }
  next();
}

function notSeated(req, res, next) {
  const status = req.body.data.status;
  if (status !== "seated") {
    return next();
  }
  next({
    status: 400,
    message: "Status must not be 'seated'",
  });
}

function notFinished(req, res, next) {
  const status = req.body.data.status;
  if (status !== "finished") {
    return next();
  }
  next({
    status: 400,
    message: "Status must not be 'finished'",
  });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    hasRequiredProperties,
    reservationDateIsADate,
    reservationTimeIsATime,
    peopleIsANumber,
    notInThePast,
    notTuesday,
    isWithinOpenHours,
    notSeated,
    notFinished,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), read],
  updateReservation: [
    asyncErrorBoundary(reservationExists),
    hasRequiredProperties,
    reservationDateIsADate,
    reservationTimeIsATime,
    peopleIsANumber,
    notInThePast,
    notTuesday,
    isWithinOpenHours,
    notSeated,
    notFinished,
    asyncErrorBoundary(updateReservation),
  ],
  updateResStatus: [
    asyncErrorBoundary(reservationExists),
    notFinishedForUpdate,
    updateValidStatus,
    asyncErrorBoundary(updateResStatus),
  ],
  createTable: asyncErrorBoundary(createTable),
  listTables: asyncErrorBoundary(listTables),
};
