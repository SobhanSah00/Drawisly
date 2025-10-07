"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Mail, Lock, User, ArrowRight, AlertCircle, Check } from "lucide-react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const res = await fetch("http://localhost:5050/api/v1/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          username,
          password,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Account created successfully! Redirecting...");
        setIsError(false);
        setUsername("");
        setEmail("");
        setPassword("");
        setTimeout(() => router.push("/dashboard"), 1000);
        console.log("User:", data.user);
      } else {
        setMessage(data.error || data.message || "Sign up failed");
        setIsError(true);
      }
    } catch (err) {
      console.error("Error:", err);
      setMessage("Network error. Please try again.");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordStrength = password.length > 0 ? (
    password.length < 6 ? "weak" : password.length < 10 ? "medium" : "strong"
  ) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-orange-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-orange-300 rounded-full blur-3xl opacity-20"></div>
      </div>

      <div className="w-full max-w-md relative">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center space-x-2 mb-4 group">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center transform rotate-12 group-hover:rotate-0 transition-transform">
              <Pencil className="w-7 h-7 text-white -rotate-12 group-hover:rotate-0 transition-transform" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
              Drawisly
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
          <p className="text-gray-600">Start collaborating in minutes</p>
        </div>

        {/* Sign Up Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-orange-100">
          {/* Benefits */}
          <div className="mb-6 space-y-2">
            {[
              "Unlimited collaborative rooms",
              "Real-time chat and drawing",
              "Free forever, no credit card"
            ].map((benefit, idx) => (
              <div key={idx} className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
                <span>{benefit}</span>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all"
                />
              </div>
              {/* Password Strength Indicator */}
              {passwordStrength && (
                <div className="mt-2 flex items-center space-x-2">
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all ${
                        passwordStrength === "weak" 
                          ? "w-1/3 bg-red-500" 
                          : passwordStrength === "medium" 
                          ? "w-2/3 bg-yellow-500" 
                          : "w-full bg-green-500"
                      }`}
                    ></div>
                  </div>
                  <span className={`text-xs font-medium ${
                    passwordStrength === "weak" 
                      ? "text-red-600" 
                      : passwordStrength === "medium" 
                      ? "text-yellow-600" 
                      : "text-green-600"
                  }`}>
                    {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
                  </span>
                </div>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start">
              <input 
                type="checkbox" 
                required 
                className="w-4 h-4 mt-1 text-orange-600 border-gray-300 rounded focus:ring-orange-500" 
              />
              <label className="ml-2 text-sm text-gray-600">
                I agree to the{" "}
                <Link href="/terms" className="text-orange-600 hover:text-orange-700 font-semibold">
                  Terms of Service
                </Link>
                {" "}and{" "}
                <Link href="/privacy" className="text-orange-600 hover:text-orange-700 font-semibold">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-xl transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <span>{isLoading ? "Creating account..." : "Create Account"}</span>
              {!isLoading && (
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              )}
            </button>

            {/* Message */}
            {message && (
              <div className={`flex items-center space-x-2 p-4 rounded-xl ${
                isError 
                  ? "bg-red-50 text-red-700 border border-red-200" 
                  : "bg-green-50 text-green-700 border border-green-200"
              }`}>
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">{message}</p>
              </div>
            )}
          </form>
        </div>

        {/* Sign In Link */}
        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <Link href="/signin" className="font-semibold text-orange-600 hover:text-orange-700 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}