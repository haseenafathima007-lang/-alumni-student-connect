import React, { useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";

function ManageFaculty() {
  const [faculty] = useState([
    {
      _id: "f-1",
      name: "Dr. S. Meenakshi",
      email: "meenakshi.s@eec.srmrmp.edu.in",
      department: "Artificial Intelligence and Data Science",
      designation: "Associate Professor & Alumni Coordinator",
      employeeId: "FAC2021AIDS04",
      activeAnnouncements: 3,
      organizedEvents: 2,
    },
    {
      _id: "f-2",
      name: "Prof. K. Venkatesh",
      email: "venkatesh.k@eec.srmrmp.edu.in",
      department: "Computer Science and Engineering",
      designation: "Professor & Head of Placement",
      employeeId: "FAC2015CSE01",
      activeAnnouncements: 2,
      organizedEvents: 4,
    },
    {
      _id: "f-3",
      name: "Dr. R. Anbarasu",
      email: "anbarasu.r@eec.srmrmp.edu.in",
      department: "Information Technology",
      designation: "Assistant Professor (Sr. Gr.)",
      employeeId: "FAC2020IT09",
      activeAnnouncements: 1,
      organizedEvents: 1,
    },
  ]);

  return (
    <AdminLayout>
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <h1 style={styles.title}>👩‍🏫 Faculty Directory & Department Coordinators</h1>
            <p style={styles.subtitle}>
              Monitor Easwari Engineering College faculty representatives, departmental coordinators, and academic event organizers.
            </p>
          </div>

          <div style={styles.tableCard}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thRow}>
                  <th style={styles.th}>Faculty Name & Email</th>
                  <th style={styles.th}>Department</th>
                  <th style={styles.th}>Designation</th>
                  <th style={styles.th}>Employee ID</th>
                  <th style={styles.th}>Announcements</th>
                  <th style={styles.th}>Events</th>
                </tr>
              </thead>
              <tbody>
                {faculty.map((f) => (
                  <tr key={f._id} style={styles.tr}>
                    <td style={styles.td}>
                      <strong>{f.name}</strong>
                      <div style={{ fontSize: "12px", color: "#6C574C" }}>{f.email}</div>
                    </td>
                    <td style={styles.td}>{f.department}</td>
                    <td style={styles.td}>{f.designation}</td>
                    <td style={styles.td}>{f.employeeId}</td>
                    <td style={styles.td}>
                      <span style={styles.badge}>{f.activeAnnouncements} Active</span>
                    </td>
                    <td style={styles.td}>
                      <span style={styles.badge}>{f.organizedEvents} Organized</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
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
    marginBottom: "24px",
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
  tableCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    boxShadow: "0 2px 12px rgba(57, 31, 37, 0.06)",
    overflowX: "auto",
    border: "1px solid #DAD0BB",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
  },
  thRow: {
    backgroundColor: "#57142B",
    color: "#FFFFFF",
  },
  th: {
    padding: "12px 16px",
    fontSize: "12px",
    fontWeight: "700",
    fontFamily: "'Poppins', sans-serif",
  },
  tr: {
    borderBottom: "1px solid #F7F5F0",
  },
  td: {
    padding: "12px 16px",
    fontSize: "13px",
    color: "#391F25",
  },
  badge: {
    backgroundColor: "#F7F5F0",
    color: "#57142B",
    border: "1px solid #DAD0BB",
    padding: "3px 8px",
    borderRadius: "8px",
    fontSize: "11px",
    fontWeight: "700",
  },
};

export default ManageFaculty;
