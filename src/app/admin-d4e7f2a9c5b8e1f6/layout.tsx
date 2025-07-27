"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  HelpCircle,
  Menu,
  X,
  ChartPie,
  User,
  GraduationCap,
} from "lucide-react";
import Image from "next/image";

const StudentLayout = ({ children }: { children: React.ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    {
      id: "overview",
      label: "Overview",
      icon: ChartPie,
      href: "/admin-d4e7f2a9c5b8e1f6",
    },
    {
      id: "interviewers",
      label: "Interviewers",
      icon: User,
      href: "/admin-d4e7f2a9c5b8e1f6/interviewers",
    },
    {
      id: "interviewees",
      label: "Interviewees",
      icon: GraduationCap,
      href: "/admin-d4e7f2a9c5b8e1f6/interviewees",
    },
    {
      id: "help",
      label: "Help",
      icon: HelpCircle,
      href: "/admin-d4e7f2a9c5b8e1f6/help",
    },
  ];

  const getActiveSection = () => {
    if (pathname.includes("/interviewers")) return "interviewers";
    if (pathname.includes("/interviewees")) return "interviewees";
    if (pathname.includes("/help")) return "help";
    return "overview";
  };

  const activeSection = getActiveSection();

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
        <div className="p-6 pb-4 sm:pb-6 border-b border-white/20 md:bg-transparent md:mb-0">
          <Image
            src="/PWIOILogo.png"
            alt="PW IOI Logo"
            width={160}
            height={0}
          />
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
      </div>

      <div className="flex-1 bg-gray-50 lg:ml-0">
        <div className="px-2 py-4 sm:p-6 w-screen md:w-[1000px]">{children}</div>
      </div>
    </div>
  );
};

export default StudentLayout;
