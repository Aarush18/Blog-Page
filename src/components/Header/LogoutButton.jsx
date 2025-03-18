import React from 'react'
import { useDispatch } from 'react-redux'
import { logout } from '../../store/authSlice'
import authService from '../../appwrite/auth'

function LogoutButton() {
    const dispatch = useDispatch()

    const logOutHandler = async () => {
        try {
            await authService.logout();  // ✅ Await the logout
            dispatch(logout());  // ✅ Dispatch logout action
            console.log("User logged out successfully!"); // ✅ Log Success
        } catch (error) {
            console.error("Logout failed: ", error);  // ✅ Error handling
        }
    }

    return (
        <button
            onClick={logOutHandler}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
        >
            Logout
        </button>
    )
}

export default LogoutButton;
