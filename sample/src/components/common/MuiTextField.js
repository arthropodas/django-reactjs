import { TextField } from "@mui/material";
import React from "react";

const MuiTextField = ({ registerProps, error, value, ...otherProps }) => {
  return (
    <TextField
      margin="normal"
      required
      fullWidth

      {...registerProps}
      error={!!error}
      helperText={error}
      {...otherProps}
      value={value}
    ></TextField>
  );
};

export default MuiTextField;
