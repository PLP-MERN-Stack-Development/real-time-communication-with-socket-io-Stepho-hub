import TaskItem from './TaskItem';

function TaskList({ tasks, onToggle, onDelete, onEdit }) {
  return (
    <div className="list-none p-0">
      {tasks.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400 italic py-10 px-5 m-0">No tasks yet. Add one above!</p>
      ) : (
        tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))
      )}
    </div>
  );
}

export default TaskList;