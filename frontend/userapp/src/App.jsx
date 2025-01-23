import { useState } from 'react'

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className="app">
      <header className="text-center py-8">
        <h1 className="text-4xl font-bold">Discover the world's top designers</h1>
        <p className="mt-4 text-lg">Explore work from the most talented and accomplished designers ready to take on your next project</p>
        <div className="mt-8 flex justify-center">
          <input type="text" placeholder="What are you looking for?" className="p-2 w-64 border border-gray-300 rounded-l" />
          <button className="p-2 bg-blue-500 text-white rounded-r">Search</button>
        </div>
        <div className="mt-4 flex justify-center gap-2">
          <span>Trending searches:</span>
          <button className="bg-gray-200 p-1 rounded">landing page</button>
          <button className="bg-gray-200 p-1 rounded">e-commerce</button>
          <button className="bg-gray-200 p-1 rounded">mobile app</button>
          <button className="bg-gray-200 p-1 rounded">logo design</button>
          <button className="bg-gray-200 p-1 rounded">dashboard</button>
          <button className="bg-gray-200 p-1 rounded">icons</button>
        </div>
      </header>
      <nav className="flex justify-center gap-4 py-4">
        <button className="p-2">Discover</button>
        <button className="p-2">Animation</button>
        <button className="p-2">Branding</button>
        <button className="p-2">Illustration</button>
        <button className="p-2">Mobile</button>
        <button className="p-2">Print</button>
        <button className="p-2">Product Design</button>
        <button className="p-2">Typography</button>
        <button className="p-2">Web Design</button>
      </nav>
      <main className="flex justify-center gap-4 flex-wrap">
        <div className="border border-gray-300 p-4 w-52 text-center">
          <img src="design1.jpg" alt="Design 1" className="w-full h-auto" />
          <div className="mt-4">
            <h3 className="font-bold">Agilie Team</h3>
            <p>86 likes • 10.5k views</p>
          </div>
        </div>
        <div className="border border-gray-300 p-4 w-52 text-center">
          <img src="design2.jpg" alt="Design 2" className="w-full h-auto" />
          <div className="mt-4">
            <h3 className="font-bold">Nixtio</h3>
            <p>138 likes • 7.1k views</p>
          </div>
        </div>
        <div className="border border-gray-300 p-4 w-52 text-center">
          <img src="design3.jpg" alt="Design 3" className="w-full h-auto" />
          <div className="mt-4">
            <h3 className="font-bold">Emote</h3>
            <p>116 likes • 14.4k views</p>
          </div>
        </div>
        <div className="border border-gray-300 p-4 w-52 text-center">
          <img src="design4.jpg" alt="Design 4" className="w-full h-auto" />
          <div className="mt-4">
            <h3 className="font-bold">Jetpacks and Rollerskates</h3>
            <p>30 likes • 1.4k views</p>
          </div>
        </div>
      </main>
    </div>
    </>
  )
}

export default App


