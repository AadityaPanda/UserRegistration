import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ManageUsers.css';
import { toast } from 'react-toastify';

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Debounced fetch function
  const fetchUsers = async (query = '') => {
    try {
      setIsLoading(true);

      const url = query
        ? `http://localhost:3000/admin/search?query=${encodeURIComponent(query)}`
        : 'http://localhost:3000/admin/user';

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else {
        toast.error('Failed to fetch users.');
      }
    } catch (error) {
      toast.error('An error occurred while fetching users.');
    } finally {
      setIsLoading(false);
    }
  };

  // Debouncing the search query
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchUsers(searchQuery);
    }, 50); // 50ms debounce delay

    return () => clearTimeout(debounceTimer); // Cleanup on each input change
  }, [searchQuery]);

  // Handle deleting a user
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/admin/user/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (response.ok) {
        setUsers(users.filter((user) => user.id !== id));
        toast.success('User deleted successfully.');
      } else {
        toast.error('Failed to delete user.');
      }
    } catch (error) {
      toast.error('An error occurred while deleting user.');
    }
  };

  // Handle activating a user
  const handleActivate = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/admin/user/${id}/activate`, {
        method: 'PATCH',
        credentials: 'include',
      });
      if (response.ok) {
        setUsers(users.map((user) =>
          user.id === id ? { ...user, active: true } : user
        ));
        toast.success('User activated successfully.');
      } else {
        toast.error('Failed to activate user.');
      }
    } catch (error) {
      toast.error('An error occurred while activating user.');
    }
  };

  // Handle deactivating a user
  const handleDeactivate = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/admin/user/${id}/deactivate`, {
        method: 'PATCH',
        credentials: 'include',
      });
      if (response.ok) {
        setUsers(users.map((user) =>
          user.id === id ? { ...user, active: false } : user
        ));
        toast.success('User deactivated successfully.');
      } else {
        toast.error('Failed to deactivate user.');
      }
    } catch (error) {
      toast.error('An error occurred while deactivating user.');
    }
  };

  return (
    <div className="manage-users-container">
      <h1>Manage Users</h1>
      <input
        type="text"
        placeholder="Search users..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="form-control mb-3"
      />
      {isLoading ? (
        <p>Loading users...</p>
      ) : (
        <ul className="list-group">
          {users.length > 0 ? (
            users.map((user) => (
              <li key={user.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <p><strong>Username:</strong> {user.username}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>First Name:</strong> {user.firstname}</p>
                  <p><strong>Middle Name:</strong> {user.middlename}</p>
                  <p><strong>Last Name:</strong> {user.lastname}</p>
                  <p><strong>Mobile Number:</strong> {user.mobile_no}</p>
                </div>
                <div>
                  <Link to={`/admin/edit/${user.id}`} className="btn btn-secondary btn-sm mr-2">Edit</Link>
                  <button onClick={() => handleDelete(user.id)} className="btn btn-danger btn-sm mr-2">Delete</button>
                  {user.active ? (
                    <button onClick={() => handleDeactivate(user.id)} className="btn btn-warning btn-sm">Deactivate</button>
                  ) : (
                    <button onClick={() => handleActivate(user.id)} className="btn btn-success btn-sm">Activate</button>
                  )}
                </div>
              </li>
            ))
          ) : (
            <p>No users found.</p>
          )}
        </ul>
      )}
    </div>
  );
}

export default ManageUsers;