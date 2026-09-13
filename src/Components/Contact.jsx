import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Contact() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div
      className="min-h-screen pt-32 pb-24 px-8 md:px-24 relative flex flex-col"
      style={{ backgroundColor: "#F7F1E6" }}
    >
      {/* Back to Shop Navigation Row */}
      <div className="max-w-6xl w-full mx-auto mb-12">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm hover:opacity-90 active:scale-95 cursor-pointer"
          style={{ backgroundColor: "#234B3B", color: "#F7F1E6" }}
        >
          <svg
            style={{ width: "18px", height: "18px", display: "inline-block" }}
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            ></path>
          </svg>
          <span>Back to Shop</span>
        </button>
      </div>

      <div className="max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        {/* Left Column: Info & Story */}
        <div className="flex flex-col gap-8">
          <div>
            <h1
              className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4"
              style={{ color: "#234B3B", lineHeight: 1.15 }}
            >
              Let's craft something together.
            </h1>
            <p
              className="text-base md:text-lg font-light leading-relaxed"
              style={{ color: "#2A2118", opacity: 0.8 }}
            >
              Whether you are looking for custom wholesale event kits, bulk
              party favors, or just have a question about our plaster figurines,
              we would love to hear from you.
            </p>
          </div>

          <div className="flex flex-col gap-6 pt-4">
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                style={{
                  backgroundColor: "rgba(35,75,59,0.08)",
                  color: "#234B3B",
                }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <div>
                <h4
                  className="font-bold text-sm uppercase tracking-wider mb-1"
                  style={{ color: "#234B3B" }}
                >
                  Direct Email
                </h4>
                <p
                  className="text-sm font-medium"
                  style={{ color: "#2A2118", opacity: 0.8 }}
                >
                  hello@stonecraft.artisanal
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                style={{
                  backgroundColor: "rgba(35,75,59,0.08)",
                  color: "#234B3B",
                }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <div>
                <h4
                  className="font-bold text-sm uppercase tracking-wider mb-1"
                  style={{ color: "#234B3B" }}
                >
                  Response Time
                </h4>
                <p
                  className="text-sm font-medium"
                  style={{ color: "#2A2118", opacity: 0.8 }}
                >
                  We typically reply within 24 hours on weekdays.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm"
                style={{
                  backgroundColor: "rgba(35,75,59,0.08)",
                  color: "#234B3B",
                }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  ></path>
                </svg>
              </div>
              <div>
                <h4
                  className="font-bold text-sm uppercase tracking-wider mb-1"
                  style={{ color: "#234B3B" }}
                >
                  Wholesale Inquiries
                </h4>
                <p
                  className="text-sm font-medium"
                  style={{ color: "#2A2118", opacity: 0.8 }}
                >
                  Special pricing is available for creative workshops,
                  children's events, and retail partners.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div
          className="p-8 md:p-10 rounded-3xl shadow-sm bg-white relative"
          style={{ border: "1px solid rgba(35,75,59,0.1)" }}
        >
          {submitted ? (
            <div className="py-16 flex flex-col items-center justify-center text-center gap-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-2 shadow-sm"
                style={{ backgroundColor: "#234B3B", color: "#F7F1E6" }}
              >
                ✓
              </div>
              <h3
                className="text-2xl font-extrabold tracking-tight"
                style={{ color: "#234B3B" }}
              >
                Message Sent Successfully
              </h3>
              <p
                className="text-sm max-w-sm leading-relaxed"
                style={{ color: "#2A2118", opacity: 0.7 }}
              >
                Thank you for reaching out. Our team will review your note and
                get back to you shortly.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    name: "",
                    email: "",
                    subject: "General Inquiry",
                    message: "",
                  });
                }}
                className="mt-6 px-6 py-2.5 rounded-full text-xs font-bold tracking-wide transition-all cursor-pointer shadow-sm"
                style={{ backgroundColor: "#234B3B", color: "#F7F1E6" }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: "#234B3B" }}
                >
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="Jane Doe"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="px-4 py-3.5 rounded-xl text-sm outline-none transition-all focus:ring-2"
                  style={{
                    backgroundColor: "#F7F1E6",
                    border: "1px solid rgba(35,75,59,0.15)",
                    color: "#2A2118",
                  }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: "#234B3B" }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="jane@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="px-4 py-3.5 rounded-xl text-sm outline-none transition-all focus:ring-2"
                  style={{
                    backgroundColor: "#F7F1E6",
                    border: "1px solid rgba(35,75,59,0.15)",
                    color: "#2A2118",
                  }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: "#234B3B" }}
                >
                  Inquiry Type
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  className="px-4 py-3.5 rounded-xl text-sm outline-none transition-all cursor-pointer"
                  style={{
                    backgroundColor: "#F7F1E6",
                    border: "1px solid rgba(35,75,59,0.15)",
                    color: "#2A2118",
                  }}
                >
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Wholesale Order">
                    Wholesale / Bulk Order
                  </option>
                  <option value="Order Support">Order Support</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: "#234B3B" }}
                >
                  Message
                </label>
                <textarea
                  required
                  rows="4"
                  placeholder="Tell us what you're looking for..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="px-4 py-3.5 rounded-xl text-sm outline-none transition-all resize-none"
                  style={{
                    backgroundColor: "#F7F1E6",
                    border: "1px solid rgba(35,75,59,0.15)",
                    color: "#2A2118",
                  }}
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-full font-semibold text-sm shadow-md transition-all hover:opacity-95 active:scale-[0.98] cursor-pointer mt-2"
                style={{ backgroundColor: "#234B3B", color: "#F7F1E6" }}
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Contact;
