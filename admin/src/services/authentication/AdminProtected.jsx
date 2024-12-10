import React from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
const AdminProtected = ({ children }) => {
  if (!localStorage.getItem("accessToken")) {
    localStorage.clear();
    return <Navigate to="/" replace />;
  }
  return children;
};

AdminProtected.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AdminProtected;
