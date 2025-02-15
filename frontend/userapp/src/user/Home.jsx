import React from 'react'

const cardData = [
  { id: 1, title: 'The Coldest Sunset', image: 'https://th.bing.com/th/id/OIP.cdaqahKneD7uo0_UQX_W7QHaEK?w=304&h=180&c=7&r=0&o=5&dpr=2.2&pid=1.7', description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit.' },
  { id: 2, title: 'The Warmest Beach', image: 'https://th.bing.com/th/id/OIP.cdaqahKneD7uo0_UQX_W7QHaEK?w=304&h=180&c=7&r=0&o=5&dpr=2.2&pid=1.7', description: 'Sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.' },
  { id: 3, title: 'Mountain View', image: 'https://th.bing.com/th/id/OIP.cdaqahKneD7uo0_UQX_W7QHaEK?w=304&h=180&c=7&r=0&o=5&dpr=2.2&pid=1.7', description: 'Laboris nisi ut aliquip ex ea commodo consequat.' },
  { id: 4, title: 'Autumn Leaves', image: 'https://th.bing.com/th/id/OIP.cdaqahKneD7uo0_UQX_W7QHaEK?w=304&h=180&c=7&r=0&o=5&dpr=2.2&pid=1.7', description: 'Nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' },
  { id: 5, title: 'Snowy Peaks', image: 'https://th.bing.com/th/id/OIP.cdaqahKneD7uo0_UQX_W7QHaEK?w=304&h=180&c=7&r=0&o=5&dpr=2.2&pid=1.7', description: 'Excepteur sint occaecat cupidatat non proident.' },
  { id: 6, title: 'Tropical Forest', image: 'https://th.bing.com/th/id/OIP.cdaqahKneD7uo0_UQX_W7QHaEK?w=304&h=180&c=7&r=0&o=5&dpr=2.2&pid=1.7', description: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' },
  { id: 7, title: 'Sunny Days', image: 'https://th.bing.com/th/id/OIP.cdaqahKneD7uo0_UQX_W7QHaEK?w=304&h=180&c=7&r=0&o=5&dpr=2.2&pid=1.7', description: 'Ullamco laboris nisi ut aliquip ex ea commodo consequat.' },
  { id: 8, title: 'Desert Landscape', image: 'https://th.bing.com/th/id/OIP.cdaqahKneD7uo0_UQX_W7QHaEK?w=304&h=180&c=7&r=0&o=5&dpr=2.2&pid=1.7', description: 'Excepteur sint occaecat cupidatat non proident.' },
  { id: 9, title: 'City Lights', image: 'https://th.bing.com/th/id/OIP.cdaqahKneD7uo0_UQX_W7QHaEK?w=304&h=180&c=7&r=0&o=5&dpr=2.2&pid=1.7', description: 'Nulla pariatur. Excepteur sint occaecat cupidatat non proident.' },
  { id: 10, title: 'Golden Hour', image: 'https://th.bing.com/th/id/OIP.cdaqahKneD7uo0_UQX_W7QHaEK?w=304&h=180&c=7&r=0&o=5&dpr=2.2&pid=1.7', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' },
]

export default function Home() {
  return (
    <>
        <div>Hello Word</div>      
      <div className="m-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {cardData.map(card => (
          <div key={card.id} className="max-w-sm rounded overflow-hidden shadow-lg">
            <img className="w-full" src={card.image} alt={card.title} />
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2">{card.title}</div>
              <p className="text-gray-700 text-base">
                {card.description}
              </p>
            </div>
            <div className="px-6 pt-4 pb-2">
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#photography</span>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#travel</span>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#winter</span>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
