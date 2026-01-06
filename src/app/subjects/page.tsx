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
    <div className="bg-gray-700 min-h-screen p-8">
      <h1>Subjects Page</h1>

      <div className="mt-8 mb-8">
        <h2>Subjects List</h2>
        <ul>
          {subjects.map((subject, index) => (
            <div key={index}>
              <li key={subject.code}>
                Subject Name: {subject.name} Subject Code: ({subject.code})
              </li>
              <button onClick={() => deleteSubject(subject.id)}>Delete Subject</button>
            </div>
          ))}
        </ul>
      </div>

      <div>
        <form onSubmit={handleAddSubject} className="flex flex-col gap-4">
          <h2>Add New Subject</h2>
          <label>Subject Name: </label>
          <input
            type="text"
            name="subjectName"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            className="bg-gray-500 rounded"
          />
          <label> Subject Code: </label>
          <input
            type="text"
            name="subjectCode"
            value={subjectCode}
            onChange={(e) => setSubjectCode(e.target.value)}
            className="bg-gray-500 rounded"
          />
          <button type="submit" className="bg-gray-400 rounded">Add Subject</button>
        </form>
      </div>
    </div>
  )
}