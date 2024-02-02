import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function TablesForm() {
  let history = useHistory();

  let [tableToBeCreated, setTableToBeCreated] = useState({
    table_name: "",
    capacity: "",
  });

  const [tableError, setTableError] = useState(false);

  const handleChange = (event) => {
    let { name, value } = event.target;
    if (name === "capacity") {
      value = Number(value);
    }
    setTableToBeCreated((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const abortController = new AbortController();
    try {
      await createTable(tableToBeCreated, abortController.signal);
      history.push(`/dashboard`);
    } catch (error) {
      setTableError(error);
    }
    return () => abortController.abort();
  };

  const handleCancel = (event) => {
    event.preventDefault();
    history.goBack();
  };

  return (
    <>
      <ErrorAlert error={tableError} />
      <form onSubmit={handleSubmit}>
        <label htmlFor="table_name">Table name:</label>
        <input
          name="table_name"
          id="table_name"
          type="text"
          className="ml-2 mt-2"
          minLength="2"
          value={tableToBeCreated.table_name}
          onChange={handleChange}
        />
        <br />
        <label htmlFor="capacity" className="pr-1">
          Capacity:
        </label>
        <input
          name="capacity"
          id="capacity"
          type="number"
          className="ml-4 mt-2"
          min="1"
          value={tableToBeCreated.capacity}
          onChange={handleChange}
        />
        <br />
        <br />
        <button className="btn btn-primary"  type="submit">Submit</button>
        <button onClick={handleCancel} className="btn btn-secondary ml-2">
          Cancel
        </button>
      </form>
    </>
  );
}

export default TablesForm;
