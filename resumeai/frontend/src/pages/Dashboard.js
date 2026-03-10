import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function Dashboard() {
const { user } = useAuth();

const card = (icon, title, desc, link, btnText, color) => (
<div
style={{
background: "#16161e",
border: "1px solid #1e1e2e",
borderRadius: 14,
padding: 28
}}
>
<div style={{ fontSize: 36, marginBottom: 14 }}>{icon}</div>

```
  <h3
    style={{
      fontFamily: "Space Grotesk,sans-serif",
      fontSize: 18,
      fontWeight: 600,
      marginBottom: 10
    }}
  >
    {title}
  </h3>

  <p
    style={{
      color: "#888899",
      fontSize: 14,
      lineHeight: 1.6,
      marginBottom: 20
    }}
  >
    {desc}
  </p>

  <Link to={link}>
    <button
      style={{
        padding: "10px 22px",
        background:
          color || "linear-gradient(135deg,#00b894,#00cec9)",
        border: "none",
        borderRadius: 8,
        color: "#fff",
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer"
      }}
    >
      {btnText}
    </button>
  </Link>
</div>


);

return (
<div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
<div style={{ marginBottom: 36 }}>
<h1
style={{
fontFamily: "Space Grotesk,sans-serif",
fontSize: 28,
fontWeight: 700,
marginBottom: 6
}}
>
Welcome back, {user?.name?.split(" ")[0] || "there"}! 👋 </h1>

```
    <p style={{ color: "#888899", fontSize: 15 }}>
      What would you like to do today?
    </p>
  </div>

  <div
    style={{
      background: "rgba(0,184,148,0.08)",
      border: "1px solid rgba(0,184,148,0.2)",
      borderRadius: 14,
      padding: "20px 24px",
      marginBottom: 36,
      display: "flex",
      alignItems: "center",
      gap: 16
    }}
  >
    <span style={{ fontSize: 32 }}>🎯</span>

    <div>
      <h3
        style={{
          fontFamily: "Space Grotesk,sans-serif",
          fontSize: 17,
          fontWeight: 600,
          marginBottom: 4
        }}
      >
        Tip: Start with Resume Analysis
      </h3>

      <p style={{ color: "#888899", fontSize: 14 }}>
        Upload your resume to get an ATS score and AI suggestions.
      </p>
    </div>
  </div>

  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
      gap: 20
    }}
  >
    {card(
      "📊",
      "Analyze Resume",
      "Upload your resume and get ATS score with AI suggestions.",
      "/analyzer",
      "Analyze Now →"
    )}

    {card(
      "✍️",
      "Build Resume",
      "Create a professional resume using our builder.",
      "/builder",
      "Start Building →"
    )}

    {card(
      "🎨",
      "Browse Templates",
      "Explore professional resume templates.",
      "/templates",
      "View Templates →",
      "linear-gradient(135deg,#8e44ad,#9b59b6)"
    )}

    {card(
      "👤",
      "My Profile",
      "Update your account settings.",
      "/profile",
      "Edit Profile →",
      "#333"
    )}
  </div>
</div>

);
}
