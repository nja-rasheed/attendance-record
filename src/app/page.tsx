'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Subject = {
    id: string;
    name: string;
    code: string;
};

export default function HomePage() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [percentages, setPercentages] = useState<Record<string, number>>({});
    const [error_msg, setErrorMsg] = useState("");
    const router = useRouter();

    async function fetchSubjects() {
      const response = await fetch(`/api/subject`);
      const data = await response.json();

      setSubjects(Array.isArray(data) ? data : []);
    }



    async function fetchAttendancePercentage(subject_id: string) {
      const response = await fetch("/api/percentage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subject_id }),
      });

      const data = await response.json();
      if (data.error) {
        setErrorMsg(data.error);
        return;
      }
      setPercentages((prev) => ({
        ...prev,
        [subject_id]: data.percentage,
      }));
  }

  useEffect(() => {
    const checkAuthAndLoad = async () => {
      const {
        data: { session }, error
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }
      await fetchSubjects();
    };

    checkAuthAndLoad();
  }, [router]);

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-semibold text-gray-800 mb-12">Welcome to AttendTracker</h1>

        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-700 mb-6">Subjects</h2>
          <ul className="space-y-4">
            {subjects.map((subject) => (
              <div key={subject.id} className="border border-gray-200 rounded-lg p-4 bg-zinc-50 hover:bg-gray-50 transition-colors">
                <li key={subject.id} className="text-gray-800 mb-3">
                  {subject.name} <span className="text-gray-700 text-sm">({subject.code})</span>
                </li>
                <button onClick={() => fetchAttendancePercentage(subject.id)} className="text-sm px-3 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors">
                  Get Attendance Percentage
                </button>
                {percentages[subject.id] !== undefined && (
                  <p className="text-sm text-gray-600 mt-3">Attendance: <span className="font-medium text-gray-800">{percentages[subject.id]}%</span></p>
                )}
              </div>
            ))}
          </ul>
          {error_msg && <div className="p-4 text-red-600">{error_msg}</div>}
        </div>

        <div className="flex gap-3">
          <button onClick={() => router.push("/subjects")} className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors text-sm font-medium">
            Subjects Page
          </button>
          <button onClick={() => router.push("/student")} className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors text-sm font-medium">
            Student Attendance
          </button>
        </div>
      </div>
    </main>
  );
}