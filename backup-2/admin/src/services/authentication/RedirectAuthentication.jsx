import React from "react";
import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
const RedirectIfAuthenticated = ({ children }) => {
  if (localStorage.getItem("accessToken")) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
};
RedirectIfAuthenticated.propTypes = {
    children: PropTypes.node.isRequired,
  };
export default RedirectIfAuthenticated;
