import { useState } from "react";
import { Eye, EyeOff, LogIn } from "lucide-react";
import url from "../URL";
import { Link, useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [Error, setError] = useState("");
  const navigate = useNavigate();



  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8084/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login Success:", data);
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", data.email);
        navigate("/");
      } else {
        const errorText = await response.text();
        setError(`Login failed: ${errorText}`);
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 rounded-full bg-blue-600 p-2 text-white flex items-center justify-center">
            <LogIn size={24} />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your credentials to access your dashboard
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative block w-full rounded-md border-0 px-4 py-3 text-gray-900 ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full rounded-md border-0 px-4 py-3 text-gray-900 ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff size={18} className="text-gray-500" />
                ) : (
                  <Eye size={18} className="text-gray-500" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="group relative flex w-full justify-center rounded-md bg-blue-600 px-4 py-3 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-400"
            >
              {isLoading ? (
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                </span>
              ) : (
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LogIn size={18} className="text-blue-300" />
                </span>
              )}
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>

          <div className="text-center text-sm">
            <span className="text-gray-500">Don't have an account?</span>{" "}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              Create one now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}