import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useContext, useState, useRef, useEffect } from 'react';
import { AuthContext } from '../context/auth-context';
import { NavLink } from 'react-router-dom';
import Auth from '../../user/Auth';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar({ toggleModal, isModalOpen }) {
  const auth = useContext(AuthContext);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef(null);
  const [navigation, setNavigation] = useState(null);

  useEffect(() => {
    if(auth?.isStudent)
    {
      setNavigation([
        { name: 'Home', href: '/' },
        { name: 'Saved', href: '/saved' },
        { name: 'My Courses', href: '/enrolled-courses' },
      ]);
    }else{
      setNavigation([
        { name: 'Home', href: '/' },
        { name: 'Manage Courses', href: '/manage-courses' },
        {name : 'Create' , href: '/create'},
      
      ]);
    }
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen,auth]);

  return (
    <nav className="bg-gray-900 shadow-lg h-14">
      <div className="mx-auto max-w-7xl px-6 flex items-center justify-between h-full">
        {/* Logo */}
        <NavLink to="/" className="text-xl font-bold bg-gradient-to-r from-purple-400 to-indigo-400 text-transparent bg-clip-text">
          eShiksha
        </NavLink>

        {/* Search Icon & Input */}
        <div className="relative flex-1 flex justify-center">
          <div className="flex gap-2">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-gray-400 hover:text-white transition"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>
            <div
              className={`transform transition-all duration-300 ${isSearchOpen ? 'w-56 opacity-100 visible' : 'w-0 opacity-0 invisible'
                }`}
            >
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                className="block w-full pl-3 pr-3 py-1.5 text-sm rounded-md bg-gray-800 text-white focus:ring-2 focus:ring-purple-400 transition-shadow"
              />
            </div>
          </div>
        </div>

        {/* Navigation Links & Auth */}
        <div className="flex items-center space-x-5">
          <div className="hidden sm:flex space-x-5">
            {navigation?.map((item) => (
              
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  classNames(
                    isActive ? 'text-purple-300 border-b-2 border-purple-300' : 'text-gray-300 hover:text-white',
                    'px-2 py-1 text-sm font-medium transition'
                  )
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>

          {/* Auth Section */}
          {auth.isLoggedIn ? (
            <Menu as="div" className="relative ">
              <MenuButton className="flex items-center">
                <img
                  alt="User"
                  src="https://static0.howtogeekimages.com/wordpress/wp-content/uploads/2023/08/tiktok-no-profile-picture.png"
                  className="h-8 w-8 rounded-full border cursor-pointer border-gray-400"
                />
              </MenuButton>
              <MenuItems className="absolute right-0 mt-2 w-40 rounded-md bg-white shadow-lg">
                <MenuItem>
                  {({ active }) => (
                    <NavLink to="/profile" className={`block px-4 py-2 text-sm ${active ? 'bg-gray-200' : 'text-gray-700'}`}>
                      Profile
                    </NavLink>
                  )}
                </MenuItem>
                <MenuItem>
                  {({ active }) => (
                    <button onClick={auth.logout} className={`block w-full cursor-pointer text-left px-4 py-2 text-sm text-red-500 ${active ? 'bg-gray-200' : ''}`}>
                      Logout
                    </button>
                  )}
                </MenuItem>
              </MenuItems>
            </Menu>
          ) : (
            <button
              onClick={toggleModal}
              className="text-white bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-indigo-600 hover:to-purple-500 rounded-md px-3 py-1.5 text-sm font-medium transition"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      <div className="pt-14">
        {/* Auth Modal */}
        {isModalOpen && <Auth isOpen={isModalOpen} onClose={toggleModal} />}
      </div>
    </nav>

  );
}
