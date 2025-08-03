import React from 'react';
import { NavLink } from 'react-router-dom';

type SidebarProps = {
  isOpen: boolean;
};

function Sidebar({ isOpen = false }: SidebarProps) {
  return (
    <div
      className={`fixed left-0 top-0 bottom-0 bg-gray-900 text-white overflow-hidden transition-all duration-300 z-40 ${
        isOpen ? 'w-52 pl-4' : 'w-0 pl-0'
      }`}
      style={{ boxSizing: 'border-box' }}
    >
      <div
        className={`w-52 ${
          isOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
      >
        <h2 className="mt-4 text-lg font-bold">D&D Helper</h2>
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `block py-2 text-base no-underline outline-none shadow-none ${
              isActive ? 'text-cyan-300' : 'text-white'
            }`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/about"
          end
          className={({ isActive }) =>
            `block py-2 text-base no-underline outline-none shadow-none ${
              isActive ? 'text-cyan-300' : 'text-white'
            }`
          }
        >
          About
        </NavLink>
        <NavLink
          to="/worldbuilder"
          end
          className={({ isActive }) =>
            `block py-2 text-base no-underline outline-none shadow-none ${
              isActive ? 'text-cyan-300' : 'text-white'
            }`
          }
        >
          World Builder
        </NavLink>
        <NavLink
          to="/homebrew"
          end
          className={({ isActive }) =>
            `block py-2 text-base no-underline outline-none shadow-none ${
              isActive ? 'text-cyan-300' : 'text-white'
            }`
          }
        >
          Homebrew Manager
        </NavLink>
        <NavLink
          to="/generator"
          end
          className={({ isActive }) =>
            `block py-2 text-base no-underline outline-none shadow-none ${
              isActive ? 'text-cyan-300' : 'text-white'
            }`
          }
        >
          Character Generator
        </NavLink>
      </div>
    </div>
  );
}

export default Sidebar;
