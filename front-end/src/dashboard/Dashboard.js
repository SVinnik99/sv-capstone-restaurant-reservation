import React, { useEffect, useState} from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { listReservations } from "../utils/api";
import { today, previous, next } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationView from "./ReservationView"
import useQuery from "../utils/useQuery";
import "./Dashboard.css"


/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {

  let history = useHistory()
  const query = useQuery()

  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [queryDate, setQueryDate] = useState(query.get("date"))
  let [currentDate, setCurrentDate] = useState(today())

  useEffect(loadDashboard, [currentDate]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations(currentDate, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  // gets the current date from the parameter
  

  // this use effect checks to the route, if it specifies a date, change the current date to the parameter
  useEffect(() => {

    if (queryDate) {
      setCurrentDate(queryDate);
    }

  }, [queryDate]);

  // Increments the day by 1 forwards
  function handleNext() {
    setCurrentDate(next(currentDate))
  }
  // Increments the day by 1 backwards
  function handlePrevious() {
    setCurrentDate(previous(currentDate))
  }
  // Brings you back to todays date, clear query param
  function handleToday() {
    setCurrentDate(today())
    history.push("/dashboard")
    
  }


  return (
    <main>
      <h1>Dashboard</h1>
      <div >
        <h4 >Reservations for date: {currentDate} </h4>
      </div>
      <div>
        <button onClick={() => handlePrevious()} type="button" class="btn btn-secondary btn-sm">Previous day</button>
        <button onClick={() => handleToday()} type="button" class="btn btn-primary btn-sm">Today</button>
        <button onClick={() => handleNext()} type="button" class="btn btn-secondary btn-sm">Next day</button>
      </div>
      <ErrorAlert error={reservationsError} />

      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Mobile Number</th>
            <th>Reservation Date</th>
            <th>Reservation Time</th>
            <th>Number of People</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((reservation, index) =>
            <ReservationView
              reservation={reservation}
              currentDate={currentDate}
              key={index} />)}
        </tbody>
      </table>

    </main>
  );
}

export default Dashboard;
