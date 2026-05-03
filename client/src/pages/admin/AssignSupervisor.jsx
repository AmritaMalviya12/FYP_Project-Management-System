import { Children, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { assignSupervisor as assignSupervisorThunk, getAllUsers } from "../../store/slices/adminSlice"
import { AlertTriangle, CheckCircle, Users } from "lucide-react"

const AssignSupervisor = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedSupervisors, setSelectedSupervisors] = useState({})

  const { users, projects } = useSelector((state) => state.admin);

  useEffect(() => {
    if (!users || !users.length === 0) {
      dispatch(getAllUsers())
    }
  }, [dispatch]);
  const teachers = useMemo(() => {
    const teacherUsers = (users || []).filter(u => (u.role || "").toLowerCase() === "teacher")
    return teacherUsers.map(t => ({
      ...t,
      assignedCount: Array.isArray(t.assignedStudents) ? t.assignedStudents.length
        : 0,
      capacityLeft: (typeof t.maxStudents === "number" ? t.maxStudents : 0) - (Array.isArray(t.assignedStudents) ? t.assignedStudents.length
        : 0)
    }));
  }, [users]);

  const studentProjects = useMemo(() => {
    return (projects || []).filter(p => !!p.student?._id).map(p => ({
      projectId: p._id,
      title: p.title,
      status: p.status,
      supervisor: p.supervisor?.name || "-",
      supervisorId: p.supervisor?._id || "Unknown",
      studentId: p.student?._id || "Unknown",
      studentName: p.student?.name || "-",
      studentEmail: p.student?.email || "-",
      deadline: p.deadline ? new Date(p.deadline).toISOString().slice(0, 10) : "-",
      updatedAt: p.updatedAt ? new Date(p.updatedAt).toLocaleString().slice(0, 10) : "-",
      isApproved: p.status === "approved",
    }))
  }, [projects])

  const filtered = studentProjects.filter((row) => {
    const matchesSearch = (row.title || "").toLowerCase().includes(searchTerm.toLowerCase()) || (row.studentName || "").toLowerCase().includes(searchTerm.toLowerCase());
    const status = row.spervisor ? "assigned" : "unassigned";
    const matchesFilter = filterStatus === "all" || status === filterStatus;
    return matchesSearch;
  })
  const [pendingFor, setPendingFor] = useState(null);
  const handleSupervisorSelect = (projectId, supervisorId) => {
    setSelectedSupervisors((prev) => ({
      ...prev, [projectId]: supervisorId,
    }))
  }

  const handleAssign = async (studentId, projectStatus, projectId) => {
    const supervisorId = selectedSupervisors[projectId];
    if (!studentId || !supervisorId) {
      toast.error("Please select a supervisor first");
      return;
    }
    if (projectStatus === "rejected") {
      toast.error("Cannot assign supervisor to a rejected project");
      return;
    }
    setPendingFor(projectId);
    const res = await dispatch(assignSupervisorThunk({ studentId, supervisorId }));

    if (assignSupervisorThunk.fulfilled.match(res)) {
      toast.success("Suprvisor assign successfully");
      setSelectedSupervisors(prv => {
        const newState = { ...prev };
        delete newState[projectId];
        return newState;
      });
      dispatch(getAllUsers());

    } else {
      toast.error("Failed to assign supervisor");
    }
  }

  const dashboardCards = [
    {
      title: "Assigned Students",
      value: studentProjects.filter((r) => !!r.supervisor).length,
      icon: CheckCircle,
      bg: "bg-green-100",
      color: "text-green-600",
    },
    {
      title: "Unassigned Students",
      value: studentProjects.filter((r) => !r.supervisor).length,
      icon: AlertTriangle,
      bg: "bg-red-100",
      color: "text-red-600",
    },
    {
      title: "Available Teachers",
      value: teachers.filter(
        (t) => (t.assignedCount ?? 0) < (t.maxStudents ?? 0)
      ).length,
      icon: Users,
      bg: "bg-blue-100",
      color: "text-blue-600",
    },
  ];

  // TABLE HEADER
  const headers = [
    "Student",
    "Project Title",
    "Supervisor",
    "Deadline",
    "Updated",
    "Assign Supervisor",
    "Actions",
  ];

  const Badge = ({ color, Children }) => {
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>{Children}</span>
  }
  return <>
    <div className="space-y-6">
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">Assign Supervisor</h1>
          <p className="card-subtitle">Manage supervisor assignments for student and projects</p>
        </div>
      </div>
      {/* FILTER */}
      <div className="card">
        <div className="flex flex-cols md:flex=row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-2">Search Students</label>
            <input type="text" placeholder="Search by student name or project title..." className="innput-field w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>

          <div className="w-full md:w-48">
            <label className="block text-sm font-medium text-slate-700 mb-2">Filter Status</label>

            <select className="input-field w-full " value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Students</option>
              <option value="assigned">Assigned</option>
              <option value="unassigned">Unassigned</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Student Assignments</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="ng-slate-50">
              <tr>
                {headers.map(h => {
                  return(
                    <th key={h} className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">{h}</th>
                  )
                })

                }
              </tr>
            </thead>
          </table>
        </div>
      </div>
    </div>
  </>;
};

export default AssignSupervisor;
