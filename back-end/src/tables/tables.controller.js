const service = require("./tables.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")


/*------------------Validation functions---------------------*/

/*
Function that takes in required properties name and checks 
the body for those same properties. 
*/
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
/*
The required properties for tables
*/
const requiredProperties = bodyDataHas(
  "table_name",
  "capacity",

);
function hasData(req, res, next) {
  if (req.body.data) {
    return next();
  }
  next({
    status: 400,
    message: "Body must have a data property.",
  });
}


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

//validates capacity is a number
function capacityIsANumber(req, res, next) {
  const capacity = req.body.data.capacity;

  if (capacity > 0 && typeof capacity === "number") {
    return next();
  }
  next({
    status: 400,
    message: "Valid capacity property required.",
  });
}

//validates table name is more than 1 character long
function tableNameLength(req, res, next) {
  const table_name = req.body.data.table_name;

  if (table_name.length > 1) {
    return next();
  }
  next({
    status: 400,
    message: "Valid table_name property required.",
  });

}

//read a specific table by id
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
/*
Function to verify that a reservation exists
*/
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
/*
Function to validate table capacity is sufficient 
 */
function sufficientTableCapacity(req, res, next) {
  const { reservation, table } = res.locals;
  if (reservation.people > table.capacity) {
    next({
      status: 400,
      message: "table capacity is smaller than reservation size",
    });
  } else {
    res.sendStatus(200).next()
  }

}
/*
Function to validate the table is not occupied
*/
function tableNotOccupied(req, res, next) {
  const { table } = res.locals;

  if (!table.reservation_id) {
    // Table is not occupied, proceed to the next middleware
    return next();
  }

  // Table is already occupied, send an error response
  next({
    status: 400,
    message: 'Table is already occupied.',
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
/*-------------------CRUD FUNCTIONS------------------*/


/*
Function to list all tables
*/
async function list(req, res, next) {

  const data = await service.list()

  res.json({ data })
}
/*
Function to create a new table 
 */
async function create(req, res) {
  const newTable = await service.create(req.body.data);

  newTable.table_id++;

  res.status(201).json({
    data: newTable,
  });
}

/*
Function to update a seat reservation
*/
async function updateSeatReservation(req, res) {
  const { reservation, table } = res.locals;
  const data = await service.updateSeatReservation(
    reservation.reservation_id,
    table.table_id
  );
  res.json({ data });
  console.log("hello")
}

module.exports = {
  list,
  create:
    [asyncErrorBoundary(requiredProperties),
    asyncErrorBoundary(capacityIsANumber),
    asyncErrorBoundary(tableNameLength),
      create],

  updateSeatReservation: [
    hasData,
    hasReservationID,
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(reservationExists),
    resNotAlreadySeated,
    tableOpen,
    asyncErrorBoundary(reservationPeopleFewerThanCapacity),
    asyncErrorBoundary(updateSeatReservation),
  ],

}