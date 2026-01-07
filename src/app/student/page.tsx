'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Subject = {
  id: string;
  name: string;
  code: string;
};

type AttendanceRecord = {
  subject_id: string;
  date: string;
  present: boolean;
};

export default function StudentPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [date, setDate] = useState("");
  const [attendance, setAttendance] = useState("present");
  const [error_msg, setErrorMsg] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  const router = useRouter();

  // ✅ Fetch subjects
  async function fetchSubjects(uid: string) {
    const res = await fetch(`/api/subject?user_id=${uid}`);
    const data = await res.json();
    setSubjects(Array.isArray(data) ? data : []);
  }

  // ✅ Fetch attendance
  async function fetchAttendance(uid: string) {
    const res = await fetch(`/api/student?user_id=${uid}`);
    const data = await res.json();
    setAttendanceRecords(Array.isArray(data) ? data : []);
  }

  // ✅ Auth + initial load
  useEffect(() => {
    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      setUserId(session.user.id);
      await fetchSubjects(session.user.id);
      await fetchAttendance(session.user.id);
    };

    init();
  }, [router]);

  // ✅ Default selected subject
  useEffect(() => {
    if (subjects.length > 0 && !selectedSubject) {
      setSelectedSubject(subjects[0].id);
    }
  }, [subjects, selectedSubject]);

  // ✅ Submit attendance
  async function handleSubmitAttendance(e: React.FormEvent) {
    e.preventDefault();
    if (!userId || !selectedSubject || !date) return;

    const res = await fetch("/api/student", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: userId,
        subject_id: selectedSubject,
        date,
        present: attendance === "present",
      }),
    });
    const data = await res.json();
    if (data.error) return setErrorMsg(data.error);

    if (res.ok) {
      setDate("");
      setAttendance("present");
      fetchAttendance(userId);
    }
  }


  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-semibold text-gray-800 mb-12">
          Student Attendance
        </h1>

        {/* MARK ATTENDANCE */}
        <form
          onSubmit={handleSubmitAttendance}
          className="border border-gray-200 rounded-lg p-6 bg-zinc-50 space-y-4 mb-12"
        >
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-800">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full border border-gray-400 rounded px-3 py-2 text-gray-800"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-800">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-400 rounded px-3 py-2 text-gray-800"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-800">Status</label>
            <select
              value={attendance}
              onChange={(e) => setAttendance(e.target.value)}
              className="w-full border border-gray-400 rounded px-3 py-2 text-gray-800"
            >
              <option value="present">Present</option>
              <option value="absent">Absent</option>
            </select>
          </div>

          <button className="w-full bg-gray-700 text-white py-2 rounded hover:bg-gray-800 font-medium">
            Submit Attendance
          </button>
        </form>

        {/* ATTENDANCE RECORDS */}
        <div className="border rounded bg-zinc-50">
          <ul className="divide-y">
            {attendanceRecords.map((r, i) => (
              <li key={i} className="px-4 py-3 text-sm text-gray-800">
                {r.date} •{" "}
                <span className={r.present ? "text-green-600" : "text-gray-700"}>
                  {r.present ? "Present" : "Absent"}
                </span>
                  
              </li>
            ))}
          </ul>
          {error_msg && <div className="p-4 text-red-600">{error_msg}</div>}
        </div>
      </div>
    </div>
  );
}
