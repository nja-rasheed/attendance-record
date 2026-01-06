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
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-semibold text-gray-800 mb-12">Student Attendance</h1>

        <div className="mb-12">
          <h2 className="text-xl font-semibold text-gray-700 mb-6">Mark Attendance</h2>

          <div>
            <form className="border border-gray-200 rounded-lg p-6 bg-zinc-50" onSubmit={handleSubmitAttendance}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSelectedSubject(value === "" ? "" : value);
                    }}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input type="date" className="w-full px-3 py-2 border border-gray-200 rounded-md bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-md bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" value={attendance} onChange={(e) => setAttendance(e.target.value)}>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                  </select>
                </div>

                <button type="submit" className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium">
                  Submit Attendance
                </button>
              </div>
            </form>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-700">Attendance Records</h2>
            <button onClick={fetchAttendanceRecords} className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm">
              Refresh
            </button>
          </div>
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-zinc-50">
            <ul className="divide-y divide-gray-200">
              {attendanceRecords.map((record, index) => (
                <li key={index} className="px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                  <span className="font-medium text-gray-800">{record.subject_id}</span> • {record.date} • <span className={record.present ? "text-green-600 font-medium" : "text-gray-600"}>{record.present ? "Present" : "Absent"}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}