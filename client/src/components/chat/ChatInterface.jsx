import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { api } from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useSearchParams } from "react-router-dom";

function ChatInterface() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const targetUserIdFromQuery = searchParams.get("user");

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    const socketServerUrl =
      import.meta.env.VITE_SOCKET_URL ||
      import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "") ||
      "http://localhost:5000";

    socketRef.current = io(socketServerUrl);

    if (user?._id) {
      socketRef.current.emit("join_user", user._id);
    }

    socketRef.current.on("receive_message", (newMessage) => {
      setMessages((prev) => {
        if (prev.some((m) => m._id === newMessage._id)) return prev;
        return [...prev, newMessage];
      });

      setConversations((prev) =>
        prev.map((c) =>
          c._id === newMessage.conversation
            ? {
                ...c,
                lastMessageText: newMessage.text,
                lastMessageAt: newMessage.createdAt || new Date(),
              }
            : c
        )
      );
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load conversations and initialize active conversation
  useEffect(() => {
    const initConversations = async () => {
      try {
        setLoading(true);
        const res = await api.get("/chat/conversations");
        const list = res.data || [];
        setConversations(list);

        if (targetUserIdFromQuery) {
          const directRes = await api.post("/chat/conversation", {
            targetUserId: targetUserIdFromQuery,
          });
          if (directRes.data) {
            setActiveConversation(directRes.data);
            if (!list.some((c) => c._id === directRes.data._id)) {
              setConversations([directRes.data, ...list]);
            }
          }
        } else if (list.length > 0) {
          setActiveConversation(list[0]);
        }
      } catch (err) {
        console.error("Failed to load conversations:", err);
      } finally {
        setLoading(false);
      }
    };

    initConversations();
  }, [targetUserIdFromQuery]);

  // Load messages whenever activeConversation changes
  useEffect(() => {
    if (!activeConversation?._id) return;

    const loadMessages = async () => {
      try {
        setMessagesLoading(true);
        const res = await api.get(`/chat/messages/${activeConversation._id}`);
        setMessages(res.data || []);
      } catch (err) {
        console.error("Failed to load messages:", err);
      } finally {
        setMessagesLoading(false);
      }
    };

    loadMessages();
  }, [activeConversation?._id]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() || !activeConversation?._id || sending) return;

    const currentText = text.trim();
    setText("");
    setSending(true);

    try {
      const res = await api.post("/chat/message", {
        conversationId: activeConversation._id,
        text: currentText,
      });

      const sentMsg = res.data;
      if (sentMsg) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === sentMsg._id)) return prev;
          return [...prev, sentMsg];
        });

        // Emit through socket for real-time notification
        const otherMember = activeConversation.members?.find((m) => {
          const mId = typeof m === "object" ? m._id : m;
          return mId !== user?._id;
        });

        const targetId = typeof otherMember === "object" ? otherMember._id : otherMember;
        if (targetId && socketRef.current) {
          socketRef.current.emit("send_message", {
            ...sentMsg,
            recipientId: targetId,
          });
        }
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      setText(currentText);
    } finally {
      setSending(false);
    }
  };

  const getPartnerUser = (convo) => {
    if (!convo || !convo.members) return { name: "Alumni Member", role: "Alumni" };
    const partner = convo.members.find((m) => {
      const id = typeof m === "object" ? m._id : m;
      return id !== user?._id;
    });

    if (!partner) return { name: "Alumni Contact", role: "Alumni" };
    if (typeof partner === "object") return partner;
    return { name: "Alumni Member", role: "Alumni" };
  };

  const activePartner = activeConversation ? getPartnerUser(activeConversation) : null;

  return (
    <div style={styles.chatContainer}>
      {/* Left Sidebar: Conversation List */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h3 style={styles.sidebarTitle}>💬 Messages</h3>
          <span style={styles.badge}>{conversations.length}</span>
        </div>

        <div style={styles.convoList}>
          {loading ? (
            <div style={styles.loadingArea}>Loading chats...</div>
          ) : conversations.length === 0 ? (
            <div style={styles.noConvo}>
              <p style={{ color: "#6C574C", fontSize: "13px", margin: 0 }}>
                No conversations yet. Discover alumni and click "Message" to connect!
              </p>
            </div>
          ) : (
            conversations.map((convo) => {
              const partner = getPartnerUser(convo);
              const isSelected = activeConversation?._id === convo._id;

              return (
                <div
                  key={convo._id}
                  onClick={() => setActiveConversation(convo)}
                  style={{
                    ...styles.convoItem,
                    backgroundColor: isSelected ? "#F7F5F0" : "transparent",
                    borderLeft: isSelected ? "4px solid #57142B" : "4px solid transparent",
                  }}
                >
                  <div style={styles.avatar}>
                    {partner.name ? partner.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong style={styles.convoName}>{partner.name}</strong>
                      <span style={styles.roleTag}>{partner.role || "Member"}</span>
                    </div>
                    <p style={styles.lastMsg}>
                      {convo.lastMessageText || "Start the conversation..."}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Main Chat Area */}
      <div style={styles.mainChat}>
        {activeConversation && activePartner ? (
          <>
            {/* Header */}
            <div style={styles.chatHeader}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={styles.headerAvatar}>
                  {activePartner.name ? activePartner.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div>
                  <h3 style={styles.partnerName}>{activePartner.name}</h3>
                  <span style={styles.partnerMeta}>
                    🎓 {activePartner.role || "Alumni"} • Easwari Engineering College
                  </span>
                </div>
              </div>
            </div>

            {/* Message Thread */}
            <div style={styles.messageBox}>
              {messagesLoading ? (
                <div style={styles.loadingArea}>Loading message history...</div>
              ) : messages.length === 0 ? (
                <div style={styles.emptyThread}>
                  <p style={{ color: "#6C574C", fontSize: "14px", margin: 0 }}>
                    Say hello to <strong>{activePartner.name}</strong> and ask for career advice or mentorship!
                  </p>
                </div>
              ) : (
                messages.map((m) => {
                  const senderId = typeof m.sender === "object" ? m.sender._id : m.sender;
                  const isMe = senderId === user?._id;

                  return (
                    <div
                      key={m._id}
                      style={{
                        ...styles.msgRow,
                        justifyContent: isMe ? "flex-end" : "flex-start",
                      }}
                    >
                      <div
                        style={{
                          ...styles.msgBubble,
                          backgroundColor: isMe ? "#57142B" : "#FFFFFF",
                          color: isMe ? "#FFFFFF" : "#391F25",
                          border: isMe ? "none" : "1px solid #DAD0BB",
                          borderRadius: isMe ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                        }}
                      >
                        <span style={{ fontSize: "14px", lineHeight: "1.4" }}>
                          {m.text}
                        </span>
                        <span
                          style={{
                            ...styles.msgTime,
                            color: isMe ? "#DAD0BB" : "#887B75",
                          }}
                        >
                          {new Date(m.createdAt || Date.now()).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} style={styles.inputForm}>
              <input
                type="text"
                placeholder="Type your message here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={styles.textInput}
              />
              <button
                type="submit"
                disabled={sending || !text.trim()}
                style={styles.sendBtn}
              >
                {sending ? "..." : "Send ➔"}
              </button>
            </form>
          </>
        ) : (
          <div style={styles.emptyMain}>
            <span style={{ fontSize: "48px" }}>💬</span>
            <h3 style={{ color: "#391F25", margin: "14px 0 6px 0", fontFamily: "'Poppins', sans-serif" }}>
              Select a Conversation
            </h3>
            <p style={{ color: "#6C574C", fontSize: "13px", margin: 0 }}>
              Choose a contact from the list or open an alumni profile to start messaging.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  chatContainer: {
    display: "flex",
    height: "72vh",
    minHeight: "520px",
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    boxShadow: "0 4px 18px rgba(57, 31, 37, 0.08)",
    overflow: "hidden",
    border: "1px solid #DAD0BB",
  },
  sidebar: {
    width: "320px",
    borderRight: "1px solid #DAD0BB",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
  },
  sidebarHeader: {
    padding: "16px 18px",
    borderBottom: "1px solid #DAD0BB",
    backgroundColor: "#FFFFFF",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sidebarTitle: {
    margin: 0,
    color: "#391F25",
    fontSize: "17px",
    fontFamily: "'Poppins', sans-serif",
  },
  badge: {
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    fontSize: "11px",
    padding: "2px 8px",
    borderRadius: "10px",
    fontWeight: "700",
  },
  convoList: {
    flex: 1,
    overflowY: "auto",
  },
  convoItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    borderBottom: "1px solid #F7F5F0",
    cursor: "pointer",
    transition: "background 0.2s ease",
  },
  avatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "15px",
    flexShrink: 0,
  },
  convoName: {
    fontSize: "13px",
    color: "#391F25",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  roleTag: {
    fontSize: "10px",
    backgroundColor: "#F7F5F0",
    color: "#6C574C",
    border: "1px solid #DAD0BB",
    padding: "1px 5px",
    borderRadius: "4px",
    fontWeight: "600",
  },
  lastMsg: {
    margin: "3px 0 0 0",
    fontSize: "12px",
    color: "#6C574C",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  mainChat: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#F7F5F0",
  },
  chatHeader: {
    padding: "12px 18px",
    backgroundColor: "#FFFFFF",
    borderBottom: "1px solid #DAD0BB",
  },
  headerAvatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    backgroundColor: "#6C574C",
    color: "#FFFFFF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: "15px",
  },
  partnerName: {
    margin: 0,
    fontSize: "15px",
    color: "#391F25",
    fontFamily: "'Poppins', sans-serif",
  },
  partnerMeta: {
    fontSize: "11px",
    color: "#6C574C",
  },
  messageBox: {
    flex: 1,
    padding: "18px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  msgRow: {
    display: "flex",
  },
  msgBubble: {
    maxWidth: "68%",
    padding: "9px 14px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  },
  msgTime: {
    fontSize: "10px",
    alignSelf: "flex-end",
    marginTop: "3px",
  },
  inputForm: {
    padding: "12px 18px",
    backgroundColor: "#FFFFFF",
    borderTop: "1px solid #DAD0BB",
    display: "flex",
    gap: "10px",
  },
  textInput: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: "6px",
    border: "1.5px solid #DAD0BB",
    fontSize: "13px",
    outline: "none",
  },
  sendBtn: {
    backgroundColor: "#57142B",
    color: "#FFFFFF",
    border: "none",
    padding: "0 20px",
    borderRadius: "6px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "13px",
  },
  emptyMain: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    padding: "40px",
  },
  emptyThread: {
    margin: "auto",
    textAlign: "center",
    padding: "30px",
  },
  noConvo: {
    padding: "30px 20px",
    textAlign: "center",
  },
  loadingArea: {
    padding: "30px",
    textAlign: "center",
    color: "#6C574C",
    fontSize: "13px",
  },
};

export default ChatInterface;
