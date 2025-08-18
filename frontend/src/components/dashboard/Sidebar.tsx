"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  Clock, 
  TrendingUp,
  Target, // For Goals
  MessageSquare, 
  Settings, 
  LogOut 
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: CheckSquare, label: 'Task', path: '/tasks' },
  { icon: Calendar, label: 'Calendar', path: '/calendar' },
  { icon: Clock, label: 'Reminder', path: '/reminders' },
  { icon: TrendingUp, label: 'Progress Project', path: '/projects' },
  { icon: Target, label: 'Goals', path: '/goals' },
  { icon: MessageSquare, label: 'Messages', path: '/messages' },
  { icon: Settings, label: 'Settings', path: '/settings' },
  { icon: LogOut, label: 'Sign Out', path: '/logout' },
];

const Sidebar = ({ isOpen }: SidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <motion.aside 
      initial={{ x: isOpen ? 0 : -300 }}
      animate={{ x: isOpen ? 0 : -300 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={`
        ${isOpen ? 'fixed' : 'hidden'} lg:relative lg:block
        w-64 min-h-screen h-full bg-card border-r border-border z-50 flex flex-col
      `}
    >
      <div className="flex-1 flex flex-col p-6">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-foreground">Your Dash</h1>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            const isActive = pathname === item.path;
            
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => router.push(item.path)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer
                  transition-all duration-200 hover:bg-accent
                  ${isActive 
                    ? 'bg-primary text-primary-foreground shadow-lg' 
                    : 'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                <IconComponent className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </motion.div>
            );
          })}
        </nav>
      </div>
    </motion.aside>
  );
};

export default Sidebar;