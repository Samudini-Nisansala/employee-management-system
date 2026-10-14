"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ employee_name:'', email:'', phone_number:'', department:'IT', job_position:'', joining_date:'' });
  const [editingId, setEditingId] = useState(null);
  const [deleteEmp, setDeleteEmp] = useState(null);

  const fetchEmployees = async () => {
    const res = await fetch('/api/employees');
    const data = await res.json();
    if(Array.isArray(data)) setEmployees(data);
  };
  useEffect(()=>{ fetchEmployees(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let url = '/api/employees';
    let method = 'POST';
    if(editingId){
      url = '/api/employees/' + editingId;
      method = 'PUT';
    }
    const res = await fetch(url, { method: method, headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) });
    if(!res.ok){ const d=await res.json(); alert(d.error); return; }
    setForm({ employee_name:'', email:'', phone_number:'', department:'IT', job_position:'', joining_date:'' });
    setEditingId(null);
    setShowForm(false);
    fetchEmployees();
  };

  const handleEdit = (emp) => {
    setForm({ employee_name: emp.employee_name, email: emp.email, phone_number: emp.phone_number, department: emp.department, job_position: emp.job_position, joining_date: emp.joining_date ? emp.joining_date.slice(0,10) : '' });
    setEditingId(emp.id);
    setShowForm(true);
  };

  const filtered = employees.filter(function(e){
    return e.employee_name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-64 bg-slate-900 text-white p-6">
        <h1 className="font-bold">Employee Management</h1>
        <div className="mt-8 bg-blue-900 p-3 rounded">Employees</div>
      </div>
      <div className="flex-1 p-8">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-bold">Employees</h2>
          <button onClick={function(){ setForm({ employee_name:'', email:'', phone_number:'', department:'IT', job_position:'', joining_date:'' }); setEditingId(null); setShowForm(true); }} className="bg-blue-600 text-white px-4 py-2 rounded">+ Add Employee</button>
        </div>
        <input placeholder="Search..." value={search} onChange={function(e){ setSearch(e.target.value); }} className="border p-2 rounded mb-4 w-80" />
        <div className="bg-white rounded border">
          <table className="w-full text-sm">
            <thead className="bg-gray-100"><tr><th className="p-3 text-left">Name</th><th className="p-3 text-left">Email</th><th className="p-3 text-left">Phone</th><th className="p-3 text-left">Dept</th><th className="p-3 text-left">Actions</th></tr></thead>
            <tbody>
              {filtered.map(function(emp){
                return (
                  <tr key={emp.id} className="border-t">
                    <td className="p-3">{emp.employee_name}</td>
                    <td className="p-3">{emp.email}</td>
                    <td className="p-3">{emp.phone_number}</td>
                    <td className="p-3">{emp.department}</td>
                    <td className="p-3 flex gap-2">
                      <button onClick={function(){ handleEdit(emp); }} className="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
                      <button onClick={function(){ setDeleteEmp(emp); }} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex justify-end">
          <div className="bg-white w-96 p-6">
            <h3 className="font-bold mb-4">{editingId ? "Edit" : "Add"} Employee</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input required placeholder="Name" value={form.employee_name} onChange={function(e){ setForm({...form, employee_name:e.target.value}); }} className="w-full border p-2 rounded" />
              <input required placeholder="Email" value={form.email} onChange={function(e){ setForm({...form, email:e.target.value}); }} className="w-full border p-2 rounded" />
              <input required placeholder="Phone" value={form.phone_number} onChange={function(e){ setForm({...form, phone_number:e.target.value}); }} className="w-full border p-2 rounded" />
              <select value={form.department} onChange={function(e){ setForm({...form, department:e.target.value}); }} className="w-full border p-2 rounded"><option>IT</option><option>HR</option><option>Finance</option><option>Marketing</option><option>Sales</option></select>
              <input required placeholder="Position" value={form.job_position} onChange={function(e){ setForm({...form, job_position:e.target.value}); }} className="w-full border p-2 rounded" />
              <input required type="date" value={form.joining_date} onChange={function(e){ setForm({...form, joining_date:e.target.value}); }} className="w-full border p-2 rounded" />
              <div className="flex gap-2 justify-end"><button type="button" onClick={function(){ setShowForm(false); }} className="border px-4 py-2 rounded">Cancel</button><button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{editingId ? "Update" : "Add"}</button></div>
            </form>
          </div>
        </div>
      )}
      {deleteEmp && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white p-6 rounded">
            <p>Delete {deleteEmp.employee_name}?</p>
            <div className="flex gap-2 mt-4 justify-center">
              <button onClick={function(){ setDeleteEmp(null); }} className="border px-4 py-2 rounded">Cancel</button>
              <button onClick={async function(){ await fetch('/api/employees/' + deleteEmp.id, {method:'DELETE'}); setDeleteEmp(null); fetchEmployees(); }} className="bg-red-500 text-white px-4 py-2 rounded">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}