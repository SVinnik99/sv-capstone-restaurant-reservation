import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { updateReservationStatus, listTables } from "../utils/api";

function ReservationDetail({ res }) {
  const [reservation, setReservation] = useState(res);
  const [error, setError] = useState(null);
  const history = useHistory();
  let reservation_id = res.reservation_id;

  useEffect(() => {
    setReservation(reservation);
  }, [reservation, history]);

  const handleCancelRes = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    setError(null);
    if (
      window.confirm(
        `Do you want to cancel this reservation? This cannot be undone.`
      )
    ) {
      updateReservationStatus(
        { status: "cancelled" },
        res.reservation_id,
        abortController.signal
      )
        .then(() => {
          listTables();
          window.location.reload();
        })
        .catch(setError);
    }
  };

  return (
    <>
      <ErrorAlert error={error} />
      <tr>
        <th scope="row"> {reservation.reservation_id} </th>
        <td>{reservation.first_name}</td>
        <td>{reservation.last_name}</td>
        <td>{reservation.people}</td>
        <td>{reservation.mobile_number}</td>
        <td>{reservation.reservation_date}</td>
        <td>{reservation.reservation_time}</td>
        <td data-reservation-id-status={reservation.reservation_id}>
          {reservation.status}
        </td>
        <td>
          {reservation.status === "booked" ? (
            <a
              href={`/reservations/${reservation_id}/seat`}
              className="btn btn-primary"
            >
              Seat
            </a>
          ) : (
            <></>
          )}
        </td>
        <td>
          {reservation.status === "booked" ? (
            <a
              href={`/reservations/${reservation_id}/edit`}
              className="btn btn-secondary"
            >
              Edit
            </a>
          ) : (
            <></>
          )}
        </td>
        <td data-reservation-id-cancel={reservation.reservation_id}>
          {reservation.status === "booked" ? (
            <button className="btn btn-danger" onClick={handleCancelRes}>
              Cancel
            </button>
          ) : (
            <></>
          )}
        </td>
      </tr>
    </>
  );
}

export default ReservationDetail;
