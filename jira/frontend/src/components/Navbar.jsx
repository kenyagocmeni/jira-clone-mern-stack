"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout, setUser } from "@components/redux/slices/userSlice";
import "@components/styles/globals.css";
import { MenuIcon } from "@heroicons/react/outline";
import Image from "next/image";

export default function Navbar() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.user);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Kullanıcı oturumunu LocalStorage'dan kontrol et
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !userInfo) {
      dispatch(setUser({ token }));
    }
  }, [userInfo, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <div className="bg-blue-700 text-white flex justify-between items-center h-16 px-4 shadow-md relative">
      {/* Navbar Title */}
      <div
        className="text-2xl font-bold mx-12 cursor-pointer"
        onClick={() => router.push("/")}
      >
        <Image src="/images/jiraIcon.jpg" width={120} height={100} alt="Logo" />
      </div>

      {/* Menu Icon */}
      <div
        className="relative mx-12"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <MenuIcon className="h-6 w-6 text-white cursor-pointer" />

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-10">
            <ul className="py-2">
              {userInfo ? (
                <>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      router.push("/profile/invitations");
                    }}
                  >
                    Davetiyeler
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      handleLogout();
                    }}
                  >
                    Çıkış Yap
                  </li>
                </>
              ) : (
                <>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      router.push("/login");
                    }}
                  >
                    Giriş Yap
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      router.push("/register");
                    }}
                  >
                    Üye Ol
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
