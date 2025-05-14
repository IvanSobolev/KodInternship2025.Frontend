// src/App.js
import { useTaskManager } from "./hooks/useTaskManager";
import { format } from 'date-fns';
import {
  MdAdd,
  MdSearch,
  MdCheck,
  MdDelete,
  MdClose,
  MdCheckCircle,
  MdHourglassEmpty,
  MdOutlineRemoveCircle,
  MdRadioButtonUnchecked
} from 'react-icons/md';
import { RiPencilFill } from 'react-icons/ri';
import { AnimatePresence, motion } from 'framer-motion';

export default function App() {
  const {
    tab,
    setTab,

    // для таблицы и фильтров
    filteredTasks,
    filterStatus,
    setFilterStatus,
    filterDepartment,
    setFilterDepartment,

    // для работы с задачами
    tasks,
    newTask,
    setNewTask,
    showTaskModal,
    setShowTaskModal,
    addTask,
    updateTaskStatus,
    removeTask,
    editingTaskId,
    setEditingTaskId,

    // для просмотра одной задачи
    selectedTask,
    setSelectedTask,

    // для работников
    workers,
    newWorker,
    setNewWorker,
    showWorkerModal,
    setShowWorkerModal,
    addWorker,
  } = useTaskManager();

  const statuses = ['Нужно сделать', 'В процессе', 'На проверке', 'Сделано'];

  // для вывода даты при редактировании
  const editTask = editingTaskId != null
    ? tasks.find(t => t.id === editingTaskId)
    : null;

  const animationProps = {
    initial: { opacity: 0, x: -30, scale: 0.98 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit:    { opacity: 0, x: 30, scale: 0.98 },
    transition: { duration: 0.4 }
  };

  const animationPropsWorkers = {
    initial: { opacity: 0, x: 10 },
    animate: { opacity: 1, x: 0 },
    exit:    { opacity: 0, x: -10 },
    transition: { duration: 0.3 }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Вкладки */}
      <div role="tablist" className="tabs tabs-boxed mb-6">
        <a
          role="tab"
          className={`tab ${tab === 'tasks' ? 'tab-active' : ''}`}
          onClick={() => setTab('tasks')}
        >
          Задачи
        </a>
        <a
          role="tab"
          className={`tab ${tab === 'workers' ? 'tab-active' : ''}`}
          onClick={() => setTab('workers')}
        >
          Работники
        </a>
      </div>

      <AnimatePresence mode="wait">
        {/* --- Задачи --- */}
        {tab === 'tasks' && (
          <motion.div key="tasks" {...animationProps}>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
              <div className="flex gap-4 w-full sm:max-w-lg">
                <div className="relative flex-1">
                  <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
                <input
                  type="text"
                  className="input input-bordered pl-10 w-full"
                  placeholder="Поиск отдела"
                  value={filterDepartment}
                  onChange={e => setFilterDepartment(e.target.value)}
                />
                </div>
                <select
                  className="select select-bordered"
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                >
                  <option value="">Все статусы</option>
                  {statuses.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <button
                className="btn btn-primary flex items-center gap-2 w-full sm:w-auto"
                onClick={() => {
                  setNewTask({ name: '', text: '', department: '', assignee: '', status: 'Нужно сделать' });
                  setEditingTaskId(null);
                  setShowTaskModal(true);
                }}
              >
                <MdAdd size={20} /> <span className="hidden sm:inline">Добавить задачу</span>
              </button>
            </div>

            <div className="overflow-x-auto border rounded-lg">
              <table className="table w-full">
                <thead className="bg-base-200">
                  <tr>
                    <th>ID / Название</th>
                    <th>Отдел</th>
                    <th>Исполнитель</th>
                    <th className="text-center">Статус</th>
                    <th className="text-right">Действия</th>
                  </tr>
                </thead>
<tbody>
  {filteredTasks.map(task => (
    <tr key={task.id} className="hover:bg-base-100">
      <td className="px-4 py-3">
        <span className="mr-2">{task.id}</span>
        <button
          className="text-blue-500"
          onClick={() => setSelectedTask(task)}
        >
          {task.name}
        </button>
      </td>
      <td className="px-4 py-3">{task.department}</td>
      <td className="px-4 py-3">{task.assignee || '-'}</td>
      <td className="px-4 py-3 flex items-center justify-center">
        {task.status === 'Нужно сделать' && (
          <MdRadioButtonUnchecked size={20} className="text-gray-400" />
        )}
        {task.status === 'В процессе' && (
          <MdOutlineRemoveCircle size={20} className="text-yellow-500" />
        )}
        {task.status === 'На проверке' && (
          <MdHourglassEmpty size={20} className="text-blue-500" />
        )}
        {task.status === 'Сделано' && (
          <MdCheckCircle size={20} className="text-green-500" />
        )}
      </td>
      <td className="px-4 py-3 text-right whitespace-nowrap">
        {task.status === 'Нужно сделать' && (
          <button
            className="btn btn-xs btn-outline mr-1"
            onClick={() => {
              setNewTask({
                name: task.name,
                text: task.text,
                department: task.department,
                assignee: task.assignee,
                status: task.status
              });
              setEditingTaskId(task.id);
              setShowTaskModal(true);
            }}
          >
            <RiPencilFill size={16} />
          </button>
        )}
        {task.status === 'На проверке' && (
          <>
            <button
              className="btn btn-xs btn-success mr-1"
              onClick={() => updateTaskStatus(task.id, 'Сделано')}
            >
              <MdCheck size={16} />
            </button>
            <button
              className="btn btn-xs btn-warning mr-1"
              onClick={() => updateTaskStatus(task.id, 'В процессе')}
            >
              <MdClose size={16} />
            </button>
          </>
        )}
        <button
          className="btn btn-xs btn-error"
          onClick={() => removeTask(task.id)}
        >
          <MdDelete size={16} />
        </button>
      </td>
    </tr>
  ))}
</tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* --- Работники --- */}
        {tab === 'workers' && (
          <motion.div key="workers" {...animationPropsWorkers}>
            <button
              className="btn btn-primary mb-6 flex items-center gap-2 w-full sm:w-auto"
              onClick={() => setShowWorkerModal(true)}
            >
              <MdAdd size={20} /> <span className="hidden sm:inline">Добавить работника</span>
            </button>
            <div className="overflow-x-auto border rounded-lg">
              <table className="table w-full">
                <thead className="bg-base-200">
                  <tr>
                    <th>ID</th>
                    <th>ФИО</th>
                    <th>Telegram</th>
                    <th>Отдел</th>
                  </tr>
                </thead>
                <tbody>
                  {workers.map(w => (
                    <tr key={w.id} className="hover:bg-base-100">
                      <td className="px-4 py-3">{w.id}</td>
                      <td className="px-4 py-3">{w.name}</td>
                      <td className="px-4 py-3">@{w.telegram}</td>
                      <td className="px-4 py-3">{w.department}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Модалка создания/редактирования задачи --- */}
      <dialog className={`modal ${showTaskModal ? 'modal-open' : ''}`}>
        <div className="modal-box">
          <h3 className="font-bold text-lg mb-2">
            {editingTaskId ? 'Редактировать задачу' : 'Новая задача'}
          </h3>
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
            {workers.map(w => (
              <option key={w.id} value={w.name}>{w.name}</option>
            ))}
          </select>

          {/* Даты создания/редактирования */}
          {editTask && (
            <p className="text-sm text-gray-500 mb-4">
              Создано: {format(editTask.createdAt, 'dd.MM.yyyy HH:mm')}
              {editTask.updatedAt && (
                <> | Редактировано: {format(editTask.updatedAt, 'dd.MM.yyyy HH:mm')}</>
              )}
            </p>
          )}

          <div className="modal-action">
            <button
              className="btn btn-outline"
              onClick={() => {
                setShowTaskModal(false);
                setEditingTaskId(null);
                setNewTask({ name: '', text: '', department: '', assignee: '', status: 'Нужно сделать' });
              }}
            >
              Отмена
            </button>
            <button className="btn btn-primary" onClick={addTask}>
              Сохранить
            </button>
          </div>
        </div>
      </dialog>

      {/* --- Модалка просмотра задачи --- */}
      <dialog className={`modal ${selectedTask ? 'modal-open' : ''}`}>
        {selectedTask && (
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-2">{selectedTask.name}</h3>
            <p className="mb-2">{selectedTask.text}</p>
            <p className="text-sm text-gray-500 mb-4">
              Создано: {format(selectedTask.createdAt, 'dd.MM.yyyy HH:mm')}
              {selectedTask.updatedAt && (
                <> | Редактировано: {format(selectedTask.updatedAt, 'dd.MM.yyyy HH:mm')}</>
              )}
            </p>
            <div className="modal-action">
              <button
                className="btn btn-outline"
                onClick={() => setSelectedTask(null)}
              >
                Закрыть
              </button>
            </div>
          </div>
        )}
      </dialog>


      {/* --- Модалка добавления работника --- */}
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
            <button className="btn btn-outline" onClick={() => setShowWorkerModal(false)}>
              Отмена
            </button>
            <button className="btn btn-primary" onClick={addWorker}>
              Сохранить
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
