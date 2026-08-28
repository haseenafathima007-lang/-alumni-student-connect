import React from "react";
import AlumniLayout from "../../layouts/AlumniLayout";
import ChatInterface from "../../components/chat/ChatInterface";

function AlumniChat() {
  return (
    <AlumniLayout>
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <h1 style={styles.title}>💬 Direct Messages & Student Inquiries</h1>
            <p style={styles.subtitle}>
              Communicate in real time with student mentees, campus applicants, and fellow Easwari Engineering College alumni.
            </p>
          </div>
          <ChatInterface />
        </div>
      </div>
    </AlumniLayout>
  );
}

const styles = {
  page: {
    padding: "30px 20px 60px 20px",
  },
  container: {
    maxWidth: "1150px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "20px",
  },
  title: {
    color: "#391F25",
    fontSize: "28px",
    margin: "0 0 6px 0",
    fontFamily: "'Poppins', sans-serif",
  },
  subtitle: {
    color: "#6C574C",
    fontSize: "14px",
    margin: 0,
  },
};

export default AlumniChat;
