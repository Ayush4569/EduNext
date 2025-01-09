import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#f8f9fa",
      textAlign: "center",
      fontFamily: "'Roboto', sans-serif",
    },
    heading: {
      fontSize: "6rem",
      color: "#dc3545",
      marginBottom: "1rem",
    },
    message: {
      fontSize: "1.5rem",
      color: "#343a40",
      marginBottom: "2rem",
    },
    homeLink: {
      padding: "0.75rem 1.5rem",
      fontSize: "1rem",
      color: "#fff",
      backgroundColor: "#007bff",
      borderRadius: "0.25rem",
      textDecoration: "none",
    },
  };
  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>404</h1>
      <p style={styles.message}>
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link to="/" style={styles.homeLink}>
        Go Back to Home
      </Link>
    </div>
  );
};

export default ErrorPage;
