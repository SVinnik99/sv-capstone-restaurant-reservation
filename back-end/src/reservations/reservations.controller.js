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

// Function
function notInThePast(req,res,next){
  const {reservation_date, reservation_time} = req.body.data;
  const today = Date.now();
  const date = new Date(`${reservation_date} ${reservation_time}`).valueOf()

  if(date > today){
    return next();
  }
  next({
    status:400,
    message:"Reservation date has to be in the future."
  })
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

async function create(req, res) {
  const newReservation = await service.create(req.body.data);

  newReservation.reservation_id++;

  res.status(201).json({
    data: newReservation,
  });
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
    create,
  ],
};
