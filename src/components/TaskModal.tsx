import { format, isEqual } from 'date-fns';
import type { NewTask, Task, Worker } from '../types';
import { Department, DepartmentLabels } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  newTask: NewTask;
  setNewTask: (task: NewTask) => void;
  editTask: Task | null;
  workers: Worker[];
  onSave: () => void;
  onClose: () => void;
}

export const TaskModal = ({
  isOpen,
  newTask,
  setNewTask,
  editTask,
  workers,
  onSave,
  onClose
}: TaskModalProps) => {
  // Проверяем, отличается ли дата обновления от даты создания
  const isEdited = editTask?.updatedAt && !isEqual(new Date(editTask.createdAt), new Date(editTask.updatedAt));
  
  return (
    <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-2">
          {editTask ? 'Редактировать задачу' : 'Новая задача'}
        </h3>
        <input
          className="input input-bordered w-full mb-2"
          placeholder="Название"
          value={newTask.title}
          onChange={e => setNewTask({ ...newTask, title: e.target.value })}
        />
        <textarea
          className="textarea textarea-bordered w-full mb-2"
          placeholder="Описание"
          value={newTask.text}
          onChange={e => setNewTask({ ...newTask, text: e.target.value })}
        />
        
        <select
          className="select select-bordered w-full mb-4"
          value={newTask.department}
          onChange={e => {
            console.log('Выбран отдел:', e.target.value, 'Название:', DepartmentLabels[Number(e.target.value) as Department]);
            setNewTask({ ...newTask, department: Number(e.target.value) as Department });
          }}
        >
          <option disabled value="">Выберите отдел</option>
          {Object.values(Department)
            .filter(v => typeof v === 'number' && v !== Department.Empty)
            .map(dept => {
              console.log('Отдел в списке:', dept, 'Название:', DepartmentLabels[dept as Department]);
              return (
                <option key={dept} value={dept}>{DepartmentLabels[dept as Department]}</option>
              );
            })
          }
        </select>

        {editTask && (
          <div className="text-sm text-gray-500 mb-4">
            {isEdited ? (
              <p>Редактировано: {format(new Date(editTask.updatedAt), 'dd.MM.yyyy HH:mm')}</p>
            ) : (
              <p>Создано: {format(new Date(editTask.createdAt), 'dd.MM.yyyy HH:mm')}</p>
            )}
          </div>
        )}

        <div className="modal-action">
          <button
            className="btn btn-outline"
            onClick={onClose}
          >
            Отмена
          </button>
          <button className="btn btn-primary" onClick={onSave}>
            Сохранить
          </button>
        </div>
      </div>
    </dialog>
  );
}; 