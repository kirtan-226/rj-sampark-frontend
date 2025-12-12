import React from "react";
import Header from "../components/Header";

const ReceiptBooks = () => {
  return (
    <div>
      <Header />
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h5>Receipt Books</h5>
        <p>This feature is currently unavailable because the backend API does not expose receipt book endpoints.</p>
      </div>
    </div>
  );
};

export default ReceiptBooks;
