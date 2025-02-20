import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import Auth from '../../user/auth'
import { useContext, useState } from 'react'
import { AuthContext } from '../context/auth-context'
import { NavLink } from 'react-router-dom'

const navigation = [
  { name: 'Dashboard', href: '/', current: true },
  { name: 'Saved', href: '/saved', current: false },
  { name: 'Projects', href: '#', current: false },
  { name: 'Calendar', href: '#', current: false },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const toggleModal = () => setIsModalOpen(!isModalOpen)
  const auth = useContext(AuthContext)

  return (
    <>
      <nav className="bg-gray-900 fixed top-0 left-0 right-0 z-10">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            {/* Logo and Navigation */}
            <div className="flex flex-1 items-center justify-start">
              <div className="flex shrink-0 items-center">
                <img
                  alt="Your Company"
                  src="logo.png"
                  className="h-15 w-auto"
                />
              </div>
              <div className="ml-6">
                <div className="flex space-x-4">
                  {navigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={({ isActive }) =>
                        classNames(
                          isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'rounded-md px-3 py-2 text-sm font-medium'
                        )
                      }
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-xs w-full">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="block w-full pl-10 pr-3 py-2 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 sm:max-w-xs"
              />
            </div>

            {/* Notification Icon */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <button
                type="button"
                className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
              >
                <span className="sr-only">View notifications</span>
                <BellIcon aria-hidden="true" className="h-6 w-6" />
              </button>

              {/* Profile dropdown */}
              <Menu as="div" className="relative ml-3">
                <div>
                  <MenuButton className="relative flex rounded-full bg-gray-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden">
                    <span className="sr-only">Open user menu</span>
                    <img
                      alt="User Profile"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      className="h-8 w-8 rounded-full"
                    />
                  </MenuButton>
                </div>

                <Menu.Items className="absolute right-0 z-10 mt-2 w-30 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 focus:outline-hidden">
                  <MenuItem>
                    <NavLink
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Your Profile
                    </NavLink>
                  </MenuItem>
                  <MenuItem>
                    <NavLink
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Settings
                    </NavLink>
                  </MenuItem>
                  <MenuItem>
                    <a
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={toggleModal}
                    >
                      Login
                    </a>
                  </MenuItem>
                </Menu.Items>
              </Menu>
            </div>

            <div className="ml-6">
              <div className="flex space-x-4">
                <a onClick={auth.isLoggedIn ? auth.logout : toggleModal} className='text-red-500 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium'>
                  {auth.isLoggedIn ? 'Logout' : 'Authenticate'}
                </a>
              </div>
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
