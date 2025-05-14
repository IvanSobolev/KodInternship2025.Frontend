import { useState } from 'react';

const statuses = ['Нужно сделать', 'В процессе', 'Сделано'];

export default function App() {
  const [tab, setTab] = useState<'tasks' | 'workers'>('tasks');
  const [tasks, setTasks] = useState([
    { id: 1, name: 'Проверить сигнализацию', text: 'Осмотреть панель в здании А', department: 'Охрана', status: 'Нужно сделать' },
    { id: 2, name: 'Установить камеры', text: 'Установка камер в офисе 3', department: 'Монтаж', status: 'В процессе' },
    { id: 3, name: 'Проверка доступа', text: 'Тестирование системы доступа', department: 'ИТ', status: 'Сделано' },
    { id: 4, name: 'Согласование чертежей', text: 'Отправить на утверждение', department: 'Проектировщики', status: 'Нужно сделать' }
  ]);

  const [workers, setWorkers] = useState([
    { id: 1, name: 'Иван Петров', telegram: 'ivan_fire', department: 'Охрана' },
    { id: 2, name: 'Анна Смирнова', telegram: 'smirnova_cam', department: 'Монтаж' },
    { id: 3, name: 'Дмитрий Волков', telegram: 'volkov_it', department: 'ИТ' },
    { id: 4, name: 'Елена Кузнецова', telegram: 'kuzn_arch', department: 'Проектировщики' }
  ]);

  const [filterStatus, setFilterStatus] = useState('');
  const [filterWorker, setFilterWorker] = useState('');

  const [newTask, setNewTask] = useState({ name: '', text: '', department: '', status: 'Нужно сделать' });
  const [newWorker, setNewWorker] = useState({ name: '', telegram: '', department: '' });

  const addTask = () => {
    setTasks([...tasks, { ...newTask, id: Date.now() }]);
    setNewTask({ name: '', text: '', department: '', status: 'Нужно сделать' });
  };

  const addWorker = () => {
    setWorkers([...workers, { ...newWorker, id: Date.now() }]);
    setNewWorker({ name: '', telegram: '', department: '' });
  };

  const updateTaskStatus = (id, status) => {
    setTasks(tasks.map(t => (t.id === id ? { ...t, status } : t)));
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const filteredTasks = tasks.filter(task =>
    (filterStatus ? task.status === filterStatus : true) &&
    (filterWorker ? workers.find(w => w.name === filterWorker && w.department === task.department) : true)
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div role="tablist" className="tabs tabs-boxed mb-6">
        <a role="tab" className={`tab ${tab === 'tasks' ? 'tab-active' : ''}`} onClick={() => setTab('tasks')}>Задачи</a>
        <a role="tab" className={`tab ${tab === 'workers' ? 'tab-active' : ''}`} onClick={() => setTab('workers')}>Работники</a>
      </div>

      {tab === 'tasks' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <input className="input input-bordered w-full" placeholder="Название" value={newTask.name} onChange={e => setNewTask({ ...newTask, name: e.target.value })} />
            <input className="input input-bordered w-full" placeholder="Текст" value={newTask.text} onChange={e => setNewTask({ ...newTask, text: e.target.value })} />
            <input className="input input-bordered w-full" placeholder="Отдел" value={newTask.department} onChange={e => setNewTask({ ...newTask, department: e.target.value })} />
            <select className="select select-bordered w-full" value={newTask.status} onChange={e => setNewTask({ ...newTask, status: e.target.value })}>
              {statuses.map(s => <option key={s}>{s}</option>)}
            </select>
            <button className="btn btn-primary col-span-full" onClick={addTask}>Добавить задачу</button>
          </div>


          <div className="flex gap-4 mb-6">
            <select className="select select-bordered" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="">Все статусы</option>
              {statuses.map(s => <option key={s}>{s}</option>)}
            </select>
            <select className="select select-bordered" value={filterWorker} onChange={e => setFilterWorker(e.target.value)}>
              <option value="">Все работники</option>
              {workers.map(w => <option key={w.id}>{w.name}</option>)}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredTasks.map(task => (
              <div key={task.id} className="card shadow-xl bg-base-100 border">
                <div className="card-body">
                  <h2 className="card-title text-lg">{task.name}</h2>
                  <p className="text-sm text-gray-600">{task.text}</p>
                  <div className="mt-2 flex gap-2 items-center">
                    <span className="badge badge-info">{task.department}</span>
                    <select className="select select-sm ml-auto" value={task.status} onChange={e => updateTaskStatus(task.id, e.target.value)}>
                      {statuses.map(s => <option key={s}>{s}</option>)}
                    </select>
                    <button className="btn btn-xs btn-error" onClick={() => removeTask(task.id)}>✕</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'workers' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <input className="input input-bordered w-full" placeholder="ФИО" value={newWorker.name} onChange={e => setNewWorker({ ...newWorker, name: e.target.value })} />
            <input className="input input-bordered w-full" placeholder="Telegram" value={newWorker.telegram} onChange={e => setNewWorker({ ...newWorker, telegram: e.target.value })} />
            <input className="input input-bordered w-full" placeholder="Отдел" value={newWorker.department} onChange={e => setNewWorker({ ...newWorker, department: e.target.value })} />
            <button className="btn btn-secondary col-span-full" onClick={addWorker}>Добавить работника</button>
          </div>

          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {workers.map(w => (
              <div key={w.id} className="card shadow-xl bg-base-100 border">
                <div className="card-body">
                  <h2 className="card-title text-lg">{w.name}</h2>
                  <p className="text-sm text-gray-500">@{w.telegram}</p>
                  <div className="badge badge-info mt-2">{w.department}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}