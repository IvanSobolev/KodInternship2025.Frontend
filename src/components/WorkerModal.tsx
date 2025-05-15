import type { NewWorker, Worker } from '../types';
import { Department, DepartmentLabels } from '../types';
import { MdPerson, MdCategory, MdOutlineBadge, MdAlternateEmail, MdEdit, MdAdd } from 'react-icons/md';
import { useEffect } from 'react';

interface WorkerModalProps {
  isOpen: boolean;
  newWorker: NewWorker;
  setNewWorker: (worker: NewWorker) => void;
  editWorker: Worker | null;
  onSave: () => void;
  onClose: () => void;
}

export const WorkerModal = ({
  isOpen,
  newWorker,
  setNewWorker,
  editWorker,
  onSave,
  onClose
}: WorkerModalProps) => {
  // Устанавливаем Frontend по умолчанию при открытии модального окна
  useEffect(() => {
    if (isOpen && newWorker.department === Department.Empty) {
      // Если отдел пустой, устанавливаем Frontend (независимо от того, редактируем или создаем)
      setNewWorker({
        ...newWorker,
        department: Department.Frontend
      });
    }
  }, [isOpen, newWorker, setNewWorker]);

  return (
    <dialog className={`modal backdrop-blur-sm ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box bg-base-100/90 backdrop-blur-md shadow-2xl border border-base-300/30 rounded-2xl">
        <div className="flex items-center gap-3 mb-6">
          {editWorker ? (
            <div className="p-2 bg-primary/20 rounded-lg backdrop-blur-sm">
              <MdEdit className="text-2xl text-primary" />
            </div>
          ) : (
            <div className="p-2 bg-primary/20 rounded-lg backdrop-blur-sm">
              <MdAdd className="text-2xl text-primary" />
            </div>
          )}
          <h3 className="font-bold text-xl">
            {editWorker ? 'Редактировать работника' : 'Новый работник'}
          </h3>
        </div>
        
        <div className="form-control mb-5">
          <label className="label">
            <span className="label-text flex items-center gap-2 text-base-content/80">
              <MdPerson /> ФИО
            </span>
          </label>
          <input
            className="input input-bordered w-full focus:input-primary rounded-xl bg-base-200/50 backdrop-blur-sm"
            placeholder="Введите полное имя"
            value={newWorker.fullName}
            onChange={e => setNewWorker({ ...newWorker, fullName: e.target.value })}
          />
        </div>
        
        {!editWorker && (
          <>
            <div className="form-control mb-5">
              <label className="label">
                <span className="label-text flex items-center gap-2 text-base-content/80">
                  <MdOutlineBadge /> Telegram ID
                </span>
              </label>
              <input
                className="input input-bordered w-full focus:input-primary rounded-xl bg-base-200/50 backdrop-blur-sm"
                placeholder="Введите ID пользователя в Telegram"
                type="number"
                value={newWorker.telegramId || ''}
                onChange={e => setNewWorker({ ...newWorker, telegramId: Number(e.target.value) })}
              />
            </div>
            
            <div className="form-control mb-5">
              <label className="label">
                <span className="label-text flex items-center gap-2 text-base-content/80">
                  <MdAlternateEmail /> Telegram username
                </span>
              </label>
              <div className="input-group rounded-xl overflow-hidden bg-base-200/50 backdrop-blur-sm">
                <span className="bg-base-300/50 backdrop-blur-sm">@</span>
                <input
                  className="input w-full focus:input-primary bg-transparent"
                  placeholder="username"
                  value={newWorker.telegramUsername}
                  onChange={e => setNewWorker({ ...newWorker, telegramUsername: e.target.value })}
                />
              </div>
            </div>
          </>
        )}
        
        <div className="form-control mb-5">
          <label className="label">
            <span className="label-text flex items-center gap-2 text-base-content/80">
              <MdCategory /> Отдел
            </span>
          </label>
          <select
            className="select select-bordered w-full focus:select-primary rounded-xl bg-base-200/50 backdrop-blur-sm"
            value={newWorker.department}
            onChange={e => {
              // Явно преобразуем строку в число
              const departmentValue = parseInt(e.target.value, 10);
              console.log('Выбран отдел:', departmentValue, 'Название:', DepartmentLabels[departmentValue as Department]);
              
              // Обновляем состояние с числовым значением
              setNewWorker({ 
                ...newWorker, 
                department: departmentValue as Department 
              });
            }}
          >
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
        
        <div className="modal-action gap-3">
          <button className="btn btn-outline rounded-xl hover:bg-base-200/50" onClick={onClose}>
            Отмена
          </button>
          <button className="btn btn-primary rounded-xl shadow-md hover:shadow-lg transition-all duration-300" onClick={onSave}>
            {editWorker ? 'Обновить' : 'Создать'}
          </button>
        </div>
      </div>
    </dialog>
  ); 
}; 