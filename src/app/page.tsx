'use client';
import { useState, useEffect } from "react";

type Subject = {
    id: string;
    name: string;
    code: string;
};

export default function HomePage() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [percentages, setPercentages] = useState<Record<string, number>>({});

    async function fetchSubjects() {
        const response = await fetch('/api/subject');
        const data = await response.json();
        console.log(data);
        setSubjects(data);
    }

    async function fetchAttendancePercentage(subject_id: string) {
    const response = await fetch('/api/percentage', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subject_id }),
    });

    const data = await response.json();

    setPercentages(prev => ({
        ...prev,
        [subject_id]: data.percentage,
    }));
    }

    useEffect(() => {
        fetchSubjects();
    }, []);
  return (
    <main>
      <h1>Welcome to AttendTracker</h1>

      <div>
        <h2>Subjects</h2>
        <ul>
          {subjects.map((subject) => (
            <div key={subject.id}>
                <li key={subject.id}>
                {subject.name} ({subject.code})
                </li>
                <button onClick={() => fetchAttendancePercentage(subject.id)}>Get Attendance Percentage</button>
                {percentages[subject.id] !== undefined && (
                  <p>Attendance Percentage: {percentages[subject.id]}%</p>
                )}
            </div>
          ))}
        </ul>
      </div>
    </main>
  );
}