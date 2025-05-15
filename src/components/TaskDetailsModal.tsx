import { format, isEqual } from 'date-fns';
import type { Task, Worker } from '../types';
import { DepartmentLabels, TaskStatusLabels, TaskStatus } from '../types';

interface TaskDetailsModalProps {
  task: Task | null;
  onClose: () => void;
  workers?: Worker[];
}

export const TaskDetailsModal = ({ task, onClose, workers = [] }: TaskDetailsModalProps) => {
  if (!task) return null;
  
  // Проверяем, отличается ли дата обновления от даты создания
  const isEdited = task.updatedAt && !isEqual(new Date(task.createdAt), new Date(task.updatedAt));
  
  // Функция для получения ФИО работника по его ID
  const getWorkerName = (task: Task): string => {
    if (!task.assignedWorkerId) return "Не назначен";
    
    // Если есть имя в самой задаче, используем его
    if (task.assignedWorkerName) return task.assignedWorkerName;
    
    // Иначе ищем среди списка работников
    const worker = workers.find(w => w.telegramId === task.assignedWorkerId);
    return worker ? worker.fullName : "Не найден";
  };
  
  // Получаем класс для индикатора статуса
  const getStatusBadgeClass = () => {
    switch (task.status) {
      case TaskStatus.New:
        return "badge-info";
      case TaskStatus.InProgress:
        return "badge-warning";
      case TaskStatus.OnReview:
        return "badge-accent";
      case TaskStatus.Done:
        return "badge-success";
      default:
        return "badge-neutral";
    }
  };
  
  return (
    <dialog className={`modal ${task ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
          {task.title}
          <span className={`badge ${getStatusBadgeClass()}`}>
            {TaskStatusLabels[task.status]}
          </span>
        </h3>
        
        <div className="divider my-2"></div>
        
        <div className="mb-4 prose">
          <h4 className="font-semibold text-base">Описание</h4>
          <p className="whitespace-pre-wrap">{task.text}</p>
        </div>
        
        <div className="bg-base-200 p-3 rounded-lg mb-4">
          <p className="text-sm mb-1"><span className="font-semibold">Отдел:</span> {DepartmentLabels[task.department]}</p>
          <p className="text-sm mb-1"><span className="font-semibold">Исполнитель:</span> {getWorkerName(task)}</p>
          {isEdited && (
            <p className="text-sm mb-1">
              <span className="font-semibold">Последнее изменение:</span> {format(new Date(task.updatedAt), 'dd.MM.yyyy HH:mm')}
            </p>
          )}
          <p className="text-sm mb-0">
            <span className="font-semibold">Создано:</span> {format(new Date(task.createdAt), 'dd.MM.yyyy HH:mm')}
          </p>
        </div>
        
        {task.status === TaskStatus.OnReview && (
          <div className="alert alert-accent shadow-lg mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current flex-shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h3 className="font-bold">Задача на проверке</h3>
              <div className="text-xs">Ожидайте уведомления о результатах проверки</div>
            </div>
          </div>
        )}
        
        <div className="modal-action">
          <button
            className="btn btn-outline"
            onClick={onClose}
          >
            Закрыть
          </button>
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>закрыть</button>
      </form>
    </dialog>
  );
};