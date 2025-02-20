import React, { useState } from 'react';

export default function Detail() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Button to trigger the drawer */}
      <div
        className="text-2xl p-3 bg-blue-500 text-white rounded-full cursor-pointer hover:bg-blue-600"
        onClick={toggleDrawer}
      >
        Hello
      </div>

      {/* Background overlay */}
      {isOpen && (
        <div
          className="fixed top-0 left-0 bg-gray-500/75 transition-opacity w-full h-full bg-opacity-50 z-40"
          onClick={toggleDrawer}
        />
      )}

      {/* Drawer/Modal style pop-up */}
      <aside
        className={`fixed top-1/8 flex flex-col items-center w-7/8 h-full bg-white bg-opacity-80 shadow-lg rounded-r-3xl transition-transform transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} z-50`}
      >
        <div className="relative h-full w-full overflow-hidden p-6">
          {/* Close Button */}
          <div
            className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full cursor-pointer hover:bg-red-600"
            onClick={toggleDrawer}
          >
            X
          </div>

          {/* Scrollable content */}
          <div
            className="text-lg overflow-y-auto"
            style={{
              maxHeight: 'calc(100vh - 80px)', // Adjust this value as needed
              scrollbarWidth: 'none', // Firefox
              msOverflowStyle: 'none', // Internet Explorer
            }}
          >
            <h2 className="text-2xl font-bold mb-4">Detailed Information</h2>
            <p className="mb-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla posuere magna vel erat dignissim, eget malesuada urna feugiat. Phasellus euismod, eros nec volutpat dictum, nisl leo volutpat ligula, eu tincidunt sapien leo sit amet est. Etiam luctus dui at mauris euismod, et egestas libero consectetur.
            </p>
            <p className="mb-2">
              Aliquam erat volutpat. Vivamus consequat vitae eros nec iaculis. Integer id dui dui. Donec ac lacus vel purus eleifend dapibus. Curabitur euismod neque ac purus dignissim, ac euismod mi accumsan. Nulla facilisi.
            </p>
            {/* Add more content to test scrolling */}
            <p className="mb-2">
              Curabitur vel dui non felis gravida gravida in sit amet risus. Nunc pharetra, justo id scelerisque iaculis, velit dui suscipit turpis, id rutrum tortor sapien ut tortor. Vivamus et magna et libero suscipit vulputate.
            </p>
            <p className="mb-2">
              Curabitur vel dui non felis gravida gravida in sit amet risus. Nunc pharetra, justo id scelerisque iaculis, velit dui suscipit turpis, id rutrum tortor sapien ut tortor. Vivamus et magna et libero suscipit vulputate.
            </p>
            <p className="mb-2">
              Curabitur vel dui non felis gravida gravida in sit amet risus. Nunc pharetra, justo id scelerisque iaculis, velit dui suscipit turpis, id rutrum tortor sapien ut tortor. Vivamus et magna et libero suscipit vulputate.
            </p>
            {/* Add more content here to test scrolling */}
            <p className="mb-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla posuere magna vel erat dignissim, eget malesuada urna feugiat. Phasellus euismod, eros nec volutpat dictum, nisl leo volutpat ligula, eu tincidunt sapien leo sit amet est. Etiam luctus dui at mauris euismod, et egestas libero consectetur.
            </p>
            <p className="mb-2">
              Aliquam erat volutpat. Vivamus consequat vitae eros nec iaculis. Integer id dui dui. Donec ac lacus vel purus eleifend dapibus. Curabitur euismod neque ac purus dignissim, ac euismod mi accumsan. Nulla facilisi.
            </p>
            {/* Add more content to test scrolling */}
            <p className="mb-2">
              Curabitur vel dui non felis gravida gravida in sit amet risus. Nunc pharetra, justo id scelerisque iaculis, velit dui suscipit turpis, id rutrum tortor sapien ut tortor. Vivamus et magna et libero suscipit vulputate.
            </p>
            <p className="mb-2">
              Curabitur vel dui non felis gravida gravida in sit amet risus. Nunc pharetra, justo id scelerisque iaculis, velit dui suscipit turpis, id rutrum tortor sapien ut tortor. Vivamus et magna et libero suscipit vulputate.
            </p>
            <p className="mb-2">
              Curabitur vel dui non felis gravida gravida in sit amet risus. Nunc pharetra, justo id scelerisque iaculis, velit dui suscipit turpis, id rutrum tortor sapien ut tortor. Vivamus et magna et libero suscipit vulputate.
            </p>
            <p className="mb-2">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla posuere magna vel erat dignissim, eget malesuada urna feugiat. Phasellus euismod, eros nec volutpat dictum, nisl leo volutpat ligula, eu tincidunt sapien leo sit amet est. Etiam luctus dui at mauris euismod, et egestas libero consectetur.
            </p>
            <p className="mb-2">
              Aliquam erat volutpat. Vivamus consequat vitae eros nec iaculis. Integer id dui dui. Donec ac lacus vel purus eleifend dapibus. Curabitur euismod neque ac purus dignissim, ac euismod mi accumsan. Nulla facilisi.
            </p>
            {/* Add more content to test scrolling */}
            <p className="mb-2">
              Curabitur vel dui non felis gravida gravida in sit amet risus. Nunc pharetra, justo id scelerisque iaculis, velit dui suscipit turpis, id rutrum tortor sapien ut tortor. Vivamus et magna et libero suscipit vulputate.
            </p>
            <p className="mb-2">
              Curabitur vel dui non felis gravida gravida in sit amet risus. Nunc pharetra, justo id scelerisque iaculis, velit dui suscipit turpis, id rutrum tortor sapien ut tortor. Vivamus et magna et libero suscipit vulputate.
            </p>
            <p className="mb-2">
              Curabitur vel dui non felis gravida gravida in sit amet risus. Nunc pharetra, justo id scelerisque iaculis, velit dui suscipit turpis, id rutrum tortor sapien ut tortor. Vivamus et magna et libero suscipit vulputate.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
