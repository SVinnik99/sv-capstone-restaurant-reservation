import {  useHistory } from "react-router-dom";
import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";
import "./NewTable.css"


function NewTable() {
    const history = useHistory()
    const [tableError, setTableError] = useState(false);

    const [table, setTable] = useState({
        table_name: "",
        capacity: "",
    })

    const handleChange = (event) => {
        let { name, value } = event.target

        if (name === "capacity") {
            value = Number(value);
          }
          
        setTable((previousData) => ({
            ...previousData,
            [name]: value,
        }))

    }

    const handleSubmit = async (event) => {
        event.preventDefault();
    const abortController = new AbortController();

    try {
        console.log('about to submit',table)
     await createTable(table).then(() => {
        event.preventDefault();
        console.log('submitted', table)
        //goes back to the reservation date set in the form
        history.push("/dashboard");
      });
    } catch (error) {
      setTableError(error);
    }
    return () => abortController.abort();
    }


    return (

        <>
        <ErrorAlert error={tableError}/>
            <h1>New Table</h1>
            <form onSubmit={handleSubmit}>
                <label>Table Name</label>
                <input
                    id="table_name"
                    type="text"
                    name="table_name"
                    onChange={handleChange}
                    value={table.table_name}
                    required
                    minLength="2"
                />
                <label>Capacity</label>
                <input
                    id="capacity"
                    type="number"
                    name="capacity"
                    onChange={handleChange}
                    value={table.capacity}
                    required
                    min="1"
                />

                <button type="button" onClick={() => history.goBack()}>
                    Cancel
                </button>

                <button type="submit">Submit</button>
            </form>



        </>
    )
}

export default NewTable;