import React, { useEffect, useState } from "react";
import { fetchAllUsers } from "../../service/authService";
import '../../CSS/UserList.css';

const UsersList = () => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const getUsers = async () => {
            try {
                const data = await fetchAllUsers();
                setUsers(data.users); 
            } catch (error) {
                setError("Failed to fetch users");
            }
        };

        getUsers();
    }, []);

    return (
        <div className="users-container">
            <h1>All Users</h1>
            {error && <div className="error-message">{error}</div>}
            <table className="users-table">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Phone</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map((user) => (
                            <tr key={user._id}>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.phone}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No users found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default UsersList;
