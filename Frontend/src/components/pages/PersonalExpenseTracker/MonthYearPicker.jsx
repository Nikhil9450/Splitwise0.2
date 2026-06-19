import React, { useState } from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export default function MonthYearPicker() {
    const [value, setValue] = useState(dayjs());
    const handleChange = (newValue) => {
    const month = newValue.month() + 1; // 1-12
    const year = newValue.year();

    console.log("Month:", month);
    console.log("Year:", year);

    setValue(newValue);
    };
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
        label="Select Month & Year to view expenses"
        views={["year", "month"]}
        format="MM/YYYY"
        value={value}
        onChange={handleChange}
        slotProps={{
            textField: {
            size: "small",
            sx: {
                "& .MuiPickersInputBase-root": {
                borderRadius: "1rem !important",
                width: "300px",
                },
            },
            },
            desktopPaper: {
            sx: {
                borderRadius: "1rem",
            },
            },
            mobilePaper: {
            sx: {
                borderRadius: "1rem",
            },
            },
        }}
        />
    </LocalizationProvider>
  );
}