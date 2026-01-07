'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Subject = {
  id: string;
  name: string;
  code: string;
  user_id: string;
};

export default function SubjectsPage() {
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [error_msg, setErrorMsg] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  const router = useRouter();

  // ✅ Fetch subjects for this user
  async function fetchSubjects(uid: string) {
    const response = await fetch(`/api/subject?user_id=${uid}`);
    const data = await response.json();

    if (!Array.isArray(data)) {
      console.error("Failed to load subjects", data);
      setSubjects([]);
      return;
    }

    setSubjects(data);
  }

  // ✅ Auth check + initial load
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
    };

    init();
  }, [router]);

  // ✅ Add subject
  async function handleAddSubject(event: React.FormEvent) {
    event.preventDefault();
    if (!subjectName || !subjectCode || !userId) return;

    const response = await fetch("/api/subject", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: userId,
        name: subjectName,
        code: subjectCode,
      }),
    });
    const data = await response.json();
    if (data.error) return setErrorMsg(data.error);

    if (response.ok) {
      setSubjectName("");
      setSubjectCode("");
      fetchSubjects(userId);
    }
  }

  // ✅ Delete subject
  async function deleteSubject(id: string) {
    if (!userId) return;

    const response = await fetch(
      `/api/subject?id=${id}&user_id=${userId}`,
      { method: "DELETE" }
    );

    if (response.ok) {
      fetchSubjects(userId);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-semibold text-gray-800 mb-12">
          Subjects
        </h1>

        {/* SUBJECT LIST */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-700 mb-6">
            Subject List
          </h2>

          <div className="border border-gray-200 rounded-lg bg-zinc-50">
            <ul className="divide-y divide-gray-200">
              {subjects.map((subject) => (
                <li
                  key={subject.id}
                  className="px-4 py-4 flex items-center justify-between hover:bg-gray-50"
                >
                  <span className="text-sm text-gray-800">
                    <span className="font-medium">{subject.name}</span>{" "}
                    <span className="text-gray-500">
                      ({subject.code})
                    </span>
                  </span>

                  <button
                    onClick={() => deleteSubject(subject.id)}
                    className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100"
                  >
                    Delete
                  </button>
                </li>
              ))}

              {subjects.length === 0 && (
                <li className="px-4 py-6 text-sm text-gray-500 text-center">
                  No subjects added yet
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* ADD SUBJECT */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-6">
            Add New Subject
          </h2>

          <form
            onSubmit={handleAddSubject}
            className="border border-gray-200 rounded-lg p-6 bg-zinc-50 space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject Name
              </label>
              <input
                type="text"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md"
                placeholder="e.g., Mathematics"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject Code
              </label>
              <input
                type="text"
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md"
                placeholder="e.g., MATH101"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium"
            >
              Add Subject
            </button>
            {error_msg && <div className="p-4 text-red-600">{error_msg}</div>}
          </form>
        </div>
      </div>
    </div>
  );
}
