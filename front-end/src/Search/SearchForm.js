import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "../App.css";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationDetail from "../reservations/ReservationDetail";

function SearchForm() {
  const [numberToBeSearched, setNumberToBeSearched] = useState({
    mobile_number: "",
  });
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  const history = useHistory();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setNumberToBeSearched((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    try {
      const returnedReservations = await listReservations(
        numberToBeSearched,
        abortController.signal
      );

      if (returnedReservations.length === 0) {
        // No matching reservations found
        throw new Error('No reservations found');
      }

      setReservations(returnedReservations);
      history.push("/search");
    } catch (error) {
      setReservationsError(error);
    }

    return () => abortController.abort();
  };

  return (
    <>
      <ErrorAlert error={reservationsError} />
      <form onSubmit={handleSubmit}>
        <label htmlFor="mobile_number">Phone number:</label>
        <input
          name="mobile_number"
          type="search"
          value={numberToBeSearched.mobile_number}
          placeholder="Enter a customer's phone number"
          minLength="10"
          maxLength="10"
          className="ml-2 search-input-field"
          onChange={handleChange}
        />
        <button type="submit" className="btn btn-primary ml-2">
          Find
        </button>
      </form>

      {reservations && reservations.length ? (
        <div>
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
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export default SearchForm;
