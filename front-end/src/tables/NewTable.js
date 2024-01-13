import {  useHistory } from "react-router-dom";
import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";
import "./NewTable.css"


function NewTable() {
    const history = useHistory()

    const [table, setTable] = useState({
        table_name: "",
        capacity: "",
    })

    const handleChange = (event) => {
        let { name, value } = event.target

        setTable((previousData) => ({
            ...previousData,
            [name]: value,
        }))

    }

    const handleSubmit = (event) => {
        event.preventDefault()
        history.push("/")

        console.log(table)
    }


    return (

        <>
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