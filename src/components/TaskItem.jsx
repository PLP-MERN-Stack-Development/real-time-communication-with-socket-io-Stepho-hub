import { useState } from 'react';

function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);

  const handleEdit = () => {
    if (isEditing) {
      onEdit(task.id, editText);
    }
    setIsEditing(!isEditing);
  };

  const handleCancel = () => {
    setEditText(task.text);
    setIsEditing(false);
  };
  return (
    <div className={`flex items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg mb-4 bg-white dark:bg-gray-800 shadow-sm transition-all duration-300 hover:shadow-md hover-lift animate-fade-in ${
      task.completed ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : ''
    } md:flex-row flex-col md:items-center items-start`}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className="w-5 h-5 mr-4 cursor-pointer md:mb-0 mb-3"
      />
      {isEditing ? (
        <input
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          className="flex-1 ml-3 p-2 text-base border border-gray-300 dark:border-gray-600 rounded outline-none md:mb-0 mb-3"
          autoFocus
        />
      ) : (
        <span className={`flex-1 ml-3 text-base break-words text-gray-800 dark:text-white md:mb-0 mb-3 ${
          task.completed ? 'line-through text-gray-500 dark:text-gray-400' : ''
        }`}>
          {task.text}
        </span>
      )}
      {isEditing ? (
        <>
          <button
            onClick={handleEdit}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white border-none rounded cursor-pointer text-sm font-bold transition-colors duration-300 ml-3 md:ml-3 ml-0 md:mb-0 mb-2"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white border-none rounded cursor-pointer text-sm font-bold transition-colors duration-300 ml-3 md:ml-3 ml-0"
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white border-none rounded cursor-pointer text-sm font-bold transition-colors duration-300 ml-3 md:ml-3 ml-0 md:mb-0 mb-2"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white border-none rounded cursor-pointer text-sm font-bold transition-colors duration-300 ml-3 md:ml-3 ml-0"
          >
            Delete
          </button>
        </>
      )}
    </div>
  );
}

export default TaskItem;