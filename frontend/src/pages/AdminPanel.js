import React from "react";

const users = [
  {
    id: 1,
    name: "Jane Doe",
    email: "jane@example.com",
    avatar: "https://i.pravatar.cc/100?img=1",
    role: "User",
  },
  {
    id: 2,
    name: "John Smith",
    email: "john@example.com",
    avatar: "https://i.pravatar.cc/100?img=2",
    role: "User",
  },
  {
    id: 3,
    name: "Alice Johnson",
    email: "alice@example.com",
    avatar: "https://i.pravatar.cc/100?img=3",
    role: "User",
  },
  {
    id: 4,
    name: "Bob Brown",
    email: "bob@example.com",
    avatar: "https://i.pravatar.cc/100?img=4",
    role: "User",
  },
];

const AdminPanel = () => {
  const handleBan = (id) => {
    // Placeholder for ban logic
    alert(`Ban user with id: ${id}`);
  };
  const handlePromote = (id) => {
    // Placeholder for promote logic
    alert(`Promote user with id: ${id}`);
  };

  return (
    <div className="min-h-screen bg-base font-body flex flex-col items-center py-8">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-headline font-bold text-center text-eco mb-6">Admin Panel</h1>
        {/* Top Bar */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
          <input
            type="text"
            placeholder="Search..."
            className="flex-1 px-4 py-2 rounded bg-gray-700 text-white focus:outline-none"
          />
          <div className="flex gap-2 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 border border-gray-600">Manage User</button>
            <button className="flex-1 md:flex-none px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 border border-gray-600">Manage Orders</button>
            <button className="flex-1 md:flex-none px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 border border-gray-600">Manage Listings</button>
          </div>
        </div>
        {/* Manage Users Section */}
        <h2 className="text-xl font-semibold mb-4">Manage Users</h2>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="flex items-center bg-gray-700 rounded-lg p-4 gap-4">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-16 h-16 rounded-full border-2 border-gray-500 object-cover"
              />
              <div className="flex-1">
                <div className="font-bold text-lg">{user.name}</div>
                <div className="text-gray-300">{user.email}</div>
                <div className="text-gray-400 text-sm">Role: {user.role}</div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleBan(user.id)}
                  className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold"
                >
                  Ban User
                </button>
                <button
                  onClick={() => handlePromote(user.id)}
                  className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                >
                  Promote to Admin
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel; 