'use client'
import { useState, useEffect } from "react"

type Subject = {
  id: string;
  name: string;
  code: string;
};

export default function SubjectsPage() {
  const [subjectName, setSubjectName] = useState("");
  const [subjectCode, setSubjectCode] = useState("");
  const [subjects, setSubjects] = useState<Subject[]>([]);

  async function fetchSubjects() {
    const response = await fetch('/api/subject');
    const data = await response.json();
    setSubjects(data);
  }
  useEffect(() => {
    fetchSubjects();
  }, []);


  async function handleAddSubject(event: React.FormEvent) {
    event.preventDefault();
    if(!subjectName || !subjectCode) return;
    const response = await fetch('/api/subject', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify({ name: subjectName, code: subjectCode }),
    });
    if (response.ok) {
      setSubjectName("");
      setSubjectCode("");
      fetchSubjects();
    }
  }

  async function deleteSubject(id: string) {
    const response = await fetch(`/api/subject?id=${id}`, {
      method: 'DELETE',
    });

    const data = await response.json();
    console.log(data);
    if (response.ok) {
      fetchSubjects();
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-semibold text-gray-800 mb-12">Subjects</h1>

        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-700 mb-6">Subject List</h2>
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-zinc-50">
            <ul className="divide-y divide-gray-200">
              {subjects.map((subject, index) => (
                <div key={index} className="px-4 py-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                  <li key={subject.code} className="text-sm text-gray-800 flex-1">
                    <span className="font-medium">{subject.name}</span> <span className="text-gray-500">({subject.code})</span>
                  </li>
                  <button onClick={() => deleteSubject(subject.id)} className="ml-4 px-3 py-1 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors">Delete</button>
                </div>
              ))}
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-6">Add New Subject</h2>
          <form onSubmit={handleAddSubject} className="border border-gray-200 rounded-lg p-6 bg-zinc-50">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject Name</label>
                <input
                  type="text"
                  name="subjectName"
                  value={subjectName}
                  onChange={(e) => setSubjectName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                  placeholder="e.g., Mathematics"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject Code</label>
                <input
                  type="text"
                  name="subjectCode"
                  value={subjectCode}
                  onChange={(e) => setSubjectCode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                  placeholder="e.g., MATH101"
                />
              </div>
              <button type="submit" className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium">Add Subject</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}