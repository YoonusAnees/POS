import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

import { 
  Users as UsersIcon, 
  UserPlus, 
  UserCog, 
  Trash2, 
  Mail, 
  Key, 
  User as UserIcon,
  Shield,
  Search,
  Filter,
  RefreshCw
} from "lucide-react";

export default function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", passwordHash: "", role: "cashier" });
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { 
    fetchUsers(); 
  }, []);

  // Filter users based on search + role
  useEffect(() => {
    let f = users;

    if (searchTerm) {
      f = f.filter(u =>
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (roleFilter !== "all") {
      f = f.filter(u => u.role === roleFilter);
    }

    setFilteredUsers(f);
  }, [searchTerm, roleFilter, users]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/users", form);
      setForm({ name: "", email: "", passwordHash: "", role: "cashier" });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Are you sure you want to deactivate this user?")) return;
    try {
      await api.delete("/users/" + id);
      fetchUsers();
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  const getRoleColor = (role) => {
    const map = {
      admin: "bg-purple-100 text-purple-700",
      cashier: "bg-blue-100 text-blue-700",
    };
    return map[role] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <Card variant="glass" className="mb-6">
          <CardHeader
            title="User Management"
            description="Create and manage all system users"
            action={
              <button
                onClick={fetchUsers}
                className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl hover:bg-gray-50 shadow-sm"
              >
                <RefreshCw size={18} />
                Refresh
              </button>
            }
          />
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
              <UsersIcon className="text-blue-500" size={40} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 text-sm">Admins</p>
                <p className="text-2xl font-bold">
                  {users.filter(u => u.role === "admin").length}
                </p>
              </div>
              <Shield className="text-purple-500" size={40} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 text-sm">Cashiers</p>
                <p className="text-2xl font-bold">
                  {users.filter(u => u.role === "cashier").length}
                </p>
              </div>
              <UserCog className="text-emerald-500" size={40} />
            </CardContent>
          </Card>
        </div>

        {/* Create Form */}
        <Card className="mb-8">
          <CardHeader
            title="Create New User"
            description="Add a new user with access role"
            action={<UserPlus size={22} className="text-emerald-600" />}
          />

          <CardContent>
            <form onSubmit={submit} className="space-y-4">

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

                <Input
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />

                <Input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />

                <Input
                  type="password"
                  placeholder="Password"
                  value={form.passwordHash}
                  onChange={(e) => setForm({ ...form, passwordHash: e.target.value })}
                  required
                />

                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="border p-3 rounded-xl"
                >
                  <option value="cashier">Cashier</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="flex justify-end">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  {loading ? "Creating..." : "Create User"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="flex flex-col md:flex-row justify-between gap-4">

            {/* Search */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={19} />
              <input
                className="w-full pl-10 pr-4 py-2 border rounded-xl"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter */}
            <div className="relative w-full md:w-60">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={19} />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-xl"
              >
                <option value="all">All Roles</option>
                <option value="admin">Administrators</option>
                <option value="cashier">Cashiers</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* USERS LIST */}
        <div className="grid gap-4">
          {filteredUsers.map(user => (
            <Card key={user._id} className="p-4 border-l-4 border-l-blue-500">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-lg font-semibold">{user.name}</p>
                  <p className="text-gray-600 text-sm">{user.email}</p>

                  <span
                    className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${getRoleColor(
                      user.role
                    )}`}
                  >
                    {user.role.toUpperCase()}
                  </span>
                </div>

                <button
                  onClick={() => remove(user._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
}
