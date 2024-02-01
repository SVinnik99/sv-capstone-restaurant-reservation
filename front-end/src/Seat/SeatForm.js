import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { updateSeat } from "../utils/api";

function SeatForm() {
  const [tables, setTables] = useState([]);
  const [error, setError] = useState(null);
  const [tableToBeSeated, setTableToBeSeated] = useState({});
  const history = useHistory();
  const { reservation_id } = useParams();



  useEffect(() => {
    const abortController = new AbortController();
    setError(null);
    listTables().then(setTables).catch(setError);
    return () => abortController.abort();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    const tableId = Number(tableToBeSeated);
    if (isNaN(tableId)) {
      return;
    }
    const reservationId = Number(reservation_id);
    updateSeat(tableId, reservationId)
      .then((response) => {
        const newTables = tables.map((table) => {
          return table.table_id === response.table_id ? response : table;
        });
          setTables(newTables)
          history.push("/dashboard")
      })     
      .catch(setError);
    return () => abortController.abort();
  };

  const handleCancel = (event) => {
    history.goBack();
  };

  return (
    <>
      <ErrorAlert error={error} />
      <form onSubmit={handleSubmit}>
        <label htmlFor="table_id">Select table:</label>
        <select
          name="table_id"
          id="table_id"
          className="ml-2 mt-2"
          onChange={(event) => setTableToBeSeated(event.target.value)}
        >
          <option value="">Table Name - Capacity</option>
          {tables.map((table) => (
            <option key={table.table_id} value={table.table_id} required={true}>
              {table.table_name} - {table.capacity}
            </option>
          ))}
        </select>
        <br />
        <br />
        <button className="btn btn-primary" type="submit">Submit</button>
        <button
      
          className="btn btn-secondary ml-2"
          onClick={handleCancel}
        >
          Cancel
        </button>
      </form>
    </>
  );
}

export default SeatForm;
