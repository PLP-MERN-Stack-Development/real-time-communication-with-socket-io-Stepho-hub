import { useState } from 'react';
import Navbar from './Navbar';
import AddTaskForm from './AddTaskForm';
import TaskList from './TaskList';
import Footer from './Footer';
import { useTheme } from '../hooks/useTheme';
import useLocalStorage from '../hooks/useLocalStorage';

function TaskManager() {
  const [tasks, setTasks] = useLocalStorage('tasks', []);
  const [filter, setFilter] = useState('all');
  const { theme, toggleTheme } = useTheme();

  const addTask = (taskText) => {
    const newTask = {
      id: Date.now() + Math.random(),
      text: taskText,
      completed: false,
    };
    setTasks([...tasks, newTask]);
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const editTask = (id, newText) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, text: newText } : task
    ));
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <div className="w-full m-0 p-5 font-sans bg-gray-100 dark:bg-gray-900 min-h-screen flex flex-col box-border">
      <Navbar />
      <div className="flex-1">
        <h1 className="text-center text-gray-800 dark:text-white mb-8 text-4xl md:text-5xl">Task Manager</h1>
        <div className="flex justify-center mb-6">
          <button
            onClick={toggleTheme}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 animate-bounce-in"
          >
            {theme === 'light' ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
        <AddTaskForm onAddTask={addTask} />
        <div className="flex justify-center mb-5 gap-3 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer text-base transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700 ${
              filter === 'all' ? 'bg-green-500 text-white border-green-500 hover:bg-green-600' : ''
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer text-base transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700 ${
              filter === 'active' ? 'bg-green-500 text-white border-green-500 hover:bg-green-600' : ''
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer text-base transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700 ${
              filter === 'completed' ? 'bg-green-500 text-white border-green-500 hover:bg-green-600' : ''
            }`}
          >
            Completed
          </button>
        </div>
        <TaskList tasks={filteredTasks} onToggle={toggleTask} onDelete={deleteTask} onEdit={editTask} />
      </div>
      <Footer />
    </div>
  );
}

export default TaskManager;