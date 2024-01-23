import React from "react";



function TableView({ table }) {

    // if the reservation date is equal to todays date, return all the info
    return (

        <>
            <table class="table">
  <thead>
    <tr>
      <th>Name</th>
      <th>Capacity</th> 
      <th>Status</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>{table.table_name}</td>
      <td>{table.capacity}</td>
      {table.status ? <td>Occupied</td> : <td>Available</td>}
    </tr>   
  </tbody>
</table>
        </>

    )

}



export default TableView;