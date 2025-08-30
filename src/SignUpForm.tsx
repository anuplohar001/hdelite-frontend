import React, { useState } from 'react';

const serverUri = "http://localhost:5000";

interface FormData {
    name: string;
    dateOfBirth: string;
    email: string;
    otp: string;
}

interface FormErrors {
    name?: string;
    dateOfBirth?: string;
    email?: string;
    general?: string;
    otp?: string;
}

interface ApiResponse {
    success: boolean;
    message: string;
    user?: {
        id: string;
        name: string;
        email: string;
    };
    token?: string;
    errors?: string[];
}

const SignUpForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        dateOfBirth: '',
        email: '',
        otp: ''
    });

    const [isSignUp, setIsSignUp] = useState(true); // toggle SignUp/SignIn
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [message, setMessage] = useState("");
    const [otpSent, setOtpSent] = useState(false);

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (isSignUp) {
            if (!formData.name.trim()) {
                newErrors.name = 'Name is required';
            } else if (formData.name.trim().length < 2) {
                newErrors.name = 'Name must be at least 2 characters';
            }

            if (!formData.dateOfBirth) {
                newErrors.dateOfBirth = 'Date of birth is required';
            }
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (field: keyof FormData) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));

        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        if (!otpSent) {
            setMessage("Please request OTP first.");
            return;
        }
        if (!formData.otp) {
            setMessage("Please enter the OTP.");
            return;
        }

        setIsLoading(true);
        setErrors({});

        try {
            const endpoint = isSignUp
                ? `${serverUri}/api/auth/signup`
                : `${serverUri}/api/auth/signin`;

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data: ApiResponse = await response.json();
            console.log('API Response:', data);
            if (data.success) {
                localStorage.setItem('token', data.token!);
                localStorage.setItem('user', JSON.stringify(data.user));
                setShowSuccess(true);
            } else {
                setErrors({ general: data.message });
            }
        } catch (error) {
            console.error('Auth error:', error);
            setErrors({ general: 'Network error. Please try again.' });
        } finally {
            setIsLoading(false);
        }
    };

    const sendOtp = async () => {
        if (!formData.email) {
            setMessage("Please enter your email first.");
            return;
        }

        try {
            const res = await fetch(`${serverUri}/api/auth/send-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email }),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage("OTP sent to your email!");
                setOtpSent(true);
            } else {
                setMessage(data.message || "Failed to send OTP");
            }
        } catch (err) {
            setMessage("Server error while sending OTP");
        }
    };

    const handleResendOtp = async () => {
        try {
            const res = await fetch(`${serverUri}/api/auth/resend-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email }),
            });

            const data = await res.json();
            if (data.success) {
                alert("OTP resent successfully to your email");
            } else {
                alert(data.message || "Failed to resend OTP");
            }
        } catch (err) {
            console.error("Resend OTP error:", err);
            alert("Something went wrong while resending OTP");
        }
    };


    if (showSuccess) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
                    <div className="mb-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to HD!</h2>
                        <p className="text-gray-600">You have successfully signed in!</p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {isSignUp ? "Create Account" : "Sign In"}
                    </h1>
                </div>

                {/* Errors */}
                {errors.general && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-red-600 text-sm">{errors.general}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {isSignUp && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={handleInputChange("name")}
                                    className="w-full px-4 py-3 border rounded-xl"
                                    placeholder="Enter your full name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                                <input
                                    type="date"
                                    value={formData.dateOfBirth}
                                    onChange={handleInputChange("dateOfBirth")}
                                    className="w-full px-4 py-3 border rounded-xl"
                                />
                            </div>
                        </>
                    )}

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange("email")}
                            className="w-full px-4 py-3 border rounded-xl"
                            placeholder="Enter your email"
                        />
                    </div>

                    {/* OTP Request */}
                    {!otpSent && (
                        <button
                            type="button"
                            onClick={sendOtp}
                            className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700"
                        >
                            Get OTP
                        </button>
                    )}

                    {/* OTP Field */}
                    {otpSent && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                OTP
                            </label>
                            <input
                                type="text"
                                value={formData.otp}
                                onChange={handleInputChange("otp")}
                                className="w-full px-4 py-3 border rounded-xl"
                                placeholder="Enter OTP"
                            />

                            {/* Resend OTP Button */}
                            <button
                                type="button"
                                onClick={handleResendOtp}
                                className="mt-3 text-blue-600 hover:text-blue-800 text-sm font-medium"
                            >
                                Resend OTP
                            </button>
                        </div>
                    )}


                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700"
                    >
                        {isSignUp ? "Create Account" : "Login"}
                    </button>
                </form>

                {/* Toggle */}
                <div className="text-center mt-4">
                    <button
                        onClick={() => {
                            setIsSignUp(!isSignUp);
                            setOtpSent(false);
                            setFormData({ name: "", dateOfBirth: "", email: "", otp: "" });
                        }}
                        className="text-blue-600 cursor-pointer"
                    >
                        {isSignUp ? "Already have an account? Sign In" : "New user? Create Account"}
                    </button>
                </div>

                {message && <p className="text-center text-sm text-red-500 mt-2">{message}</p>}
            </div>
        </div>
    );
};

export default SignUpForm;
