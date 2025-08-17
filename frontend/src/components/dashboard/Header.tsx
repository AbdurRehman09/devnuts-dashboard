"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Sun, Moon, Menu } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header = ({ toggleSidebar }: HeaderProps) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-between p-6 bg-card border-b border-border"
    >
      {/* Left side - Mobile menu and title */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors"
        >
          <Menu className="w-5 h-5 text-foreground" />
        </button>
        <h2 className="text-2xl font-bold text-foreground hidden md:block">Overview</h2>
      </div>

      {/* Right side - Search, Theme Toggle, Profile */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search here..."
            className="
              pl-10 pr-4 py-2 w-80 bg-input border border-border rounded-lg
              text-foreground placeholder:text-muted-foreground
              focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
              transition-all duration-200
            "
          />
        </div>

        {/* Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleTheme}
          className="
            p-2 rounded-lg bg-accent hover:bg-accent/80 
            transition-colors duration-200
          "
        >
          {theme === 'light' ? (
            <Moon className="w-5 h-5 text-foreground" />
          ) : (
            <Sun className="w-5 h-5 text-foreground" />
          )}
        </motion.button>

        {/* Profile */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-foreground">Ritika</p>
            <p className="text-xs text-muted-foreground">rita@gmail.com</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">R</span>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default Header;