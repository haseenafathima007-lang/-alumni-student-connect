import React, { useState, useEffect } from "react";
import AdminLayout from "../../layouts/AdminLayout";
import { api } from "../../services/api";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let endpoint = `/users?role=${roleFilter}&search=${encodeURIComponent(search)}`;
      const res = await api.get(endpoint);
      setUsers(res.data || []);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleToggleStatus = async (userId) => {
    try {
      const targetUser = users.find((u) => u._id === userId);
      const newStatus = targetUser?.status === "Active" ? "Suspended" : "Active";
      await api.put(`/users/${userId}/status`, { status: newStatus });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, status: newStatus } : u))
      );
    } catch (err) {
      console.error("Failed to toggle status:", err);
    }
  };

  return (
    <AdminLayout>
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.header}>
            <h1 style={styles.title}>👥 User Directory & Role Governance</h1>
            <p style={styles.subtitle}>
              Audit active accounts, role permissions, and compliance status across Easwari Engineering College users.
            </p>
          </div>

          <div style={styles.filterCard}>
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Search accounts by name, email, or department (e.g. AI & Data Science, CSE)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={styles.searchInput}
              />
            </form>

            <div style={styles.filterRow}>
              <span style={{ fontWeight: "700", color: "#391F25", fontSize: "13px" }}>Filter by Role:</span>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {["all", "Student", "Alumni", "Faculty"].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRoleFilter(r)}
                    style={{
                      ...styles.tabBtn,
                      ...(roleFilter === r ? styles.activeTabBtn : {}),
                    }}
                  >
                    {r === "all" ? "All Users" : r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <div style={styles.loadingBox}>
              Loading user directory...
            </div>
          ) : (
            <div style={styles.tableCard}>
              <table style={styles.table}>
                <thead>
                  <tr style={styles.thRow}>
                    <th style={styles.th}>Name & Email</th>
                    <th style={styles.th}>Role</th>
                    <th style={styles.th}>Department</th>
                    <th style={styles.th}>Joined</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} style={styles.tr}>
                      <td style={styles.td}>
                        <strong>{u.name}</strong>
                        <div style={{ fontSize: "12px", color: "#6C574C" }}>{u.email}</div>
                      </td>
                      <td style={styles.td}>
                        <span
                          style={{
                            ...styles.roleBadge,
                            backgroundColor:
                              u.role === "Student"
                                ? "#F7F5F0"
                                : u.role === "Alumni"
                                ? "#E8F5E9"
                                : "#FFF3E0",
                            color:
                              u.role === "Student"
                                ? "#57142B"
                                : u.role === "Alumni"
                                ? "#2E7D32"
                                : "#E65100",
                          }}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td style={styles.td}>{u.department || "Artificial Intelligence and Data Science"}</td>
                      <td style={styles.td}>{u.joinedDate || "2024"}</td>
                      <td style={styles.td}>
                        <span
                          style={{
                            color: u.status === "Active" ? "#2E7D32" : "#C62828",
                            fontWeight: "700",
                            fontSize: "12px",
                          }}
                        >
                          ● {u.status || "Active"}
                        </span>
                      </td>
                      <td style={styles.td}>
                        <button
                          onClick={() => handleToggleStatus(u._id)}
                          style={{
                            ...styles.statusBtn,
                            backgroundColor: u.status === "Active" ? "#FFEBEE" : "#E8F5E9",
                            color: u.status === "Active" ? "#C62828" : "#2E7D32",
                          }}
                        >
                          {u.status === "Active" ? "Suspend" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
    maxWidth: "1200px",
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
  filterCard: {
    backgroundColor: "#FFFFFF",
    padding: "18px",
    borderRadius: "10px",
    boxShadow: "0 2px 10px rgba(57, 31, 37, 0.06)",
    marginBottom: "22px",
    border: "1px solid #DAD0BB",
  },
  searchInput: {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 14px",
    border: "1.5px solid #DAD0BB",
    borderRadius: "6px",
    fontSize: "13px",
    outline: "none",
    marginBottom: "12px",
  },
  filterRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  tabBtn: {
    padding: "6px 14px",
    borderRadius: "6px",
    border: "1px solid #DAD0BB",
    backgroundColor: "#FFFFFF",
    color: "#391F25",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "12px",
  },
  activeTabBtn: {
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    borderColor: "#57142B",
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
  roleBadge: {
    padding: "3px 8px",
    borderRadius: "8px",
    fontSize: "11px",
    fontWeight: "700",
  },
  statusBtn: {
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    fontWeight: "700",
    fontSize: "11px",
    cursor: "pointer",
  },
  loadingBox: {
    padding: "50px",
    textAlign: "center",
    color: "#6C574C",
  },
};

export default ManageUsers;
