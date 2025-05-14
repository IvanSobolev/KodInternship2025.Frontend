import type { NewWorker, Worker } from '../types';
import { Department, DepartmentLabels } from '../types';

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
  return (
    <dialog className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">
          {editWorker ? 'Редактировать работника' : 'Новый работник'}
        </h3>
        <input
          className="input input-bordered w-full mb-2"
          placeholder="ФИО"
          value={newWorker.fullName}
          onChange={e => setNewWorker({ ...newWorker, fullName: e.target.value })}
        />
        {!editWorker && (
          <>
            <input
              className="input input-bordered w-full mb-2"
              placeholder="Telegram ID"
              type="number"
              value={newWorker.telegramId || ''}
              onChange={e => setNewWorker({ ...newWorker, telegramId: Number(e.target.value) })}
            />
            <input
              className="input input-bordered w-full mb-2"
              placeholder="Telegram username"
              value={newWorker.telegramUsername}
              onChange={e => setNewWorker({ ...newWorker, telegramUsername: e.target.value })}
            />
          </>
        )}
        <select
          className="select select-bordered w-full mb-4"
          value={newWorker.department}
          onChange={e => {
            console.log('Выбран отдел:', e.target.value, 'Название:', DepartmentLabels[Number(e.target.value) as Department]);
            setNewWorker({ ...newWorker, department: Number(e.target.value) as Department });
          }}
        >
          <option disabled value="">Выберите отдел</option>
          {Object.values(Department)
            .filter(v => typeof v === 'number' && v !== Department.Empty)
            .map(dept => (
              <option key={dept} value={dept}>{DepartmentLabels[dept as Department]}</option>
            ))
          }
        </select>
        <div className="modal-action">
          <button className="btn btn-outline" onClick={onClose}>
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