import React, { useEffect, useState, useRef } from "react";
import { FaArrowLeft, FaExclamationCircle } from "react-icons/fa";
import SignInImage from "/2 SCENE.png";
import { Form, Link, useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function SignInComponent() {
  const [isVisible, setIsVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef(null);
  const formRef = useRef(null);
  const imageRef = useRef(null);
  const toastRef = useRef(null);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_BACKEND_URL;

  useGSAP(() => {
    gsap.from(formRef.current.children, { opacity: 0, y: 20, stagger: 0.2, duration: 0.8, ease: "power3.out", delay: 0.3 });
    if (imageRef.current) {
      gsap.from(imageRef.current, { opacity: 0, scale: 0.95, duration: 1, ease: "power3.out" });
      gsap.from(imageRef.current.querySelector(".overlay"), { opacity: 0, y: 30, duration: 0.8, ease: "power3.out", delay: 0.5 });
    }
    if (showToast && toastRef.current) {
      gsap.fromTo(toastRef.current, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.5, ease: "power2.out", onComplete: () => gsap.to(toastRef.current, { opacity: 0, x: 20, duration: 0.5, ease: "power2.in", delay: 2.5, onComplete: () => setShowToast(false) }) });
    }
  }, { scope: containerRef, dependencies: [showToast] });

  useEffect(() => setIsVisible(true), []);

  async function handleFormSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.target);
    const { email, password } = Object.fromEntries(formData.entries());

    try {
      const response = await fetch(`${API_URL}/user/sign-In`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userEmail: email, userPassword: password }),
        credentials: "include",
      });

      const result = await response.json().catch(() => ({}));
      if (response.ok) {
        navigate("/user");
      } else {
        setErrorMessage(result.message || "Invalid email or password");
        setShowToast(true);
      }
    } catch (_error) {
      setErrorMessage("Something went wrong. Please try again later.");
      setShowToast(true);
    } finally {
      setIsLoading(false);
    }
  }

  const handleBack = () => window.history.back();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 md:px-8 py-8 sm:py-12">
      {showToast && <div ref={toastRef} className="fixed top-4 sm:top-6 right-4 sm:right-6 z-50 flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-red-600 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-lg"><FaExclamationCircle /><span>{errorMessage}</span></div>}
      <button onClick={handleBack} className="absolute top-4 sm:top-6 left-4 sm:left-6 p-2 bg-blue-900 text-white rounded-full shadow-md hover:bg-blue-800 transition-all duration-300"><FaArrowLeft size={16} /></button>
      <div ref={containerRef} className={`flex flex-col md:flex-row bg-white rounded-2xl shadow-xl max-w-4xl w-full overflow-hidden ${isVisible ? "opacity-100" : "opacity-0"}`}>
        <div ref={formRef} className="w-full md:w-1/2 bg-white p-6 sm:p-8 space-y-5 sm:space-y-6 rounded-2xl md:rounded-l-2xl border-r border-gray-100">
          <div className="flex items-center justify-center gap-2">
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <h4 className="text-xl sm:text-2xl font-extrabold text-blue-900 tracking-tight text-center">Sign In</h4>
          </div>
          <Form method="post" className="space-y-4 sm:space-y-5" onSubmit={handleFormSubmit}>
            <div><label htmlFor="email" className="block text-sm sm:text-base font-semibold text-blue-900">Email</label><input type="email" id="email" name="email" placeholder="Enter your email" className="w-full h-10 sm:h-11 px-3 sm:px-4 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300" required /></div>
            <div><label htmlFor="password" className="block text-sm sm:text-base font-semibold text-blue-900">Password</label><input type="password" id="password" name="password" placeholder="Enter your password" className="w-full h-10 sm:h-11 px-3 sm:px-4 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all duration-300" required /></div>
            <div className="text-right"><button type="button" className="text-blue-600 text-xs sm:text-sm font-semibold hover:underline">Forgot Password?</button></div>
            <div><button type="submit" disabled={isLoading} className="w-full h-10 sm:h-11 px-4 sm:px-6 bg-blue-600 text-white font-semibold text-sm sm:text-base rounded-md shadow-md hover:bg-blue-700 disabled:opacity-60 transition-all duration-300">{isLoading ? "Signing In..." : "Sign In"}</button></div>
            <div className="text-center"><p className="text-gray-600 text-xs sm:text-sm">Don't have an account? <Link to="/sign-up" className="text-blue-600 font-semibold hover:underline">Sign Up</Link></p></div>
          </Form>
        </div>
        <div ref={imageRef} className="hidden md:block w-1/2 relative bg-gradient-to-br from-blue-50 to-blue-100"><img src={SignInImage} alt="Man Studying at Modern Desk" className="w-full h-full object-cover rounded-r-2xl" /><div className="overlay absolute bottom-0 left-0 right-0 bg-blue-900 bg-opacity-80 p-4 sm:p-6 text-white"><h3 className="text-lg sm:text-xl font-bold tracking-tight">Welcome Back!</h3><p className="text-sm sm:text-base mt-1 sm:mt-2 font-medium">Sign in to continue building your perfect resume.</p></div></div>
      </div>
    </div>
  );
}

export default SignInComponent;
