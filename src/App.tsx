import { useState } from 'react';
import { MdAdd, MdClose, MdSearch, MdCheck, MdDelete } from 'react-icons/md';

export default function App() {
  const [tab, setTab] = useState<'tasks' | 'workers'>('tasks');

  const [tasks, setTasks] = useState([
    { id: 1, name: 'Проверить сигнализацию', text: 'Осмотреть панель в здании А', department: 'Охрана', status: 'Нужно сделать' },
    { id: 2, name: 'Установить камеры', text: 'Установка камер в офисе 3', department: 'Монтаж', status: 'В процессе' },
    { id: 3, name: 'Проверка доступа', text: 'Тестирование системы доступа', department: 'ИТ', status: 'Сделано' },
    { id: 4, name: 'Согласование чертежей', text: 'Отправить на утверждение', department: 'Проектировщики', status: 'На проверке' }
  ]);

  const [workers, setWorkers] = useState([
    { id: 1, name: 'Иван Петров', telegram: 'ivan_fire', department: 'Охрана' },
    { id: 2, name: 'Анна Смирнова', telegram: 'smirnova_cam', department: 'Монтаж' },
    { id: 3, name: 'Дмитрий Волков', telegram: 'volkov_it', department: 'ИТ' },
    { id: 4, name: 'Елена Кузнецова', telegram: 'kuzn_arch', department: 'Проектировщики' }
  ]);

  const [filterStatus, setFilterStatus] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');

  const [newTask, setNewTask] = useState({ name: '', text: '', department: '', status: 'Нужно сделать' });
  const [newWorker, setNewWorker] = useState({ name: '', telegram: '', department: '' });

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showWorkerModal, setShowWorkerModal] = useState(false);

  const addTask = () => {
    setTasks([...tasks, { ...newTask, id: Date.now() }]);
    setNewTask({ name: '', text: '', department: '', status: 'Нужно сделать' });
    setShowTaskModal(false);
  };

  const addWorker = () => {
    setWorkers([...workers, { ...newWorker, id: Date.now() }]);
    setNewWorker({ name: '', telegram: '', department: '' });
    setShowWorkerModal(false);
  };

  const updateTaskStatus = (id, status) => {
    setTasks(tasks.map(t => (t.id === id ? { ...t, status } : t)));
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const filteredTasks = tasks.filter(task =>
    (filterStatus ? task.status === filterStatus : true) &&
    (filterDepartment ? task.department.toLowerCase().includes(filterDepartment.toLowerCase()) : true)
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div role="tablist" className="tabs tabs-boxed mb-6">
        <a role="tab" className={`tab ${tab === 'tasks' ? 'tab-active' : ''}`} onClick={() => setTab('tasks')}>Задачи</a>
        <a role="tab" className={`tab ${tab === 'workers' ? 'tab-active' : ''}`} onClick={() => setTab('workers')}>Работники</a>
      </div>

      <div className={`${tab === 'tasks' ? '' : 'hidden'}`}>
        <div className="flex justify-between mb-6">
        <div className="relative z-0">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
            <input
              type="text"
              className="input input-bordered pl-10"
              placeholder="Поиск отдела"
              value={filterDepartment}
              onChange={e => setFilterDepartment(e.target.value)}
            />
          </div>

          <button className="btn btn-primary flex items-center gap-2" onClick={() => setShowTaskModal(true)}>
            <MdAdd size={20} /> Добавить задачу
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map(task => (
            <div key={task.id} className="card shadow-xl border bg-base-100">
              <div className="card-body relative">
                <button
                  className="absolute top-2 right-2 text-error"
                  onClick={() => removeTask(task.id)}
                >
                  <MdDelete size={20} />
                </button>

                <h2 className="card-title text-lg">{task.name}</h2>
                <p className="text-sm text-gray-400">{task.text}</p>
                <div className="mt-2 flex gap-2 items-center">
                  <span className="badge bg-[#605dff] text-white">{task.department}</span>
                  <span className={`badge ml-auto ${task.status === 'Сделано' ? 'badge-success' : task.status === 'На проверке' ? 'badge-info' : 'badge-warning'}`}>
                    {task.status}
                  </span>

                  {task.status === 'На проверке' && (
                    <>
                      <button className="btn btn-xs btn-success ml-2" onClick={() => updateTaskStatus(task.id, 'Сделано')}>
                        <MdCheck size={16} />
                      </button>
                      <button className="btn btn-xs btn-warning ml-1" onClick={() => updateTaskStatus(task.id, 'В процессе')}>
                        <MdClose size={16} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`${tab === 'workers' ? '' : 'hidden'}`}>
        <button className="btn btn-primary mb-6 flex items-center gap-2" onClick={() => setShowWorkerModal(true)}>
          <MdAdd size={20} /> Добавить работника
        </button>

        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {workers.map(w => (
            <div key={w.id} className="card shadow-xl border bg-base-100">
              <div className="card-body">
                <h2 className="card-title text-lg">{w.name}</h2>
                <p className="text-sm text-gray-400">@{w.telegram}</p>
                <div className="badge bg-[#605dff] mt-2">{w.department}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Модалка задачи */}
      <dialog className={`modal ${showTaskModal ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Новая задача</h3>
          <input className="input input-bordered w-full mb-2" placeholder="Название" value={newTask.name} onChange={e => setNewTask({ ...newTask, name: e.target.value })} />
          <input className="input input-bordered w-full mb-2" placeholder="Текст" value={newTask.text} onChange={e => setNewTask({ ...newTask, text: e.target.value })} />
          <input className="input input-bordered w-full mb-4" placeholder="Отдел" value={newTask.department} onChange={e => setNewTask({ ...newTask, department: e.target.value })} />
          <div className="modal-action">
            <button className="btn btn-outline" onClick={() => setShowTaskModal(false)}>Отмена</button>
            <button className="btn btn-primary" onClick={addTask}>Сохранить</button>
          </div>
        </div>
      </dialog>

      {/* Модалка работника */}
      <dialog className={`modal ${showWorkerModal ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Новый работник</h3>
          <input className="input input-bordered w-full mb-2" placeholder="ФИО" value={newWorker.name} onChange={e => setNewWorker({ ...newWorker, name: e.target.value })} />
          <input className="input input-bordered w-full mb-2" placeholder="Telegram" value={newWorker.telegram} onChange={e => setNewWorker({ ...newWorker, telegram: e.target.value })} />
          <input className="input input-bordered w-full mb-4" placeholder="Отдел" value={newWorker.department} onChange={e => setNewWorker({ ...newWorker, department: e.target.value })} />
          <div className="modal-action">
            <button className="btn btn-outline" onClick={() => setShowWorkerModal(false)}>Отмена</button>
            <button className="btn btn-primary" onClick={addWorker}>Сохранить</button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
