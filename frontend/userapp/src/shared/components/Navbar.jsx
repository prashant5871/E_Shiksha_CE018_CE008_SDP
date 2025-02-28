import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import Auth from '../../user/auth'
import { useContext, useState } from 'react'
import { AuthContext } from '../context/auth-context'
import { NavLink } from 'react-router-dom'
import Logo from './Logo'

const navigation = [
  { name: 'Home', href: '/', current: true },
  { name: 'Saved', href: '/saved', current: false },
  { name : 'My Courses', href:"enrolled-courses", current: false}
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar({toggleModal,isModalOpen}) {
  
  const auth = useContext(AuthContext)

  return (
    <>
      <nav className="bg-gray-900 fixed top-0 left-0 right-0 z-20 shadow-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            
            {/* Left Section: Logo & Navigation */}
            <div className="flex items-center space-x-6">
              {/* SVG Logo */}
              <NavLink to="/">
                <Logo h={"18"} w={"18"} color={"#ffffff"}/>
              </NavLink>

              {/* Navigation Links */}
              <div className="hidden sm:flex space-x-4">
                {navigation.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={({ isActive }) =>
                      classNames(
                        isActive ? 'text-white border-b-2 border-yellow-400' : 'text-gray-300 hover:text-white',
                        'px-3 py-2 text-sm font-medium transition duration-200'
                      )
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Center Section: Search Bar */}
            <div className="relative max-w-xs w-full hidden sm:block">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="block w-full pl-10 pr-3 py-2 rounded-md text-gray-900 bg-gray-100 focus:ring-2 focus:ring-yellow-400 sm:max-w-xs"
              />
            </div>

            {/* Right Section: Profile or Authenticate */}
            <div className="flex items-center space-x-4">
              {auth.isLoggedIn ? (
                // If user is logged in, show profile dropdown
                <Menu as="div" className="relative">
                  <MenuButton className="flex items-center text-sm focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2">
                    <span className="sr-only">Open user menu</span>
                    <img
                      alt="User Profile"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      className="h-8 w-8 rounded-full border border-gray-300"
                    />
                  </MenuButton>
                  <MenuItems className="absolute right-0 mt-2 w-40 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                    <MenuItem>
                      {({ active }) => (
                        <NavLink
                          to="/profile"
                          className={`block px-4 py-2 text-sm ${active ? 'bg-gray-100' : 'text-gray-700'}`}
                        >
                          Your Profile
                        </NavLink>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ active }) => (
                        <NavLink
                          to="/settings"
                          className={`block px-4 py-2 text-sm ${active ? 'bg-gray-100' : 'text-gray-700'}`}
                        >
                          Settings
                        </NavLink>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({ active }) => (
                        <button
                          onClick={auth.logout}
                          className={`block w-full text-left px-4 py-2 text-sm text-red-500 ${active ? 'bg-gray-100' : ''}`}
                        >
                          Logout
                        </button>
                      )}
                    </MenuItem>
                  </MenuItems>
                </Menu>
              ) : (
                // If user is NOT logged in, show Authenticate button
                <button
                  onClick={toggleModal}
                  className="text-blue-400 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium transition duration-200 hover:cursor-pointer"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Add padding-top to prevent content overlap with fixed navbar */}
      <div className="pt-16">
        <Auth isOpen={isModalOpen} onClose={toggleModal} />
      </div>
    </>
  )
}
