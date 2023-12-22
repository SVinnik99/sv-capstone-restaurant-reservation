import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import { today,previous,next } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import "./Dashboard.css"

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [currentDate, setCurrentDate] = useState(today())

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  // Increments the day by 1 forwards
  function handleNext(){
    setCurrentDate(next(currentDate))
  }
// Increments the day by 1 backwards
function handlePrevious(){
  setCurrentDate(previous(currentDate))
}
// Brings you back to todays date
function handleToday(){
  setCurrentDate(today())
}
 
  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date: {currentDate} </h4>
      </div>
      <div>
      <button  onClick={()=>handlePrevious()}type="button" class="btn btn-secondary btn-sm">Previous</button>
      <button onClick={()=>handleToday()}type="button" class="btn btn-primary btn-sm">Today</button>
      <button onClick={()=>handleNext()}type="button" class="btn btn-secondary btn-sm">Next</button>
      </div>
      <ErrorAlert error={reservationsError} />
      {JSON.stringify(reservations)}
    </main>
  );
}

export default Dashboard;
