import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { deleteTableAssignment } from "../utils/api";
import { updateReservationStatus, listTables } from "../utils/api";

function TableList({ table }) {
  const [currentTable, setCurrentTable] = useState(table);
  const history = useHistory();
  const [error, setError] = useState(null);

  async function clearAndLoadTables() {
    const abortController = new AbortController();
    try {
      const response = await deleteTableAssignment(
        currentTable.table_id,
        abortController.signal
      );
      const tableToSet = response.find(
        (table) => table.table_id === currentTable.table_id
      );
      setCurrentTable({ ...tableToSet });
      listTables();
      return tableToSet;
    } catch (error) {
      setError(error);
    }
  }

  async function handleClear(event) {
    const abortController = new AbortController();
    event.preventDefault();
    setError(null);
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      await updateReservationStatus(
        { status: "finished" },
        currentTable.reservation_id,
        abortController.signal
      );
      debugger;
      const newTable = await clearAndLoadTables();
      console.log(newTable);
      history.push("/dashboard");
      return;
    }
  }

  return (
    <>
      <ErrorAlert error={error} />
      <div className="card" key={currentTable.table_id}>
        <div className="card-header">
          <h5 className="card-title">{currentTable.table_name}</h5>
        </div>
        <div className="card-body">
          <p>Capacity: {currentTable.capacity}</p>
          <p data-table-id-status={currentTable.table_id}>
            {currentTable.reservation_id ? "occupied" : "free"}
          </p>
          {currentTable.reservation_id && (
            <button
              data-table-id-finish={table.table_id}
              className="btn btn-danger"
              onClick={handleClear}
            >
              Finish
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default TableList;
