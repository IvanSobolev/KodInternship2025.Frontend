import { format, isEqual } from 'date-fns';
import type { Task } from '../types';
import { DepartmentLabels, TaskStatusLabels } from '../types';

interface TaskDetailsModalProps {
  task: Task | null;
  onClose: () => void;
}

export const TaskDetailsModal = ({ task, onClose }: TaskDetailsModalProps) => {
  if (!task) return null;
  
  // Проверяем, отличается ли дата обновления от даты создания
  const isEdited = task.updatedAt && !isEqual(new Date(task.createdAt), new Date(task.updatedAt));
  
  return (
    <dialog className={`modal ${task ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-2">{task.title}</h3>
        <p className="mb-2">{task.text}</p>
        <div className="mb-4">
          <p className="text-sm mb-1"><span className="font-semibold">Отдел:</span> {DepartmentLabels[task.department]}</p>
          <p className="text-sm mb-1"><span className="font-semibold">Статус:</span> {TaskStatusLabels[task.status]}</p>
          <p className="text-sm mb-1"><span className="font-semibold">Исполнитель:</span> {task.assignedWorkerId ? `ID: ${task.assignedWorkerId}` : 'Не назначен'}</p>
        </div>
        <div className="text-sm text-gray-500 mb-4">
          {isEdited ? (
            <p>Редактировано: {format(new Date(task.updatedAt), 'dd.MM.yyyy HH:mm')}</p>
          ) : (
            <p>Создано: {format(new Date(task.createdAt), 'dd.MM.yyyy HH:mm')}</p>
          )}
        </div>
        <div className="modal-action">
          <button
            className="btn btn-outline"
            onClick={onClose}
          >
            Закрыть
          </button>
        </div>
      </div>
    </dialog>
  );
}; 