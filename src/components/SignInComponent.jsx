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
    setShowToast(false);
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
      setErrorMessage("Unable to connect to the server. Please try again.");
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
          <div className="flex items-center justify-center gap-2"><svg className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 0H5m4 0h10M7 8v8a2 2 0 104 0V8a2 2 0 10-4 0z" /></svg><span className="text-xl font-bold">Resume Builder</span></div>
          <Form method="post" onSubmit={handleFormSubmit} className="space-y-5">
            <div><label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label><input id="email" name="email" type="email" autoComplete="email" required className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            <div><label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label><input id="password" name="password" type="password" autoComplete="current-password" required className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            <button type="submit" disabled={isLoading} className="w-full rounded-lg bg-blue-600 py-2.5 font-semibold text-white disabled:opacity-60">{isLoading ? "Signing in..." : "Sign In"}</button>
          </Form>
          <p className="text-center text-sm text-gray-600">Don't have an account? <Link to="/signup" className="font-semibold text-blue-600">Sign Up</Link></p>
        </div>
        <div ref={imageRef} className="relative hidden md:block w-1/2 bg-gray-100"><img src={SignInImage} alt="Resume builder" className="h-full w-full object-cover" /><div className="overlay absolute inset-0 bg-black/10" /></div>
      </div>
    </div>
  );
}

export default SignInComponent;
