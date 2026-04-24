import React, { useState, useEffect, useMemo } from "react";
import { useApi } from "../context/ApiContext";
import { Bell, Tag, Calendar } from "lucide-react";

const PublicNotices = () => {
  const api = useApi();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const { data } = await api.get("/api/notices");
        setNotices(data.data || []);
      } catch (error) {
        console.error("Failed to fetch notices", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, [api]);

  // Sort latest first
  const sortedNotices = useMemo(() => {
    return [...notices].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [notices]);

  const getCategoryStyles = (category) => {
    switch (category) {
      case "Urgent":
        return "bg-red-50 text-red-700 border-red-100";
      case "Event":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "Exam":
        return "bg-amber-50 text-amber-700 border-amber-100";
      default:
        return "bg-blue-50 text-blue-700 border-blue-100";
    }
  };

  const latestNotice = sortedNotices[0];
  const otherNotices = sortedNotices.slice(1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-200 border border-emerald-600 rounded-full mb-4">
            <Bell className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-bold text-emerald-950  uppercase tracking-wide">
              Notice Board
            </span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Latest <span className="text-emerald-600 ">Announcements</span>
          </h1>
        </div>

        {/* Latest Notice Highlight */}
        {loading ? (
          <div className="h-40 bg-white border border-gray-100 rounded-2xl animate-pulse mb-8" />
        ) : latestNotice && (
          <div className="bg-emerald-100 border border-emerald-600 rounded-2xl p-6 mb-10 shadow-sm">
            <span className="text-xs font-extrabold text-neutral-950 bg-red-300 border-2 border-green-600 px-2 py-1 rounded-full uppercase">
              Latest Notice
            </span>

            <h2 className="text-xl font-extrabold text-gray-900 mt-2 mb-2">
              {latestNotice.title}
            </h2>

            <p className="text-gray-700 font-semibold text-md mb-4">
              {latestNotice.content}
            </p>

            <div className="flex items-center gap-3 text-xs text-gray-500">
              
              <div className="flex items-center gap-1 text-gray-900 font-semibold text-md">
                <Calendar className="w-3 h-3" />
                {new Date(latestNotice.createdAt).toLocaleDateString("en-IN")}
              </div>
            </div>
          </div>
        )}

        {/* Other Notices */}
        <div className="space-y-5">
          {otherNotices.map((notice) => (
            <div
              key={notice._id}
              className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between mb-3">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full border ${getCategoryStyles(
                    notice.category
                  )}`}
                >
                  {notice.category || "General"}
                </span>
                <div className="flex items-center gap-1 text-gray-400 text-xs">
                  <Calendar className="w-3 h-3" />
                  {new Date(notice.createdAt).toLocaleDateString("en-IN")}
                </div>
              </div>

              <h3 className="text-lg font-extrabold text-gray-900 mb-2">
                {notice.title}
              </h3>

              <p className="text-gray-600 font-semibold text-md mb-4">
                {notice.content}
              </p>

              <div className="flex items-center gap-1 text-gray-400 text-xs">
                <Tag className="w-3 h-3" />
                Posted by Administration
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PublicNotices;