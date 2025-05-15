import { format, isEqual } from 'date-fns';
import type { NewTask, Task, Worker } from '../types';
import { Department, DepartmentLabels } from '../types';
import { MdTitle, MdDescription, MdCategory, MdAccessTime, MdEdit, MdAdd } from 'react-icons/md';

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
    <dialog className={`modal backdrop-blur-sm ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box bg-base-100/90 backdrop-blur-md shadow-2xl border border-base-300/30 rounded-2xl">
        <div className="flex items-center gap-3 mb-6">
          {editTask ? (
            <div className="p-2 bg-primary/20 rounded-lg backdrop-blur-sm">
              <MdEdit className="text-2xl text-primary" />
            </div>
          ) : (
            <div className="p-2 bg-primary/20 rounded-lg backdrop-blur-sm">
              <MdAdd className="text-2xl text-primary" />
            </div>
          )}
          <h3 className="font-bold text-xl">
            {editTask ? 'Редактировать задачу' : 'Новая задача'}
          </h3>
        </div>
        
        <div className="form-control mb-5">
          <label className="label">
            <span className="label-text flex items-center gap-2 text-base-content/80">
              <MdTitle /> Название задачи
            </span>
          </label>
          <input
            className="input input-bordered w-full focus:input-primary rounded-xl bg-base-200/50 backdrop-blur-sm"
            placeholder="Введите название задачи"
            value={newTask.title}
            onChange={e => setNewTask({ ...newTask, title: e.target.value })}
          />
        </div>
        
        <div className="form-control mb-5">
          <label className="label">
            <span className="label-text flex items-center gap-2 text-base-content/80">
              <MdDescription /> Описание
            </span>
          </label>
          <textarea
            className="textarea textarea-bordered w-full h-32 focus:textarea-primary rounded-xl bg-base-200/50 backdrop-blur-sm"
            placeholder="Введите подробное описание задачи"
            value={newTask.text}
            onChange={e => setNewTask({ ...newTask, text: e.target.value })}
          />
        </div>
        
        <div className="form-control mb-5">
          <label className="label">
            <span className="label-text flex items-center gap-2 text-base-content/80">
              <MdCategory /> Отдел
            </span>
          </label>
          <select
            className="select select-bordered w-full focus:select-primary rounded-xl bg-base-200/50 backdrop-blur-sm"
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
        </div>

        {editTask && (
          <div className="bg-base-200/50 backdrop-blur-sm p-4 rounded-xl mb-6">
            <div className="flex items-center gap-2 text-sm">
              <MdAccessTime className="text-primary" />
              {isEdited ? (
                <span>Редактировано: {format(new Date(editTask.updatedAt), 'dd.MM.yyyy HH:mm')}</span>
              ) : (
                <span>Создано: {format(new Date(editTask.createdAt), 'dd.MM.yyyy HH:mm')}</span>
              )}
            </div>
          </div>
        )}

        <div className="modal-action gap-3">
          <button
            className="btn btn-outline rounded-xl hover:bg-base-200/50"
            onClick={onClose}
          >
            Отмена
          </button>
          <button className="btn btn-primary rounded-xl shadow-md hover:shadow-lg transition-all duration-300" onClick={onSave}>
            {editTask ? 'Обновить' : 'Создать'}
          </button>
        </div>
      </div>
    </dialog>
  );
}; 