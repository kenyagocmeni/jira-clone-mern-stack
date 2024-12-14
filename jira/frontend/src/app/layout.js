"use client";

import React, { useState } from "react";
import { Provider } from "react-redux";
import store from "@components/redux/store";
import Navbar from "@components/components/Navbar";
import { Sidebar } from "@components/components/Sidebar";
import "../styles/globals.css";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export default function RootLayout({ children }) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  const toggleSidebar = () => setIsSidebarExpanded((prev) => !prev);

  return (
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        <html lang="en" className="h-full overflow-hidden">
          <body>
            <header>
              <Navbar />
            </header>
            <div className="flex">
              <Sidebar
                isExpanded={isSidebarExpanded}
                toggleSidebar={toggleSidebar}
              />
              <main
                className={`transition-all duration-300 ease-in-out flex-grow h-screen overflow-auto bg-[#e7f8ff] ${
                  isSidebarExpanded ? "ml-64" : "ml-16"
                }`}
              >
                {children}
              </main>
            </div>
          </body>
        </html>
      </DndProvider>
    </Provider>
  );
}
