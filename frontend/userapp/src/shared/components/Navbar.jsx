import { useState, useContext, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/auth-context';
import Auth from '../../user/Auth';
import {
  HomeIcon,
  BookmarkIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar({ toggleModal, isModalOpen }) {
  const auth = useContext(AuthContext);
  const {query,setQuery} = useContext(AuthContext);
  const [navigation, setNavigation] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (auth?.isStudent && auth?.isLoggedIn) {
      setNavigation([
        { name: 'Home', href: '/', icon: <HomeIcon className="w-5 h-5" /> },
        { name: 'Saved', href: '/saved', icon: <BookmarkIcon className="w-5 h-5" /> },
        { name: 'My Courses', href: '/enrolled-courses', icon: <UserIcon className="w-5 h-5" /> },
        // { name: 'Profile', href: '/profile', icon: <Cog6ToothIcon className="w-5 h-5" /> },
      ]);
    } else if (auth?.isLoggedIn) {
      setNavigation([
        { name: 'Home', href: '/', icon: <HomeIcon className="w-5 h-5" /> },
        { name: 'Manage Courses', href: '/manage-courses', icon: <Cog6ToothIcon className="w-5 h-5" /> },
        { name: 'Create', href: '/create', icon: <UserIcon className="w-5 h-5" /> },
        {name: 'Live Classes', href: '/sessions'}
      ]);
    } else {
      setNavigation([
        { name: 'Home', href: '/' },
        { name: 'My Courses', href: '/enrolled-courses' },
        {name : 'Create' , href: '/create'},
        {name: 'Sessions', href: '/sessions'}
        { name: 'Home', href: '/', icon: <HomeIcon className="w-5 h-5" /> },
        { name: 'About us', href: '/about', icon: <UserIcon className="w-5 h-5" /> },
      ]);
    }
  }, [auth]);

  const updateSearchQuery = (e) => {
    console.log("query is changing....");
    setQuery(e.target.value);
  }

  return (
    <nav className="bg-gray-900 shadow-lg h-14 relative">
      <div className="mx-auto max-w-7xl px-6 flex items-center justify-between h-full">
        {/* Logo */}
        <NavLink
          to="/"
          className="text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 text-transparent bg-clip-text"
        >
          eShiksha
        </NavLink>

        {/* Search Box - Visible only on larger screens */}
        <div className="relative flex-1 hidden sm:flex justify-center">
          <div className="w-56">
            <input
              value={query}
              onChange={updateSearchQuery}
              type="text"
              placeholder="Search..."
              className="block w-full pl-3 pr-3 py-1.5 text-sm rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-purple-400 transition-shadow"
            />
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden sm:flex items-center space-x-5">
          {navigation?.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                classNames(
                  isActive
                    ? 'text-purple-300 border-b-2 border-purple-300'
                    : 'text-gray-300 hover:text-white',
                  'px-2 py-1 text-sm font-medium transition flex items-center space-x-2'
                )
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}

          {/* Auth Section */}
          {auth.isLoggedIn ? (
            <button
              onClick={auth.logout}
              className="flex items-center space-x-2 text-red-500 hover:text-red-700 bg-gray-800 px-3 py-1.5 rounded-md transition"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span>Logout</span>
            </button>
          ) : (
            <button
              onClick={toggleModal}
              className="text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-indigo-600 hover:to-purple-500 rounded-md px-3 py-1.5 text-sm font-medium transition"
            >
              Sign In
            </button>
          )}

        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="sm:hidden text-white"
        >
          {mobileMenuOpen ? (
            <XMarkIcon className="w-7 h-7" />
          ) : (
            <Bars3Icon className="w-7 h-7" />
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-gray-900 border-t border-gray-800 p-4 flex flex-col space-y-3">
          {navigation?.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className="flex items-center space-x-3 text-gray-300 hover:text-white py-2 px-4 rounded-md transition block w-full"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}

          {/* Logout Button in Mobile Menu */}
          {auth.isLoggedIn ? (
            <button
              onClick={() => {
                auth.logout();
                setMobileMenuOpen(false);
              }}
              className="flex items-center space-x-3 text-red-500 hover:text-red-700 py-2 px-4 w-full rounded-md transition"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span>Logout</span>
            </button>
          ) : (
            <button
              onClick={() => {
                toggleModal();
                setMobileMenuOpen(false);
              }}
              className="text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-indigo-600 hover:to-purple-500 rounded-md px-4 py-2 text-sm font-medium transition w-full text-center"
            >
              Sign In
            </button>
          )}
        </div>
      )}

      <div className="pt-14">
        {/* Auth Modal */}
        {isModalOpen && <Auth isOpen={isModalOpen} onClose={toggleModal} />}
      </div>
    </nav>
  );
}
