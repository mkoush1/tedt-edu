import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className={`${collapsed ? 'w-20' : 'w-64'} bg-gradient-to-b from-[#592538] to-[#3d1a26] text-white h-full shadow-lg transition-all duration-300 flex flex-col`}>
      {/* Header with logos */}
      <div className="p-4 border-b border-white/10">
        <div className={`flex ${collapsed ? 'justify-center' : 'items-center space-x-3'} mb-2`}>
          <img
            src="/eduSoft_logo.png"
            alt="EduSoft Logo"
            className="h-10 w-auto"
          />
          {!collapsed && (
            <img
              src="/logo-02.png"
              alt="ASPU Logo"
              className="h-9 w-auto"
            />
          )}
        </div>
        {!collapsed && (
          <h2 className="text-lg font-semibold text-white/90 mt-2 pl-1">EduSoft</h2>
        )}
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
        <Link
          to="/dashboard"
          className={`group flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-3 py-3 rounded-lg transition-all ${
            isActive("/dashboard") 
              ? "bg-white/15 text-white shadow-md" 
              : "text-white/80 hover:bg-white/10 hover:text-white"
          }`}
        >
          <div className={`flex items-center ${collapsed ? '' : 'space-x-3'}`}>
            <div className={`flex items-center justify-center ${isActive("/dashboard") ? 'text-white' : 'text-white/70'} group-hover:text-white w-8 h-8`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.035-.84-1.875-1.875-1.875h-.75zM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75c-1.036 0-1.875-.84-1.875-1.875v-11.25zM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75C3.84 21.75 3 20.91 3 19.875v-6.75z" />
              </svg>
            </div>
            {!collapsed && (
              <span className={`text-sm font-medium ${isActive("/dashboard") ? 'text-white' : 'text-white/80'} group-hover:text-white`}>Dashboard</span>
            )}
          </div>
          {!collapsed && isActive("/dashboard") && (
            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
          )}
        </Link>
        
        <Link
          to="/assessments"
          className={`group flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-3 py-3 rounded-lg transition-all ${
            isActive("/assessments") 
              ? "bg-white/15 text-white shadow-md" 
              : "text-white/80 hover:bg-white/10 hover:text-white"
          }`}
        >
          <div className={`flex items-center ${collapsed ? '' : 'space-x-3'}`}>
            <div className={`flex items-center justify-center ${isActive("/assessments") ? 'text-white' : 'text-white/70'} group-hover:text-white w-8 h-8`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V9.375zM6 12a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V12zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 15a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V15zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 18a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V18zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75z" clipRule="evenodd" />
              </svg>
            </div>
            {!collapsed && (
              <span className={`text-sm font-medium ${isActive("/assessments") ? 'text-white' : 'text-white/80'} group-hover:text-white`}>Assessments</span>
            )}
          </div>
          {!collapsed && isActive("/assessments") && (
            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
          )}
        </Link>
        
        <Link
          to="/progress"
          className={`group flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-3 py-3 rounded-lg transition-all ${
            isActive("/progress") 
              ? "bg-white/15 text-white shadow-md" 
              : "text-white/80 hover:bg-white/10 hover:text-white"
          }`}
        >
          <div className={`flex items-center ${collapsed ? '' : 'space-x-3'}`}>
            <div className={`flex items-center justify-center ${isActive("/progress") ? 'text-white' : 'text-white/70'} group-hover:text-white w-8 h-8`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M1.5 5.625c0-1.036.84-1.875 1.875-1.875h17.25c1.035 0 1.875.84 1.875 1.875v12.75c0 1.035-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 18.375V5.625zM21 9.375A.375.375 0 0020.625 9h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zm0 3.75a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zm0 3.75a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5a.375.375 0 00.375-.375v-1.5zM10.875 18.75a.375.375 0 00.375-.375v-1.5a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375h7.5zM3.375 15h7.5a.375.375 0 00.375-.375v-1.5a.375.375 0 00-.375-.375h-7.5a.375.375 0 00-.375.375v1.5c0 .207.168.375.375.375zm0-3.75h7.5a.375.375 0 00.375-.375v-1.5A.375.375 0 0010.875 9h-7.5A.375.375 0 003 9.375v1.5c0 .207.168.375.375.375z" clipRule="evenodd" />
              </svg>
            </div>
            {!collapsed && (
              <span className={`text-sm font-medium ${isActive("/progress") ? 'text-white' : 'text-white/80'} group-hover:text-white`}>Progress</span>
            )}
          </div>
          {!collapsed && isActive("/progress") && (
            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
          )}
        </Link>
        
        <Link
          to="/team"
          className={`group flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-3 py-3 rounded-lg transition-all ${
            isActive("/team") 
              ? "bg-white/15 text-white shadow-md" 
              : "text-white/80 hover:bg-white/10 hover:text-white"
          }`}
        >
          <div className={`flex items-center ${collapsed ? '' : 'space-x-3'}`}>
            <div className={`flex items-center justify-center ${isActive("/team") ? 'text-white' : 'text-white/70'} group-hover:text-white w-8 h-8`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" />
                <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
              </svg>
            </div>
            {!collapsed && (
              <span className={`text-sm font-medium ${isActive("/team") ? 'text-white' : 'text-white/80'} group-hover:text-white`}>Team</span>
            )}
          </div>
          {!collapsed && isActive("/team") && (
            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
          )}
        </Link>
        
        <Link
          to="/settings"
          className={`group flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-3 py-3 rounded-lg transition-all ${
            isActive("/settings") 
              ? "bg-white/15 text-white shadow-md" 
              : "text-white/80 hover:bg-white/10 hover:text-white"
          }`}
        >
          <div className={`flex items-center ${collapsed ? '' : 'space-x-3'}`}>
            <div className={`flex items-center justify-center ${isActive("/settings") ? 'text-white' : 'text-white/70'} group-hover:text-white w-8 h-8`}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clipRule="evenodd" />
              </svg>
            </div>
            {!collapsed && (
              <span className={`text-sm font-medium ${isActive("/settings") ? 'text-white' : 'text-white/80'} group-hover:text-white`}>Settings</span>
            )}
          </div>
          {!collapsed && isActive("/settings") && (
            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
          )}
        </Link>
      </nav>

      {/* Footer with collapse button */}
      <div className="px-4 py-3 border-t border-white/10 flex justify-center">
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M13.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L11.69 12 4.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M19.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06L17.69 12l-6.97-6.97a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M10.72 11.47a.75.75 0 0 0 0 1.06l7.5 7.5a.75.75 0 1 0 1.06-1.06L12.31 12l6.97-6.97a.75.75 0 0 0-1.06-1.06l-7.5 7.5Z" clipRule="evenodd" />
              <path fillRule="evenodd" d="M4.72 11.47a.75.75 0 0 0 0 1.06l7.5 7.5a.75.75 0 1 0 1.06-1.06L6.31 12l6.97-6.97a.75.75 0 0 0-1.06-1.06l-7.5 7.5Z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
