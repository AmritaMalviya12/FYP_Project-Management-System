import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddTeacher from "../../components/modal/AddTeacher";
import { deleteTeacher, getAllUsers, createTeacher, updateTeacher } from "../../store/slices/adminSlice"
import { toggleTeacherModal } from "../../store/slices/popupSlice"
import { AlertTriangle, ConstructionIcon, BadgeCheck, Plus, TriangleAlert, Users, X } from "lucide-react";

const ManageTeachers = () => {
  const { users } = useSelector((state) => state.admin);
  const { isCreateTeacherModalOpen } = useSelector(state => state.popup);
  const [showModal, setShowModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    expertise: "",
    maxStudents: 1
  });

  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(getAllUsers());
  // }, []);

  const teachers = useMemo(() => {
    return (users || []).filter(u => u?.role?.toLowerCase()
      === "teacher");
  }, [users])

  const departments = useMemo(() => {
    const set = new Set(
      (teachers || []).map((t) => t.department
      ).filter(Boolean)
    );
    return Array.from(set);
  }, [teachers]);

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      (teacher.name || "").toLowerCase().includes(searchTerm.toLowerCase()) || (teacher.email || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterDepartment === "all" || teacher.department === filterDepartment;

    return matchesSearch && matchesFilter
  })
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTeacher(null);
    setFormData({
      name: "",
      email: "",
      department: "",
      expertise: "",
      maxStudents: 10,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingTeacher) {
      dispatch(updateTeacher({ id: editingTeacher._id, data: formData }))
        .then(() => { dispatch(getAllUsers()) });
    }
    handleCloseModal();
  };



  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      email: teacher.email,
      department: teacher.department,
      expertise: Array.isArray(teacher.expertise) ? teacher.expertise[0]
        : teacher.expertise,
      maxStudents: Number(teacher.maxStudents) || 10,
      // typeof teacher.maxStudents === "number" ? teacher.maxStudents: 10,
    });
    setShowModal(true)
  }

  const handleDelete = (teacher) => {
    setTeacherToDelete(teacher);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (teacherToDelete) {
      dispatch(deleteTeacher(teacherToDelete._id))
        .then(() => { //added code
          dispatch(getAllUsers())
        });
      setShowDeleteModal(false);
      setTeacherToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setTeacherToDelete(null);

  }
  return <>
    <div className="space-y-6">
      {/* Header */}
      <div className="card">
        <div className="card-header flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="flex flex-col">
            <h1 className="card-title">Manage Teachers</h1>
            <p className="card-subtitle">Add, edit, and manage teacher accounts</p>
          </div>

          <button onClick={() => dispatch(toggleTeacherModal())} className="btn-primary flex items-center space-x-2 mt-4 md:mt-0">
            <Plus className="w-5 h-5"></Plus>
            <span>Add New Teacher</span>
          </button>

        </div>

      </div>

      {/*STATE CARDS */}
      <div className="grid grid=cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Total Teachers</p>
              <p className="text-lg font-semibold text-slate-800">{teachers.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BadgeCheck className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Assigned Students</p>
              <p className="text-lg font-semibold text-slate-800">{teachers.reduce((sum, t) => sum + (t.assignedStudents?.length || 0), 0
              )}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <TriangleAlert className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Departments</p>
              <p className="text-lg font-semibold text-slate-800">{departments.length}</p>
            </div>
          </div>
        </div>

      </div>

      {/* FILTER */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Search Teachers</label>
            <input type="text" placeholder="Search by name or email..." className="input-field w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}></input>
          </div>
          <div className="w-full md:w-48">
            <label className="block text-sm font-medium text-slate-700 mb-2">Filter Status</label>
            <select className="input-field w-full " value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)}>
              <option value="all">All Departments</option>
              {
                departments.map((dept) => (
                  <option value={dept} key={dept}>{dept}</option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* TEACHERS TABLE */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Teachers List</h2>
        </div>
        <div className="overflow-x-auto">

          {filteredTeachers && filteredTeachers.length > 0 ? (
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xm font-medium text-slate-500 uppercase tracking-wide">Teacher Name</th>
                  <th className="px-6 py-3 text-left text-xm font-medium text-slate-500 uppercase tracking-wide">Email</th>
                  <th className="px-6 py-3 text-left text-xm font-medium text-slate-500 uppercase tracking-wide">Department</th>
                  <th className="px-6 py-3 text-left text-xm font-medium text-slate-500 uppercase tracking-wide">Expertise</th>
                  <th className="px-6 py-3 text-left text-xm font-medium text-slate-500 uppercase tracking-wide">Join Date</th>
                  <th className="px-6 py-3 text-left text-xm font-medium text-slate-500 uppercase tracking-wide">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {
                  filteredTeachers.map(teacher => {
                    return (
                      <tr key={teacher._id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                              <div className="text-sm font-medium text-slate-900">
                                {teacher.name}
                              </div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="text-sm text-slate-900">
                              {teacher.email}
                            </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-900">
                            {teacher.department || "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-900">
                            {teacher.expertise || "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {
                            teacher.createdAt
                            ? new Date(teacher.createdAt).toLocaleString(): "-"
                          }
                        </td>
                        
                        <td className=" px-6 py-4 whitespace text-sm font-medium">
                          <div className="flex space-x-3">
                            <button onClick={() => handleEdit(teacher)} className="text-blue-600 hover:text-blue-900">Edit</button>
                            <button onClick={() => handleDelete(teacher)} className="text-red-600 hover:text-red-900">Delete</button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>) : (
            filteredTeachers.length === 0 && (
              <div className="text-center py-8 text-slate-500">No teacher fount matching your criteria.</div>
            )
          )}

        </div>

        {/* EDIT STUDENT MODEL */}

        {
          showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-slate-900">Edit Teacher</h3>
                  <button onClick={handleCloseModal} className="text-slate-400 hover:to-slate-600">
                    <X className="w-6 h-6 " />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name field */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Full Name
                    </label>
                    <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })
                    }
                      className="input-field w-full py-2 border-b border-salte-600 focus: outline-none" />
                  </div>
                  {/* email field */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Email
                    </label>
                    <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })
                    }
                      className="input-field w-full py-2 border-b border-salte-600 focus: outline-none" />
                  </div>
                  {/* department field */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Department
                    </label>

                    <select className="input-field w-full py-2 border-b border-salte-600 focus:outline-none" required value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })
                    }>
                      <option value="Computer Science">Computer Science</option>
                      <option value="Software Engineering">Software Engineering</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Data Science">Data Science</option>
                      <option value="Electrical Engineering">Electrical Engineering</option>
                      <option value="Machanical Engineering">Machanical Engineering</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                      <option value="Business Administration">Business Administration</option>
                      <option value="Economics">Economics</option>
                      <option value="Psychology">Psychology</option>
                    </select>
                  </div>
                  {/* EXPERTISE */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Expertise
                    </label>

                    <select className="input-field w-full py-2 border-b border-salte-600 focus:outline-none" required value={formData.expertise} onChange={(e) => setFormData({ ...formData, expertise: e.target.value })
                    }>
                      <option value=" " disabled>Select Area of Expertise</option>
                      <option value="Artificial Inteligence">Artificial Inteligence</option>
                      <option value="Machine Learning">Machine Learning</option>
                      <option value="Cyber Security">Cyber Security</option>
                      <option value="Cloud Computing">Cloud Computing</option>
                      <option value="Software Development">Software Development</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Mobile App Development">Mobile App Development</option>
                      <option value="Database Systems">Database Systems</option>
                      <option value="Computer Network">Computer Network</option>
                      <option value="Operating System">Operating System</option>
                      <option value="Human-Computer Interaction">Human-Computer Interaction</option>
                      <option value="Big data Analytics">Big data Analytics</option>
                      <option value="Blockchain Technology">Blockchain Technology</option>
                      <option value="Internet of Things (IoT)">Internet of Things (IoT)</option>
                    </select>
                  </div>



                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Max Students
                    </label>
                    <input type="number" required max={10} min={1} value={formData.maxStudents} onChange={(e) => setFormData({ ...formData, maxStudents: e.target.value })
                    }
                      className="input-field w-full py-2 border-b border-salte-600 focus: outline-none" />
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">

                    <button type="submit" className="btn-primary">Update</button>
                    <button type="button" onClick={handleCloseModal} className="btn-danger">Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}

        {
          showDeleteModal && teacherToDelete && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl ">
                <div className="flex items-center mb-4">
                  <div className="flex-shrink-0 w-10 h-10 mx-auto flex items-center justify-center rounded-full bg-res-100">

                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-lg font-medium text-slate-900 mb-2">Delete Teacher</h3>
                  <p className="text-sm text-slate-500 mb-4">Are you sure{" "}<span>{teacherToDelete.name}? This action cannot be undo.</span></p>
                  <div className="flex justify-center space-x-3">
                    <button onClick={confirmDelete} className="btn-danger">Delete</button>
                    <button onClick={cancelDelete} className="btn-primary">Cancel</button>

                  </div>
                </div>
              </div>
            </div>

          )
        }

        {isCreateTeacherModalOpen &&
          <AddTeacher />
        }

      </div>
    </div>
  </>;
};

export default ManageTeachers;
