import { useTaskManager } from "./hooks/useTaskManager";
import { MdAdd, MdClose, MdSearch, MdCheck, MdDelete } from 'react-icons/md';
import { RiPencilFill } from 'react-icons/ri';
import { AnimatePresence, motion } from 'framer-motion';

export default function App() {
  const {
    tab,
    setTab,
    filteredTasks,
    newTask,
    setNewTask,
    showTaskModal,
    setShowTaskModal,
    addTask,
    updateTaskStatus,
    removeTask,
    workers,
    newWorker,
    setNewWorker,
    showWorkerModal,
    setShowWorkerModal,
    addWorker,
    filterDepartment,
    setFilterDepartment,
    editingTaskId,
    setEditingTaskId,
    selectedTask,
    setSelectedTask
  } = useTaskManager();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div role="tablist" className="tabs tabs-boxed mb-6">
        <a role="tab" className={`tab ${tab === 'tasks' ? 'tab-active' : ''}`} onClick={() => setTab('tasks')}>Задачи</a>
        <a role="tab" className={`tab ${tab === 'workers' ? 'tab-active' : ''}`} onClick={() => setTab('workers')}>Работники</a>
      </div>

      <AnimatePresence mode="wait">
        {tab === 'tasks' && (
          <motion.div
            key="tasks"
            initial={{ opacity: 0, x: -30, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 30, scale: 0.98 }}
            transition={{
              duration: 0.4,
              ease: [0.25, 0.1, 0.25, 1]
            }}
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <div className="relative z-0 w-full sm:max-w-xs">
                <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
                <input
                  type="text"
                  className="input input-bordered pl-10 w-full"
                  placeholder="Поиск отдела"
                  value={filterDepartment}
                  onChange={e => setFilterDepartment(e.target.value)}
                />
              </div>
              <button className="btn btn-primary flex items-center justify-center gap-2 w-full sm:w-auto" onClick={() => { setNewTask({ name: '', text: '', department: '', assignee: '' }); setEditingTaskId(null); setShowTaskModal(true); }}>
                <MdAdd size={20} /> <span className="hidden sm:inline">Добавить задачу</span>
              </button>
            </div>

            <div className="flex flex-col border rounded-lg overflow-hidden">
              <div className="flex bg-base-200 font-semibold px-4 py-2">
                <div className="w-5/12">ID / Название</div>
                <div className="w-2/12">Отдел</div>
                <div className="w-2/12">Исполнитель</div>
                <div className="w-2/12">Статус</div>
                <div className="w-2/12 text-right">Действия</div>
              </div>

              {filteredTasks.map(task => (
                <div key={task.id} className="flex items-center border-t px-4 py-3 hover:bg-base-100 transition">
                  <div className="w-5/12">
                    <span className="mr-2">{task.id}</span>
                    <button 
                      className="text-blue-500"
                      onClick={() => setSelectedTask(task)}
                    >
                      {task.name}
                    </button>
                  </div>
                  <div className="w-2/12">{task.department}</div>
                  <div className="w-2/12">{task.assignee || '-'}</div>
                  <div className="w-2/12">
                    <span className={`badge ${task.status === 'Сделано' ? 'badge-success' : task.status === 'На проверке' ? 'badge-info' : 'badge-warning'}`}>
                      {task.status}
                    </span>
                  </div>
                  <div className="w-2/12 flex justify-end gap-2 items-center flex-wrap">
                    {task.status === 'Нужно сделать' && (
                      <button className="btn btn-xs btn-outline" onClick={() => {
                        setNewTask({ name: task.name, text: task.text, department: task.department, assignee: task.assignee });
                        setEditingTaskId(task.id);
                        setShowTaskModal(true);
                      }}>
                        <RiPencilFill size={16} />
                      </button>
                    )}
                    {task.status === 'На проверке' && (
                      <>
                        <button className="btn btn-xs btn-success" onClick={() => updateTaskStatus(task.id, 'Сделано')}>
                          <MdCheck size={16} />
                        </button>
                        <button className="btn btn-xs btn-warning" onClick={() => updateTaskStatus(task.id, 'В процессе')}>
                          <MdClose size={16} />
                        </button>
                      </>
                    )}
                    <button className="btn btn-xs btn-error" onClick={() => removeTask(task.id)}>
                      <MdDelete size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {tab === 'workers' && (
          <motion.div
            key="workers"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3 }}
          >
            <button className="btn btn-primary mb-6 flex items-center gap-2 w-full sm:w-auto" onClick={() => setShowWorkerModal(true)}>
              <MdAdd size={20} /> <span className="hidden sm:inline">Добавить работника</span>
            </button>

            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {workers.map(w => (
                <div key={w.id} className="card shadow-xl border border-gray-200 dark:border-gray-700 bg-base-100">
                  <div className="card-body">
                    <h2 className="card-title text-lg">{w.name}</h2>
                    <p className="text-sm text-gray-400">@{w.telegram}</p>
                    <div className="badge bg-[#605dff] mt-2">{w.department}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <dialog className={`modal ${showTaskModal ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">{editingTaskId ? 'Редактировать задачу' : 'Новая задача'}</h3>
          <input 
            className="input input-bordered w-full mb-2" 
            placeholder="Название" 
            value={newTask.name} 
            onChange={e => setNewTask({ ...newTask, name: e.target.value })} 
          />
          <textarea 
            className="textarea textarea-bordered w-full mb-2" 
            placeholder="Описание" 
            value={newTask.text} 
            onChange={e => setNewTask({ ...newTask, text: e.target.value })} 
          />
          <input 
            className="input input-bordered w-full mb-2" 
            placeholder="Отдел" 
            value={newTask.department} 
            onChange={e => setNewTask({ ...newTask, department: e.target.value })} 
          />
          <select 
            className="select select-bordered w-full mb-4"
            value={newTask.assignee || ''}
            onChange={e => setNewTask({ ...newTask, assignee: e.target.value })}
          >
            <option value="">Выберите исполнителя</option>
            {workers.map(worker => (
              <option key={worker.id} value={worker.name}>{worker.name}</option>
            ))}
          </select>
          <div className="modal-action">
            <button 
              className="btn btn-outline" 
              onClick={() => { 
                setShowTaskModal(false); 
                setEditingTaskId(null); 
                setNewTask({ name: '', text: '', department: '', assignee: '' }); 
              }}
            >
              Отмена
            </button>
            <button className="btn btn-primary" onClick={addTask}>Сохранить</button>
          </div>
        </div>
      </dialog>

      <dialog className={`modal ${selectedTask ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">{selectedTask?.name}</h3>
          <p className="mb-4">{selectedTask?.text}</p>
          <div className="modal-action">
            <button 
              className="btn btn-outline" 
              onClick={() => setSelectedTask(null)}
            >
              Закрыть
            </button>
          </div>
        </div>
      </dialog>

      <dialog className={`modal ${showWorkerModal ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-4">Новый работник</h3>
          <input 
            className="input input-bordered w-full mb-2" 
            placeholder="ФИО" 
            value={newWorker.name} 
            onChange={e => setNewWorker({ ...newWorker, name: e.target.value })} 
          />
          <input 
            className="input input-bordered w-full mb-2" 
            placeholder="Telegram" 
            value={newWorker.telegram} 
            onChange={e => setNewWorker({ ...newWorker, telegram: e.target.value })} 
          />
          <input 
            className="input input-bordered w-full mb-4" 
            placeholder="Отдел" 
            value={newWorker.department} 
            onChange={e => setNewWorker({ ...newWorker, department: e.target.value })} 
          />
          <div className="modal-action">
            <button className="btn btn-outline" onClick={() => setShowWorkerModal(false)}>Отмена</button>
            <button className="btn btn-primary" onClick={addWorker}>Сохранить</button>
          </div>
        </div>
      </dialog>
    </div>
  );
}