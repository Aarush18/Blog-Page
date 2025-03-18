import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from "react-hook-form";
import authService from '../appwrite/auth';
import { login } from '../store/authSlice';
import { Button, Input, Logo } from '../components/index';

function Signup() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const dispatch = useDispatch();
    const { register, handleSubmit } = useForm();

    const create = async (data) => {
        setError(""); // Reset error state before trying signup
        try {
            const user = await authService.createAccount(data);
            if (user) {
                const currentUser = await authService.getCurrentUser();
                if (currentUser) {
                    dispatch(login(currentUser));
                    navigate("/");
                }
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="mx-auto w-full max-w-lg bg-gray-100 rounded-xl p-10 border border-black/10 shadow-lg">
                <div className="flex justify-center mb-6">
                    <Logo width="100px" />
                </div> 
                <h2 className="text-center text-2xl font-bold">Sign up to create an account</h2>
                <p className="mt-2 text-center text-sm text-black/60">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-medium text-blue-500 hover:underline"
                    >
                        Sign In
                    </Link>
                </p>
                {error && <p className="text-red-600 mt-4 text-center">{error}</p>}

                <form onSubmit={handleSubmit(create)} className="mt-6 space-y-5">
                    <Input
                        label="Full Name:"
                        placeholder="Enter your full name"
                        {...register("name", { required: true })}
                    />
                    <Input
                        label="Email:"
                        placeholder="Enter your email"
                        type="email"
                        {...register("email", {
                            required: true,
                            validate: {
                                matchPattern: (value) => 
                                    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                    "Email address must be valid",
                            }
                        })}
                    />
                    <Input
                        label="Password:"
                        type="password"
                        placeholder="Enter your password"
                        {...register("password", { required: true })}
                    />
                    <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                        Create Account
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default Signup;
