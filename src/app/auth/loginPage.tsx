"use client";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

interface LoginPageProps {
  role: "interviewer" | "interviewer";
  imagePath: string;
}

export default function LoginPage({ role, imagePath }: LoginPageProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);

    try {
      // Add your Google OAuth logic here
      // For example: window.location.href = '/auth/google';

      toast.success(`Redirecting to Google Sign In...`, {
        toastId: "google-redirect",
        autoClose: 2000,
      });

      setTimeout(() => {
        // Replace with your actual Google OAuth URL or logic
        console.log(`Initiating Google Sign In for ${role} role`);
        // window.location.href = `/auth/google?role=${role}`;
      }, 1000);
    } catch (error) {
      console.error("Google Sign In error:", error);

      toast.error("Failed to initiate Google Sign In. Please try again.", {
        toastId: "google-error",
        autoClose: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#fafafa]">
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss={true}
        draggable={true}
        pauseOnHover={true}
        theme="light"
        className="!z-50"
        toastClassName="!rounded-lg !text-sm"
      />

      <div className="w-full max-w-md bg-white border border-black/50 rounded-lg shadow-xl p-8">
        <div className="px-12 mb-6">
          <Image
            src={imagePath}
            width={500}
            height={500}
            className="w-full h-full object-cover"
            alt="Login Image"
          />
        </div>
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-black">
            {role === "interviewer" ? "Interviewer Login" : "Interviewee Login"}
          </h1>
          <p className="text-gray-600 text-sm">
            Sign in to access your dashboard
          </p>
        </div>

        <div className="px-10">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full flex items-center justify-center px-4 py-3 border border-black/50 rounded-lg bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 cursor-pointer"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span className="text-black font-medium">Signing in...</span>
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5 mr-3"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-black font-medium">
                  Sign in with Google
                </span>
              </>
            )}
          </button>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500 px-10">
            By signing in, you agree to our terms of service and privacy policy
          </p>
        </div>
      </div>
    </div>
  );
}
