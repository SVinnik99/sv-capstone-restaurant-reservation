import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "./ReservationForm";

function NewReservation() {
  const history = useHistory();

  const [newReservation, setNewReservation] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  });

  const [reservationError, setReservationError] = useState(false);

  const handleChange = (event) => {
    let { name, value } = event.target;
    if (name === "people") {
      value = Number(value);
    }
    setNewReservation((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    try {
      await createReservation(newReservation, abortController.signal);
      history.push(`/dashboard?date=${newReservation.reservation_date}`);
    } catch (error) {
      setReservationError(error);
    }
    return () => abortController.abort();
  };

  return (
    <>
      <h2>New Reservation</h2>
      <ErrorAlert error={reservationError} />
      <ReservationForm
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        history={history}
        reservation={newReservation}
      />
    </>
  );
}

export default NewReservation;
