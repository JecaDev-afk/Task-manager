import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent, DragOverEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import KanbanColumn from './KanbanColumn';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
import type { RootState } from '../store/store';
import { updateTaskStatus } from '../store/tasksSlice';
import type { TaskStatus } from '../types';
import './KanbanBoard.scss';

const COLUMNS: { id: TaskStatus; title: string }[] = [
  { id: 'TODO', title: 'To Do' },
  { id: 'IN_PROGRESS', title: 'In Progress' },
  { id: 'DONE', title: 'Done' }
];

const KanbanBoard: React.FC = () => {
  const { tasks } = useSelector((state: RootState) => state.tasks);
  const { currentUser } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const [activeId, setActiveId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userTasks = tasks.filter(t => t.userId === currentUser?.id);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Basic logic for visual cues can be added here if needed
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const activeIdStr = active.id as string;
    const overIdStr = over.id as string;

    const activeTask = userTasks.find(t => t.id === activeIdStr);
    const overTask = userTasks.find(t => t.id === overIdStr);
    
    const isOverColumn = COLUMNS.some(c => c.id === overIdStr);
    
    if (activeTask) {
      if (isOverColumn) {
        if (activeTask.status !== overIdStr) {
           dispatch(updateTaskStatus({ id: activeTask.id, status: overIdStr as TaskStatus }));
        }
      } else if (overTask) {
        if (activeTask.status !== overTask.status) {
          dispatch(updateTaskStatus({ id: activeTask.id, status: overTask.status }));
        }
      }
    }
  };

  return (
    <div className="kanban-board-container">
      <div className="board-header">
        <h2>My Tasks</h2>
        <button onClick={() => setIsModalOpen(true)}>+ Add Task</button>
      </div>

      <DndContext 
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="board-columns">
          {COLUMNS.map(col => {
            const columnTasks = userTasks.filter(t => t.status === col.id);
            return (
              <KanbanColumn key={col.id} column={col} tasks={columnTasks} />
            );
          })}
        </div>

        <DragOverlay>
          {activeId ? <TaskCard task={userTasks.find(t => t.id === activeId)!} isOverlay /> : null}
        </DragOverlay>
      </DndContext>

      {isModalOpen && <TaskModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default KanbanBoard;
