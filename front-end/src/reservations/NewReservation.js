
import { Link, useHistory } from "react-router-dom";
import React, { useState } from "react";
import { createReservation } from "../utils/api";
import "./NewReservation.css"


function NewReservation() {

    const history = useHistory();

    const [reservation, setReservation] = useState({
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: "",
    });

    function handleChange({ target: { name, value } }) {
        setReservation((previousReservation) => ({
            ...previousReservation,
            [name]: value,
        }));
    }
    const handleSubmit = (event) => {

        event.preventDefault()

        createReservation(reservation).then(() => {
            history.push("/");
        });
    };

    return (
        <div>
            <h1>Create Deck</h1>
            <form onSubmit={handleSubmit}>
                <label>First Name</label>
                <input
                    id="first_name"
                    type="text"
                    name="first_name"
                    onChange={handleChange}
                    value={reservation.first_name}
                />
                <label>Last Name</label>
                <input
                    id="last_name"
                    type="text"
                    name="last_name"
                    onChange={handleChange}
                    value={reservation.last_name}
                />
                <label>Mobile Number</label>
                <input
                    id="mobile_number"
                    type="text"
                    name="mobile_number"
                    onChange={handleChange}
                    value={reservation.mobile_number}
                />
                <label>Date of reservation</label>
                <input
                    id="reservation_date"
                    type="date"
                    name="reservation_date"
                    placeholder="YYYY-MM-DD"
                    pattern="\d{4}-\d{2}-\d{2}"
                    onChange={handleChange}
                    value={reservation.reservation_date}
                />
                <label>Time of reservation</label>
                <input
                    id="reservation_time"
                    type="time"
                    name="reservation_time"
                    placeholder="HH:MM"
                    pattern="[0-9]{2}:[0-9]{2}"
                    onChange={handleChange}
                    value={reservation.reservation_time}
                />
                <label>Number of people in the party</label>
                <input
                    id="people"
                    type="text"
                    name="people"
                    onChange={handleChange}
                    value={reservation.people}
                />

                <button type="button" onClick={() => history.push("/")}>
                    Cancel
                </button>

                <button type="submit" >Submit</button>
            </form>
        </div>
    )


};



export default NewReservation;