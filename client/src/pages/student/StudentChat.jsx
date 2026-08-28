import React from "react";
import StudentLayout from "../../layouts/StudentLayout";
import ChatInterface from "../../components/chat/ChatInterface";

function StudentChat() {
  return (
    <StudentLayout>
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <h1 style={styles.title}>💬 Direct Messages & Alumni Chat</h1>
            <p style={styles.subtitle}>
              Connect 1-on-1 with verified alumni for instant career advice, resume feedback, and interview coaching.
            </p>
          </div>
          <ChatInterface />
        </div>
      </div>
    </StudentLayout>
  );
}

const styles = {
  page: {
    padding: "30px 20px",
  },
  container: {
    maxWidth: "1150px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "20px",
  },
  title: {
    color: "#2F4156",
    fontSize: "28px",
    margin: "0 0 6px 0",
  },
  subtitle: {
    color: "#567C8D",
    fontSize: "14px",
    margin: 0,
  },
};

export default StudentChat;
