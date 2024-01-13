const { first } = require("../db/connection");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const { isValid, parseISO, parse } = require("date-fns");
const service = require("./reservations.service");
const { response } = require("../app");

// Validations

function bodyDataHas(...propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;

    try {
      propertyName.forEach((property) => {
        if (!data[property]) {
          const error = new Error(`A ${property} property is required.`);
          error.status = 400;
          throw error;
        }
      });
      next();
    } catch (error) {
      next(error);
    }
  };
}
// validates that the required properties are not missing

const requiredProperties = bodyDataHas(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_time",
  "reservation_date",
  "people"
);

// Validates that date input is a date

function dateIsValid(req, res, next) {
  const { data: { reservation_date } = {} } = req.body;

  if (reservation_date && isValid(parseISO(reservation_date))) {
    return next();
  }
  next({ status: 400, message: `reservation_date` });
}

// Validates time input is in the right format

function timeIsValid(req, res, next) {
  const { data: { reservation_time } = {} } = req.body;

  // Define a regular expression to match the HH:mm format
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

  if (reservation_time && timeRegex.test(reservation_time)) {
    // Parse the time string and check if it is a valid time
    const parsedTime = parse(reservation_time, "HH:mm", new Date());

    if (isValid(parsedTime)) {
      return next();
    }
  }

  next({
    status: 400,
    message: "reservation_time",
  });
}

// Validates the people input
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

// Checks if the day is tuesday
function notTuesday(req, res, next) {
  const date = req.body.data.reservation_date;
  const weekday = new Date(date).getDay();

  if (weekday === 1) {
    return next({
      status: 400,
      message: "Restaurant is closed on Tuesdays.",
    });
  }
  next();
}

// Function that checks the date is only in the future

function notInThePast(req, res, next) {
  const { reservation_date, reservation_time } = req.body.data;
  const today = Date.now();
  const date = new Date(`${reservation_date} ${reservation_time}`).valueOf()

  if (date > today) {
    return next();
  }
  next({
    status: 400,
    message: "Reservation date has to be in the future."
  })
}

// Function to check if the reservation is within business hours

function isWithinOpenHours(req, res, next) {
  let openingTime = "10:30";
  let closingTime = "21:30";

  let { reservation_time } = req.body.data;
  console.log("time", reservation_time);
  if (reservation_time < openingTime || reservation_time > closingTime) {
    return next({
      status: 400,
      message: "Reservation can only be between 10:30 AM and 9:30 PM.",
    });
  }
  next();
}

//function to check if the reservation exists

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
//#######################################################

/**
 * List handler for reservation resources
 */

async function list(req, res) {
  const data = await service.list();

  const date = req.query.date;

  const filteredData = data.filter((element) => {
    const formattedDate = element.reservation_date.toISOString().split("T")[0];

    return formattedDate === date;
  });
  //if there is a date specified, return only those that match the reservation date

  let sortedData = filteredData.sort((a, b) => {
    if (a.reservation_time > b.reservation_time) {
      return 1;
    } else if (b.reservation_time > a.reservation_time) {
      return -1;
    } else {
      return 0;
    }
  });

  if (date) {
    res.json({ data: sortedData });
  } else {
    res.json({ data });
  }
}

//function to create a new reservation
async function create(req, res) {
  const newReservation = await service.create(req.body.data);

  newReservation.reservation_id++;

  res.status(201).json({
    data: newReservation,
  });
}

//function to read a sepcific reservation by ID
function read(req, res, next) {
  const data = res.locals.reservation;
  res.status(200).json({ data });
}

module.exports = {
  list,
  create: [
    asyncErrorBoundary(requiredProperties),
    asyncErrorBoundary(peopleIsANumber),
    asyncErrorBoundary(dateIsValid),
    asyncErrorBoundary(timeIsValid),
    asyncErrorBoundary(notTuesday),
    asyncErrorBoundary(notInThePast),
    asyncErrorBoundary(isWithinOpenHours),
    create,
  ],
  read: [asyncErrorBoundary(reservationExists), read]
};
