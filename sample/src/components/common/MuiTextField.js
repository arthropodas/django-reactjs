import { TextField } from "@mui/material";
import React from "react";

const MuiTextField = ({ registerProps, error, labelShrink = true, value, ...otherProps }) => {
  return (
    <TextField
      {...registerProps}
      error={!!error}
      helperText={error}
      
      {...otherProps}
      value={value}
    >
      
    </TextField>
  );
};

export default MuiTextField;