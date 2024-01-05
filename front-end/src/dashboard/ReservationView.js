import React from "react";
import "./ReservationView.css"


function ReservationView({reservation, currentDate}){

// if the reservation date is equal to todays date, return all the info
if(reservation.reservation_date === currentDate){
    return (
        <tr>
            <td>{reservation.first_name}</td>
            <td>{reservation.last_name}</td>
            <td>{reservation.mobile_number}</td>
            <td>{reservation.reservation_date}</td>
            <td>{reservation.reservation_time}</td>
            <td>{reservation.people}</td>
        </tr>
    )
    // otherwise return an empty table
}else{
    return(
       <></>
    )
}
    
}

export default ReservationView;