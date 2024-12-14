"use client";

export default function ProjectLayout({ children }) {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#e7f8ff" }}>
      <main>{children}</main>
    </div>
  );
}