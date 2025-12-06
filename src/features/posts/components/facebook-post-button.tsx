"use client";

import React, { useState } from "react";

interface PostData {
  companyId: string;
  pageId: string;
  title: string;
  content: string;
  scheduledAt?: string; // Optional
}

export function FacebookPostButton() {
  // NOTE: In a real app, companyId should come from a secure user session context.
  const [companyId, setCompanyId] = useState<string>("c99-test-id");
  const [pageId, setPageId] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [scheduledAt, setScheduledAt] = useState<string>("");

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!pageId || !content || !companyId) {
      setResponseMessage("Company ID, Page ID, and Content cannot be empty.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setResponseMessage(null);

    const postData: PostData = {
      companyId,
      pageId,
      title,
      content,
      // Only include scheduledAt if the field is filled out
      ...(scheduledAt && { scheduledAt }),
    };

    try {
      const res = await fetch("/api/facebook/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setResponseMessage(
          `Success! Local ID: ${data.postId}. FB ID: ${
            data.facebookPostId
          }. Status: ${scheduledAt ? "Scheduled" : "Published"}`
        );

        // Reset fields
        setContent("");
        setTitle("");
        setScheduledAt("");
      } else {
        setStatus("error");
        console.error("API Error Response:", data);
        setResponseMessage(`Failed to process: ${data.details || data.error}`);
      }
    } catch (error) {
      setStatus("error");
      console.error("Network or Fetch Error:", error);
      setResponseMessage("A network error occurred. Check server logs.");
    }
  };

  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
        maxWidth: "500px",
      }}
    >
      <h2>New Facebook Post</h2>
      <form onSubmit={handleSubmit}>
        {/* 1. Page ID Input */}
        <label
          style={{ display: "block", margin: "10px 0 5px", fontWeight: "bold" }}
        >
          Target Facebook Page ID
          <input
            type="text"
            value={pageId}
            onChange={(e) => setPageId(e.target.value)}
            placeholder="Enter Page ID"
            required
            disabled={status === "loading"}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          />
        </label>

        {/* 2. Title (from DB Schema) */}
        <label style={{ display: "block", margin: "10px 0 5px" }}>
          Title (Internal Only)
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Q4 Marketing Update"
            disabled={status === "loading"}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          />
        </label>

        {/* 3. Content (Post Message) */}
        <label
          style={{ display: "block", margin: "10px 0 5px", fontWeight: "bold" }}
        >
          Content (Post Message)
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind? (This will be the post body)"
            required
            disabled={status === "loading"}
            rows={6}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          />
        </label>

        {/* 4. Scheduled At (from DB Schema) */}
        <label style={{ display: "block", margin: "10px 0 5px" }}>
          Schedule Post Date/Time (Optional)
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            disabled={status === "loading"}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          />
        </label>

        <p style={{ fontSize: "0.8em", color: "#666", marginTop: "5px" }}>
          Leave blank to post immediately. Must be between 10 minutes and 30
          days in the future for scheduling.
        </p>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === "loading"}
          style={{
            padding: "10px 15px",
            backgroundColor: status === "loading" ? "#888" : "#1877f2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: status === "loading" ? "not-allowed" : "pointer",
            marginTop: "20px",
          }}
        >
          {status === "loading"
            ? "Processing..."
            : scheduledAt
            ? "Schedule Post"
            : "Post Immediately"}
        </button>
      </form>

      {/* Status Message Display */}
      {responseMessage && (
        <p
          style={{
            marginTop: "15px",
            padding: "10px",
            border: `1px solid ${status === "success" ? "green" : "red"}`,
            backgroundColor: status === "success" ? "#e6ffe6" : "#ffe6e6",
            color: status === "success" ? "green" : "red",
            fontWeight: "bold",
            wordBreak: "break-all",
          }}
        >
          {responseMessage}
        </p>
      )}
    </div>
  );
}
