import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import { previous, next, today } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import { useLocation, useHistory } from "react-router-dom";
import ReservationDetail from "../reservations/ReservationDetail";
import TableList from "../tables/TableList";
import { listTables } from "../utils/api";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [currentDate, setCurrentDate] = useState(date);
  const [tables, setTables] = useState([]);

  const history = useHistory();
  const location = useLocation();
  const searchedDate = location.search.slice(-10);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  useEffect(() => {
    const abortController = new AbortController();

    async function loadReservations() {
      try {
        if (currentDate === date) {
          const returnedReservations = await listReservations(
            { date },
            abortController.signal
          );
          setReservations(returnedReservations);
        } else {
          const returnedReservations = await listReservations(
            { currentDate },
            abortController.signal
          );
          setReservations(returnedReservations);
        }
      } catch (error) {
        setReservationsError(error);
      }
    }
    loadReservations();
    return () => abortController.abort();
  }, [date, currentDate, reservations]);

  // Load all tables

  useEffect(() => {
    const abortController = new AbortController();

    async function loadTables() {
      try {
        const returnedTables = await listTables();
        setTables(returnedTables);
      } catch (error) {
        setReservationsError(error);
      }
    }
    loadTables();
    return () => abortController.abort();
  }, [history, date, currentDate]);

  // Fetching the query parameter
  useEffect(() => {
    if (searchedDate && searchedDate !== "") {
      setCurrentDate(searchedDate);
    }
  }, [searchedDate, history]);

  // Change-date-button handlers

  const handlePreviousDate = (event) => {
    event.preventDefault();
    history.push("/dashboard");
    setCurrentDate(previous(currentDate));
  };

  const handleToday = (event) => {
    event.preventDefault();
    history.push("/dashboard");
    setCurrentDate(today());
  };

  const handleNextDate = (event) => {
    event.preventDefault();
    history.push("/dashboard");
    setCurrentDate(next(currentDate));
  };

  const refreshTables = () => {
    const abortController = new AbortController();
    listTables()
      .then((returnedTables) => {
        setTables(returnedTables);
      })
      .catch((error) => {
        setReservationsError(error);
      });
    return () => abortController.abort();
  };

  return (
    <main>
      <div>
        <h1>Dashboard</h1>
        <div className="d-md-flex mb-3">
          <h4 className="mb-0">Reservations for date: {currentDate}</h4>
        </div>
        <ErrorAlert error={reservationsError} />
        <button onClick={handlePreviousDate} className="btn btn-primary mb-2">
          Previous
        </button>
        <button onClick={handleToday} className="btn btn-munsell mb-2 ml-2">
          Today
        </button>
        <button onClick={handleNextDate} className="btn btn-primary mb-2 ml-2">
          Next
        </button>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>People in Party</th>
            <th>Mobile #</th>
            <th>Reservation Date</th>
            <th>Reservation Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map((res) => (
            <ReservationDetail res={res} key={res.reservation_id} />
          ))}
        </tbody>
      </table>
      <br />
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Tables:</h4>
      </div>
      {tables.map((table) => (
        <TableList
          table={table}
          key={table.table_id}
          refreshTables={refreshTables}
        />
      ))}
    </main>
  );
}

export default Dashboard;
