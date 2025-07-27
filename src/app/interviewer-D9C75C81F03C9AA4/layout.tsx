"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  HelpCircle,
  Menu,
  X,
  ChartPie,
  CirclePlus,
  Video,
  LogOut,
} from "lucide-react";
import Image from "next/image";
import { AuthService } from "@/services/authService";
import { User } from "@/types/auth";

const StudentLayout = ({ children }: { children: React.ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const hasCheckedAuth = useRef(false);

  const menuItems = [
    {
      id: "overview",
      label: "Overview",
      icon: ChartPie,
      href: "/interviewer-D9C75C81F03C9AA4",
    },
    {
      id: "addslots",
      label: "Add Slots",
      icon: CirclePlus,
      href: "/interviewer-D9C75C81F03C9AA4/addslots",
    },
    {
      id: "meetings",
      label: "Meetings",
      icon: Video,
      href: "/interviewer-D9C75C81F03C9AA4/meetings",
    },
    {
      id: "help",
      label: "Help",
      icon: HelpCircle,
      href: "/interviewer-D9C75C81F03C9AA4/help",
    },
  ];

  const getActiveSection = (): string => {
    if (pathname.includes("/addslots")) return "addslots";
    if (pathname.includes("/meetings")) return "meetings";
    if (pathname.includes("/help")) return "help";
    return "overview";
  };

  const activeSection = getActiveSection();

  // Authentication check
  useEffect(() => {
    if (hasCheckedAuth.current) return;
    hasCheckedAuth.current = true;

    const checkAuthentication = async (): Promise<void> => {
      console.log("Checking authentication in layout...");
      try {
        const userData = await AuthService.checkAuth();
        if (!userData) {
          console.log("User not authenticated, redirecting to login...");
          router.replace("/auth/login/interviewer");
          return;
        }
        console.log("User authenticated in layout:", userData);
        setUser(userData);
        setIsAuthenticating(false);
      } catch (error) {
        console.error("Authentication check failed:", error);
        router.replace("/auth/login/interviewer");
      }
    };

    checkAuthentication();
  }, [router]); // Empty dependency array to run only once

  const handleLogout = (): void => {
    const logoutUrl = AuthService.getLogoutUrl();
    console.log(logoutUrl);
    
    window.location.href = logoutUrl;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const sidebar = document.getElementById("mobile-sidebar");
      const menuButton = document.getElementById("mobile-menu-button");

      if (
        isMobileMenuOpen &&
        sidebar &&
        !sidebar.contains(event.target as Node) &&
        menuButton &&
        !menuButton.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // Show loading while authenticating
  if (isAuthenticating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render children if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen">
      <button
        id="mobile-menu-button"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-black text-white rounded-lg shadow-lg  transition-colors duration-200 md:mr-2 scale-[0.8] md:scale-[1] mt-1 md:mt-0"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      <div
        id="mobile-sidebar"
        className={`fixed lg:sticky inset-y-0 right-0 lg:left-0 z-40 w-64 h-screen 
          bg-white backdrop-blur-md border-l lg:border-l-0 lg:border-r border-white/20 
          flex flex-col transition-transform duration-300 ease-in-out border-r-[0.25px] border-r-black/25 drop-shadow-2xl
          ${
            isMobileMenuOpen
              ? "translate-x-0"
              : "translate-x-full lg:translate-x-0"
          }`}
      >
        <div className="p-6 pb-4 sm:pb-2 border-b border-white/20 md:bg-transparent md:mb-0">
          <Image
            src="/PWIOILogo.png"
            alt="PW IOI Logo"
            width={160}
            height={0}
          />

          {user && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                {user.avatarUrl && (
                  <Image
                    src={user.avatarUrl}
                    alt="User Avatar"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-2 border-t-2 sm:border-t-0 border-black/25">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <a
                key={item.id}
                href={item.href}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-md 
                  transition-all duration-200 ease-in-out cursor-pointer
                  ${
                    isActive
                      ? "bg-black text-white shadow-md transform scale-[1.01]"
                      : "hover:bg-gray-200 hover:transform hover:scale-[1.01]"
                  }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Logout button at the bottom */}
        <div className="p-4 border-t border-white/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-md 
              hover:bg-red-50 hover:text-red-600 transition-all duration-200 ease-in-out cursor-pointer
              text-gray-700"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
      <div className="flex-1 bg-gray-50 lg:ml-0">
        <div className="px-2 py-4 sm:p-6 w-screen md:w-[1000px]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default StudentLayout;
