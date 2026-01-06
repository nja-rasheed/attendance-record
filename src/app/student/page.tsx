'use client'
import { useState, useEffect } from "react";
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
    const [selectedSubject, setSelectedSubject] = useState<string | "">("");
    const [date, setDate] = useState("");
    const [attendance, setAttendance] = useState("present");
    const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

    async function fetchSubjects() {
        const response = await fetch('/api/subject');
        const data = await response.json();
        console.log(data);
        setSubjects(data);
    }

    
  async function fetchAttendanceRecords() {
    const response = await fetch('/api/student');
    const data = await response.json();
    console.log(data);
    setAttendanceRecords(data);
  }

    useEffect(() => {
        fetchSubjects();
        fetchAttendanceRecords();
    }, []);

    useEffect(() => {
        if (subjects.length > 0 && !selectedSubject) {
          setSelectedSubject(subjects[0].id);
        }
    }, [subjects, selectedSubject]);



    async function handleSubmitAttendance(event: React.FormEvent) {
        event.preventDefault();
        if(selectedSubject === "" || !date) return;
        var attendance_state = false;
        if(attendance === "present") {
          attendance_state = true;
        } else {
          attendance_state = false;
        }
        console.log({ subject_id: selectedSubject, date: date, present: attendance_state });
        const response = await fetch('/api/student', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', 
          },
          body: JSON.stringify({ subject_id: selectedSubject, date: date, present: attendance_state }),
        });
        if (response.ok) {
          setSelectedSubject(subjects.length > 0 ? subjects[0].id : "");
          setDate("");
          setAttendance("present");
          fetchSubjects();
          fetchAttendanceRecords();
        }
  }
  return (
    <div className="bg-gray-700 min-h-screen p-8">
      <h1>Student Page</h1>

        <h2 className="mt-8 mb-8">Attendance</h2>

      <div>
            <form className="mb-4" onSubmit={handleSubmitAttendance}>
                <label>Select Subject: </label>
                <select
                    value={selectedSubject}
                    onChange={(e) => {
                        const value = e.target.value;
                        setSelectedSubject(value === "" ? "" : value);
                        }}
                    >
                    <option value="" disabled>
                        -- Select subject --
                    </option>

                    {subjects.map(subject => (
                        <option key={subject.code} value={subject.id}>
                        {subject.name} ({subject.code})
                        </option>
                    ))}
                </select>

                <input type="date" className="ml-4" value={date} onChange={(e) => setDate(e.target.value)} />
                <select className="ml-4" value={attendance} onChange={(e) => setAttendance(e.target.value)}>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                </select>
                <button type="submit" className="ml-4 px-4 py-2 bg-blue-500 text-white rounded">
                    Submit Attendance
                </button>
            </form>
        </div>
      <div className="mt-8 mb-8">
        <h2>Attendance Records</h2>
        <button onClick={fetchAttendanceRecords} className="mb-4 px-4 py-2 bg-green-500 text-white rounded">
          Refresh Attendance Records
        </button>
        <ul>
          {attendanceRecords.map((record, index) => (
            <li key={index}>
              Subject: {record.subject_id}, Date: {record.date}, Attendance: {record.present ? "Present" : "Absent"}
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
}