import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router";
import { getReservation, updateReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "../Reservations/ReservationForm";

function EditReservation() {
  const { reservation_id } = useParams();
  const [currentReservation, setCurrentReservation] = useState({
    reservation_id,
  });
  const [error, setError] = useState(null);

  const history = useHistory();

  useEffect(() => {
    const abortController = new AbortController();
    setError(null);
    async function loadReservation() {
      try {
        let returnedReservation = await getReservation(reservation_id);
        setCurrentReservation({
          ...returnedReservation,
          people: Number(returnedReservation.people),
        });
      } catch (error) {
        setError(error);
      }
    }
    loadReservation();
    return () => abortController.abort();
  }, [reservation_id]);

  const handleChange = ({ target }) => {
    setCurrentReservation({
      ...currentReservation,
      [target.name]: target.value,
    });
  };

  const handleSubmit = async (event) => {
    const abortController = new AbortController();
    event.preventDefault();
    await updateReservation({
      ...currentReservation,
      people: Number(currentReservation.people),
    })
      .then((response) => {
        setCurrentReservation({ ...response });
        history.push(`/dashboard?date=${currentReservation.reservation_date}`);
      })
      .catch(setError);
    return () => abortController.abort();
  };

  return (
    <>
      <ErrorAlert error={error} />
      <ReservationForm
        history={history}
        reservation={currentReservation}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </>
  );
}

export default EditReservation;
