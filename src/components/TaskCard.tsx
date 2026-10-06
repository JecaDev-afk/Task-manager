import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDispatch } from 'react-redux';
import { deleteTask } from '../store/tasksSlice';
import type { Task } from '../types';
import { Trash2 } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, isOverlay }) => {
  const dispatch = useDispatch();
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { type: 'Task', task }
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityColors = {
    LOW: '#666',
    MEDIUM: '#1a1a1a',
    HIGH: '#ff4444'
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`task-card ${isOverlay ? 'overlay' : ''}`}
      {...attributes} 
      {...listeners}
    >
      <div className="task-header">
        <h4>{task.title}</h4>
        <button 
          className="delete-btn" 
          onClick={(e) => { e.stopPropagation(); dispatch(deleteTask(task.id)); }}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <Trash2 size={16} />
        </button>
      </div>
      <p className="task-desc">{task.description}</p>
      
      <div className="task-footer">
        <span className="priority" style={{ borderColor: priorityColors[task.priority], color: priorityColors[task.priority] }}>
          {task.priority}
        </span>
        <span className="date">{task.date}</span>
      </div>
    </div>
  );
};

export default TaskCard;
