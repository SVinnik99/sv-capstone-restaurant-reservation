import React from "react";

function ReservationForm({ handleSubmit, handleChange, history, reservation }) {
  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="first_name" className="mr-5 pr-4">
          First name:
        </label>
        <input
          className="ml-5 mt-2"
          type="text"
          id="first_name"
          name="first_name"
          value={reservation.first_name}
          onChange={handleChange}
          required
        />
        <br />
        <label htmlFor="last_name" className="mr-5 pr-4">
          Last name:
        </label>
        <input
          className="ml-5 mt-2"
          type="text"
          id="last_name"
          name="last_name"
          value={reservation.last_name}
          onChange={handleChange}
          required
        />
        <br />
        <label htmlFor="mobile_number" className="mr-4 pr-3">
          Mobile number:
        </label>
        <input
          className="ml-5 mt-2"
          type="tel"
          id="mobile_number"
          name="mobile_number"
          value={reservation.mobile_number}
          onChange={handleChange}
          pattern="[0-9]{10}"
          minLength="10"
          maxLength="10"
          required
        />
        <br />
        <label htmlFor="reservation_date" className="mr-4">
          Reservation Date:
        </label>
        <input
          className="ml-5 mt-2"
          type="date"
          placeholder="YYYY-MM-DD"
          pattern="\d{4}-\d{2}-\d{2}"
          id="reservation_date"
          name="reservation_date"
          value={reservation.reservation_date}
          onChange={handleChange}
          required
        />
        <br />
        <label htmlFor="reservation_time" className="mr-4">
          Reservation Time:
        </label>
        <input
          className="ml-5 mt-2"
          type="time"
          placeholder="HH:MM"
          pattern="[0-9]{2}:[0-9]{2}"
          id="reservation_time"
          name="reservation_time"
          value={reservation.reservation_time}
          onChange={handleChange}
          required
        />
        <br />
        <label htmlFor="people">Number of people in party:</label>
        <input
          className="ml-2 mt-2"
          type="number"
          id="people"
          name="people"
          value={reservation.people}
          onChange={handleChange}
          required
          min="1"
        />
        <br />
        <button className="btn btn-primary" type="submit">Submit</button>
        <button
          type="button"
          onClick={() => history.goBack()}
          className="btn btn-secondary ml-2"
        >
          Cancel
        </button>
      </form>
    </>
  );
}

export default ReservationForm;
