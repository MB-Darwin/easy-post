// components/console-header.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { 
  Bell, 
  Search, 
  ChevronDown, 
  Instagram, 
  Linkedin, 
  Twitter 
} from "lucide-react";

export default function ConsoleHeader() {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  // Mock Notification Data
  const notifications = [
    { id: 1, platform: "instagram", text: "@sarah_design liked your post", time: "2m ago", icon: Instagram, color: "text-pink-500" },
    { id: 2, platform: "linkedin", text: "New comment on your scheduling workflow", time: "1h ago", icon: Linkedin, color: "text-blue-600" },
    { id: 3, platform: "twitter", text: "Your thread reached 1k views", time: "3h ago", icon: Twitter, color: "text-black" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 px-6 py-3">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          
          {/* 1. Logo */}
          <Link href="/console">
            <div className="relative h-10 w-[150px]"> 
              <Image 
                src="/Wiggle-Logo.png" 
                alt="Wiggle Logo" 
                fill 
                className="object-contain object-left" 
                priority
              />
            </div>
          </Link>

          {/* 2. Center Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 rounded-full p-1">
            <NavLink href="/console">Dashboard</NavLink>
            <NavLink href="/console/create">Create</NavLink>
            <NavLink href="/console/calendar">Calendar</NavLink>
            <NavLink href="/console/analytics">Analytics</NavLink>
          </nav>

          {/* 3. Right Actions */}
          <div className="flex items-center gap-3">
            
            {/* Search */}
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-full text-sm text-slate-500 transition-all">
              <Search className="h-4 w-4" />
              <span className="hidden lg:inline">Search...</span>
              <kbd className="hidden lg:inline px-2 py-0.5 bg-white rounded text-[10px] font-medium">⌘K</kbd>
            </button>
            
            {/* Notifications Toggle */}
            <div className="relative">
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`relative p-2 rounded-full transition-all ${isNotifOpen ? 'bg-blue-50 text-[#3C48F6]' : 'hover:bg-slate-100 text-slate-500'}`}
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full animate-pulse" />
              </button>

              {/* Notification Dropdown */}
              {isNotifOpen && (
                <div className="absolute top-12 right-0 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 animate-in fade-in slide-in-from-top-2 z-50">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-slate-50 mb-1">
                    <span className="font-bold text-sm text-slate-700">Notifications</span>
                    <span className="text-xs text-[#3C48F6] cursor-pointer hover:underline">Mark all read</span>
                  </div>
                  <div className="flex flex-col gap-1 max-h-[300px] overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className="flex items-start gap-3 p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors">
                        <div className={`p-2 rounded-full bg-slate-100 ${n.color}`}>
                          <n.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-slate-700 leading-snug">{n.text}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{n.time}</p>
                        </div>
                        <div className="h-2 w-2 bg-[#3C48F6] rounded-full mt-1"></div>
                      </div>
                    ))}
                  </div>
                  <div className="p-2 text-center border-t border-slate-50 mt-1">
                     <button className="text-xs font-medium text-slate-500 hover:text-[#3C48F6]">View all activity</button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile - Brand Color */}
            <button className="flex items-center gap-2 p-1 pr-3 hover:bg-slate-100 rounded-full transition-all group">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#3C48F6] to-[#6366F1] flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-[#3C48F6]/20 group-hover:shadow-[#3C48F6]/40 transition-all">
                B
              </div>
              <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
            </button>
          </div>
        </div>
      </header>
  );
}

// NavLink Sub-component
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = href === "/console" ? pathname === "/console" : pathname.startsWith(href);

  return (
    <Link 
      href={href} 
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
        isActive 
          ? "bg-white text-[#3C48F6] shadow-sm" 
          : "text-slate-600 hover:text-[#3C48F6] hover:bg-white/50"
      }`}
    >
      {children}
    </Link>
  );
}