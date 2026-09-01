import React, { useEffect, useState, useRef } from "react";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import SignUpImage from "/Man Studying at Modern Desk.jpeg?url";
import { Form, Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DEFAULT_BACKEND_URL = "https://ai-resume-builderbackend-production.up.railway.app";

function SignUpComponent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef(null);
  const formRef = useRef(null);
  const imageRef = useRef(null);
  const configuredApiUrl = import.meta.env.VITE_BACKEND_URL;
  const API_URL = (configuredApiUrl || DEFAULT_BACKEND_URL).replace(/\/$/, "");

  useGSAP(
    () => {
      gsap.from(formRef.current.children, {
        opacity: 0,
        y: 20,
        stagger: 0.2,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.3,
      });

      if (imageRef.current) {
        gsap.from(imageRef.current, {
          opacity: 0,
          scale: 0.95,
          duration: 1,
          ease: "power3.out",
        });
        gsap.from(imageRef.current.querySelector(".overlay"), {
          opacity: 0,
          y: 30,
          duration: 0.8,
          ease: "power3.out",
          delay: 0.5,
        });
      }
    },
    { scope: containerRef }
  );

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const validateInput = ({ username, email, password }) => {
    if (!username || username.trim().length < 3) {
      return "Username must be at least 3 characters long";
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email address";
    }
    if (!password || password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    return null;
  };

  async function handleFormSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const { username, email, password } = Object.fromEntries(formData.entries());

    const validationError = validateInput({ username, email, password });
    if (validationError) {
      toast.error(validationError, {
        icon: <FaExclamationCircle />,
        autoClose: 3000,
        hideProgressBar: true,
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/user/sign-Up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: username.trim(),
          userEmail: email.trim().toLowerCase(),
          userPassword: password,
        }),
      });

      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await response.json()
        : { message: await response.text() };

      if (!response.ok) {
        throw new Error(data.message || `Signup failed (${response.status})`);
      }

      toast.success(data.message || "User signed up successfully", {
        icon: <FaCheckCircle />,
        autoClose: 3000,
        hideProgressBar: true,
      });
      event.currentTarget.reset();
    } catch (error) {
      console.error("Signup request failed:", error);
      const message = String(error.message || "");

      let errorMessage = "Unable to connect to the server. Please try again.";
      if (message === "Email already registered") {
        errorMessage = "This email is already registered. Please use a different email or sign in.";
      } else if (message.includes("required")) {
        errorMessage = "Please fill in all required fields.";
      } else if (message.includes("Failed to fetch")) {
        errorMessage = "Unable to reach the backend. Please check the server connection.";
      }

      toast.error(errorMessage, {
        icon: <FaExclamationCircle />,
        autoClose: 4000,
        hideProgressBar: true,
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 md:px-8 py-8 sm:py-12">
      <button
        type="button"
        onClick={handleBack}
        className="absolute top-4 sm:top-6 left-4 sm:left-6 p-2 bg-blue-900 text-white rounded-full shadow-md hover:bg-blue-800 transition-all duration-300"
        aria-label="Go back"
      >
        <FaArrowLeft size={16} />
      </button>

      <div
        ref={containerRef}
        className={`flex flex-col md:flex-row bg-white rounded-2xl shadow-xl max-w-4xl w-full overflow-hidden ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div
          ref={imageRef}
          className="hidden md:block w-1/2 relative bg-gradient-to-br from-blue-50 to-blue-100"
        >
          <img
            src={SignUpImage}
            alt="Man Studying at Modern Desk"
            className="w-full h-full object-cover rounded-l-2xl"
          />
          <div className="overlay absolute bottom-0 left-0 right-0 bg-blue-900 bg-opacity-80 p-4 sm:p-6 text-white">
            <h3 className="text-lg sm:text-xl font-bold tracking-tight">
              Elevate Your Career with Re-Gen
            </h3>
            <p className="text-sm sm:text-base mt-1 sm:mt-2 font-medium">
              Create a standout resume that gets noticed.
            </p>
          </div>
        </div>

        <div
          ref={formRef}
          className="w-full md:w-1/2 bg-white p-6 sm:p-8 space-y-5 sm:space-y-6 rounded-2xl md:rounded-r-2xl border-l border-gray-100"
        >
          <div className="flex items-center justify-center gap-2">
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h4 className="text-xl sm:text-2xl font-extrabold text-blue-900 tracking-tight text-center">
              Sign Up
            </h4>
          </div>

          <Form
            method="post"
            className="space-y-4 sm:space-y-5"
            onSubmit={handleFormSubmit}
          >
            <div>
              <label htmlFor="username" className="block text-sm sm:text-base font-semibold text-blue-900">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                placeholder="Enter your username"
                className="w-full h-10 sm:h-11 px-3 sm:px-4 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm sm:text-base font-semibold text-blue-900">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                className="w-full h-10 sm:h-11 px-3 sm:px-4 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm sm:text-base font-semibold text-blue-900">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                className="w-full h-10 sm:h-11 px-3 sm:px-4 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300"
                required
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-1/2 h-10 sm:h-11 px-4 sm:px-6 bg-blue-600 text-white font-semibold text-sm sm:text-base rounded-md shadow-md hover:bg-blue-700 transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V4a10 10 0 00-10 10h2z" transform="rotate(-90 12 12)" />
                  </svg>
                ) : (
                  "Confirm"
                )}
              </button>
              <Link
                to="/sign-in"
                className="w-full sm:w-1/2 h-10 sm:h-11 px-4 sm:px-6 bg-gray-200 text-blue-900 font-semibold text-sm sm:text-base rounded-md shadow-md hover:bg-gray-300 transition-all duration-300 flex items-center justify-center"
              >
                Sign In
              </Link>
            </div>
          </Form>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default SignUpComponent;
