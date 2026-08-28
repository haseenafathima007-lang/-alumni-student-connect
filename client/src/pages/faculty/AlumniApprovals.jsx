import React, { useState, useEffect } from "react";
import FacultyLayout from "../../layouts/FacultyLayout";
import { api } from "../../services/api";

function AlumniApprovals() {
  const [pendingList, setPendingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");
  const [selectedAlumni, setSelectedAlumni] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null); // { type: 'approve' | 'reject', alumni: Object }
  const [rejectionReason, setRejectionReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchPendingAlumni = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/faculty/alumni/pending");
      setPendingList(res.data || []);
    } catch (err) {
      setError(err.message || "Failed to load pending alumni");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingAlumni();
  }, []);

  const handleApprove = async (alumniId) => {
    try {
      setSubmitting(true);
      setError("");
      await api.put(`/faculty/alumni/${alumniId}/approve`);
      setActionSuccess("Alumni approved successfully! The alumnus can now mentor students and post opportunities.");
      setConfirmAction(null);
      fetchPendingAlumni();
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err) {
      setError(err.message || "Failed to approve alumni");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async (alumniId) => {
    try {
      setSubmitting(true);
      setError("");
      await api.put(`/faculty/alumni/${alumniId}/reject`, { rejectionReason });
      setActionSuccess("Alumni verification rejected. Notification sent to user.");
      setConfirmAction(null);
      setRejectionReason("");
      fetchPendingAlumni();
      setTimeout(() => setActionSuccess(""), 4000);
    } catch (err) {
      setError(err.message || "Failed to reject alumni");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FacultyLayout>
      <div style={styles.page}>
        <div style={styles.container}>
          {/* Header Banner */}
          <div style={styles.header}>
            <div>
              <span style={styles.badge}>🛡️ Faculty Verification Hub</span>
              <h1 style={styles.title}>Alumni Registration Approvals</h1>
              <p style={styles.subtitle}>
                Review and verify Easwari Engineering College graduates before they can mentor students or post job and internship opportunities.
              </p>
            </div>
            <button onClick={fetchPendingAlumni} style={styles.refreshBtn}>
              🔄 Refresh List
            </button>
          </div>

          {/* Feedback Alerts */}
          {error && (
            <div style={styles.errorAlert}>
              ⚠️ {error}
            </div>
          )}

          {actionSuccess && (
            <div style={styles.successAlert}>
              ✅ {actionSuccess}
            </div>
          )}

          {/* Main Table or Card List */}
          {loading ? (
            <div style={styles.loadingBox}>
              <p style={{ color: "#6C574C", fontSize: "14px" }}>Loading pending alumni approvals...</p>
            </div>
          ) : pendingList.length === 0 ? (
            <div style={styles.emptyCard}>
              <span style={{ fontSize: "40px", marginBottom: "12px", display: "block" }}>🎉</span>
              <h3 style={{ color: "#391F25", margin: "0 0 6px 0", fontSize: "18px" }}>
                All Clear! No Pending Alumni Approvals
              </h3>
              <p style={{ color: "#6C574C", fontSize: "13px", margin: 0 }}>
                All registered alumni in your department network have been reviewed and verified.
              </p>
            </div>
          ) : (
            <div style={styles.listContainer}>
              <div style={styles.countBadge}>
                Showing <strong>{pendingList.length}</strong> alumnus awaiting faculty review
              </div>

              <div style={styles.grid}>
                {pendingList.map((alumni) => (
                  <div key={alumni._id} style={styles.alumniCard}>
                    <div style={styles.cardTop}>
                      <div style={styles.avatarWrap}>
                        {alumni.avatar ? (
                          <img src={alumni.avatar} alt={alumni.name} style={styles.avatarImg} />
                        ) : (
                          <div style={styles.avatarPlaceholder}>
                            {alumni.name?.charAt(0) || "A"}
                          </div>
                        )}
                      </div>
                      <div style={styles.alumniInfo}>
                        <h3 style={styles.alumniName}>{alumni.name}</h3>
                        <p style={styles.alumniEmail}>✉️ {alumni.email}</p>
                        <span style={styles.pendingBadge}>Pending Review</span>
                      </div>
                    </div>

                    <div style={styles.detailsGrid}>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Department</span>
                        <span style={styles.detailValue}>{alumni.department || "Engineering"}</span>
                      </div>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Graduation Year</span>
                        <span style={styles.detailValue}>{alumni.graduationYear || "N/A"}</span>
                      </div>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Current Company</span>
                        <span style={styles.detailValue}>{alumni.company || "Not specified"}</span>
                      </div>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>Job Title / Role</span>
                        <span style={styles.detailValue}>{alumni.jobTitle || "Alumni"}</span>
                      </div>
                    </div>

                    {alumni.expertise && alumni.expertise.length > 0 && (
                      <div style={styles.skillsRow}>
                        {alumni.expertise.slice(0, 4).map((skill, i) => (
                          <span key={i} style={styles.skillTag}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Actions */}
                    <div style={styles.cardActions}>
                      <button
                        onClick={() => setSelectedAlumni(alumni)}
                        style={styles.viewBtn}
                      >
                        👁️ View Details
                      </button>
                      <button
                        onClick={() => setConfirmAction({ type: "reject", alumni })}
                        style={styles.rejectBtn}
                      >
                        ✕ Reject
                      </button>
                      <button
                        onClick={() => setConfirmAction({ type: "approve", alumni })}
                        style={styles.approveBtn}
                      >
                        ✓ Approve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confirmation Modal */}
          {confirmAction && (
            <div style={styles.modalOverlay}>
              <div style={styles.modalCard}>
                <h3 style={styles.modalTitle}>
                  {confirmAction.type === "approve"
                    ? "Approve Alumni Verification?"
                    : "Reject Alumni Verification?"}
                </h3>
                <p style={styles.modalText}>
                  {confirmAction.type === "approve"
                    ? `Are you sure you want to approve ${confirmAction.alumni.name}? Once approved, they will immediately be allowed to mentor students, receive mentorship inquiries, and post jobs and internships.`
                    : `Are you sure you want to reject ${confirmAction.alumni.name}'s verification request? They will remain restricted from professional actions until reviewed.`}
                </p>

                {confirmAction.type === "reject" && (
                  <div style={{ marginBottom: "16px" }}>
                    <label style={{ display: "block", fontSize: "12.5px", fontWeight: "700", color: "#391F25", marginBottom: "6px" }}>
                      Optional Rejection Reason:
                    </label>
                    <textarea
                      placeholder="e.g. Graduation year could not be verified, incomplete profile, etc."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "8px 10px",
                        borderRadius: "6px",
                        border: "1.5px solid #DAD0BB",
                        fontSize: "12.5px",
                        minHeight: "65px",
                        fontFamily: "inherit",
                        resize: "vertical",
                      }}
                    />
                  </div>
                )}

                <div style={styles.modalActions}>
                  <button
                    onClick={() => setConfirmAction(null)}
                    disabled={submitting}
                    style={styles.modalCancelBtn}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() =>
                      confirmAction.type === "approve"
                        ? handleApprove(confirmAction.alumni.userId || confirmAction.alumni._id)
                        : handleReject(confirmAction.alumni.userId || confirmAction.alumni._id)
                    }
                    disabled={submitting}
                    style={
                      confirmAction.type === "approve"
                        ? styles.modalConfirmApproveBtn
                        : styles.modalConfirmRejectBtn
                    }
                  >
                    {submitting
                      ? "Processing..."
                      : confirmAction.type === "approve"
                      ? "Yes, Approve Alumni"
                      : "Yes, Reject"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Profile View Modal */}
          {selectedAlumni && (
            <div style={styles.modalOverlay}>
              <div style={styles.modalCardLarge}>
                <div style={styles.modalHeader}>
                  <h3 style={styles.modalTitle}>Alumni Profile Information</h3>
                  <button onClick={() => setSelectedAlumni(null)} style={styles.closeBtn}>
                    ✕
                  </button>
                </div>

                <div style={styles.profileModalBody}>
                  <div style={styles.profileHeader}>
                    <div style={styles.avatarLarge}>
                      {selectedAlumni.name?.charAt(0) || "A"}
                    </div>
                    <div>
                      <h2 style={{ margin: "0 0 4px 0", color: "#391F25" }}>{selectedAlumni.name}</h2>
                      <p style={{ margin: "0 0 6px 0", color: "#6C574C", fontSize: "13px" }}>{selectedAlumni.email}</p>
                      <span style={styles.pendingBadge}>Verification: {selectedAlumni.verificationStatus}</span>
                    </div>
                  </div>

                  <div style={styles.modalDetailsGrid}>
                    <div>
                      <strong>Academic Department:</strong> {selectedAlumni.department}
                    </div>
                    <div>
                      <strong>Graduation Batch:</strong> {selectedAlumni.graduationYear}
                    </div>
                    <div>
                      <strong>Employer / Company:</strong> {selectedAlumni.company}
                    </div>
                    <div>
                      <strong>Designation:</strong> {selectedAlumni.jobTitle}
                    </div>
                    <div>
                      <strong>Industry:</strong> {selectedAlumni.industry}
                    </div>
                    <div>
                      <strong>Location:</strong> {selectedAlumni.location}
                    </div>
                  </div>

                  {selectedAlumni.bio && (
                    <div style={{ marginTop: "16px" }}>
                      <strong style={{ color: "#391F25", fontSize: "13px" }}>Bio / Professional Summary:</strong>
                      <p style={{ color: "#6C574C", fontSize: "13px", lineHeight: "1.5", margin: "6px 0 0 0" }}>
                        {selectedAlumni.bio}
                      </p>
                    </div>
                  )}
                </div>

                <div style={styles.modalActions}>
                  <button onClick={() => setSelectedAlumni(null)} style={styles.modalCancelBtn}>
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setConfirmAction({ type: "approve", alumni: selectedAlumni });
                      setSelectedAlumni(null);
                    }}
                    style={styles.modalConfirmApproveBtn}
                  >
                    ✓ Proceed to Approve
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </FacultyLayout>
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
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    padding: "26px 30px",
    borderRadius: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
    border: "2px solid #C4A78D",
    boxShadow: "0 4px 18px rgba(57, 31, 37, 0.12)",
    flexWrap: "wrap",
    gap: "14px",
  },
  badge: {
    fontSize: "12px",
    backgroundColor: "#6C574C",
    color: "#DAD0BB",
    padding: "3px 10px",
    borderRadius: "20px",
    fontWeight: "700",
    display: "inline-block",
    marginBottom: "6px",
  },
  title: {
    color: "#FFFFFF",
    fontSize: "24px",
    margin: "0 0 6px 0",
    fontFamily: "'Poppins', sans-serif",
    fontWeight: "700",
  },
  subtitle: {
    color: "#DAD0BB",
    fontSize: "13px",
    lineHeight: "1.5",
    margin: 0,
  },
  refreshBtn: {
    backgroundColor: "#C4A78D",
    color: "#391F25",
    padding: "9px 16px",
    borderRadius: "6px",
    border: "none",
    fontWeight: "700",
    fontSize: "13px",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  errorAlert: {
    backgroundColor: "#FFEBEE",
    color: "#C62828",
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "13px",
    border: "1px solid #FFCDD2",
  },
  successAlert: {
    backgroundColor: "#E8F5E9",
    color: "#2E7D32",
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "20px",
    fontSize: "13px",
    border: "1px solid #C8E6C9",
    fontWeight: "600",
  },
  loadingBox: {
    backgroundColor: "#FFFFFF",
    padding: "40px",
    borderRadius: "10px",
    textAlign: "center",
    border: "1px solid #DAD0BB",
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    padding: "50px 30px",
    borderRadius: "12px",
    textAlign: "center",
    border: "1px solid #DAD0BB",
    boxShadow: "0 4px 14px rgba(57, 31, 37, 0.05)",
  },
  listContainer: {
    marginTop: "10px",
  },
  countBadge: {
    fontSize: "13px",
    color: "#6C574C",
    marginBottom: "16px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
    gap: "20px",
  },
  alumniCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    padding: "22px",
    border: "1px solid #DAD0BB",
    boxShadow: "0 3px 14px rgba(57, 31, 37, 0.06)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  cardTop: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "16px",
  },
  avatarWrap: {
    flexShrink: 0,
  },
  avatarImg: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  avatarPlaceholder: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    fontWeight: "700",
  },
  alumniInfo: {
    flex: 1,
  },
  alumniName: {
    margin: "0 0 3px 0",
    fontSize: "17px",
    color: "#391F25",
    fontWeight: "700",
  },
  alumniEmail: {
    margin: "0 0 6px 0",
    fontSize: "12.5px",
    color: "#6C574C",
  },
  pendingBadge: {
    backgroundColor: "#FFF3E0",
    color: "#E65100",
    fontSize: "11px",
    fontWeight: "700",
    padding: "2px 8px",
    borderRadius: "12px",
    border: "1px solid #FFE0B2",
    display: "inline-block",
  },
  detailsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    backgroundColor: "#F7F5F0",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "14px",
  },
  detailItem: {
    display: "flex",
    flexDirection: "column",
  },
  detailLabel: {
    fontSize: "11px",
    color: "#6C574C",
    fontWeight: "600",
  },
  detailValue: {
    fontSize: "12.5px",
    color: "#391F25",
    fontWeight: "700",
  },
  skillsRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    marginBottom: "16px",
  },
  skillTag: {
    backgroundColor: "#DAD0BB",
    color: "#391F25",
    fontSize: "11px",
    padding: "2px 8px",
    borderRadius: "4px",
    fontWeight: "600",
  },
  cardActions: {
    display: "flex",
    gap: "8px",
    marginTop: "auto",
  },
  viewBtn: {
    flex: 1,
    padding: "8px",
    backgroundColor: "#F7F5F0",
    color: "#391F25",
    border: "1px solid #DAD0BB",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "600",
    cursor: "pointer",
  },
  rejectBtn: {
    padding: "8px 12px",
    backgroundColor: "#FFEBEE",
    color: "#C62828",
    border: "1px solid #FFCDD2",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
  },
  approveBtn: {
    padding: "8px 14px",
    backgroundColor: "#2E7D32",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 2px 6px rgba(46, 125, 50, 0.25)",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(57, 31, 37, 0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
    padding: "20px",
  },
  modalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    padding: "28px",
    maxWidth: "460px",
    width: "100%",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.2)",
    border: "1px solid #DAD0BB",
  },
  modalCardLarge: {
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    padding: "28px",
    maxWidth: "560px",
    width: "100%",
    boxShadow: "0 8px 30px rgba(0, 0, 0, 0.2)",
    border: "1px solid #DAD0BB",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  modalTitle: {
    color: "#391F25",
    margin: "0 0 10px 0",
    fontSize: "18px",
    fontFamily: "'Poppins', sans-serif",
  },
  closeBtn: {
    background: "transparent",
    border: "none",
    fontSize: "18px",
    cursor: "pointer",
    color: "#6C574C",
  },
  modalText: {
    fontSize: "13.5px",
    color: "#6C574C",
    lineHeight: "1.5",
    marginBottom: "22px",
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "20px",
  },
  modalCancelBtn: {
    padding: "9px 16px",
    backgroundColor: "#F7F5F0",
    color: "#391F25",
    border: "1px solid #DAD0BB",
    borderRadius: "6px",
    fontWeight: "600",
    fontSize: "13px",
    cursor: "pointer",
  },
  modalConfirmApproveBtn: {
    padding: "9px 18px",
    backgroundColor: "#2E7D32",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "6px",
    fontWeight: "700",
    fontSize: "13px",
    cursor: "pointer",
  },
  modalConfirmRejectBtn: {
    padding: "9px 18px",
    backgroundColor: "#C62828",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "6px",
    fontWeight: "700",
    fontSize: "13px",
    cursor: "pointer",
  },
  profileModalBody: {
    maxHeight: "65vh",
    overflowY: "auto",
  },
  profileHeader: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginBottom: "16px",
  },
  avatarLarge: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    fontWeight: "700",
  },
  modalDetailsGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
    backgroundColor: "#F7F5F0",
    padding: "14px",
    borderRadius: "8px",
    fontSize: "13px",
    color: "#391F25",
  },
};

export default AlumniApprovals;
