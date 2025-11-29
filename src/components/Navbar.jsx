import { useState } from 'react';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-gray-800 dark:bg-gray-900 py-4 shadow-lg">
      <div className="max-w-6xl mx-auto px-5 flex justify-between items-center">
        <h2 className="text-white m-0 text-lg font-bold">Task Manager</h2>
        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
        <ul className={`flex list-none m-0 p-0 md:flex-row flex-col md:static absolute md:bg-transparent bg-gray-800 dark:bg-gray-900 md:w-auto w-full md:top-auto top-full md:left-auto left-0 md:shadow-none shadow-lg md:justify-center justify-center md:items-center items-start md:py-0 py-4 md:px-0 px-5 md:opacity-100 ${isOpen ? 'opacity-100' : 'opacity-0 md:opacity-100'} transition-opacity duration-300 md:flex`}>
          <li className="md:ml-8 md:mr-8 mr-0 md:mb-0 mb-2">
            <a href="#home" className="text-white no-underline text-base font-medium transition-colors duration-300 hover:text-green-400 block md:inline">Home</a>
          </li>
          <li className="md:ml-8 md:mr-8 mr-0 md:mb-0 mb-2">
            <a href="#tasks" className="text-white no-underline text-base font-medium transition-colors duration-300 hover:text-green-400 block md:inline">Tasks</a>
          </li>
          <li className="md:ml-8 md:mr-8 mr-0">
            <a href="#about" className="text-white no-underline text-base font-medium transition-colors duration-300 hover:text-green-400 block md:inline">About</a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;