import type { Task } from '../types';
import { TaskStatus, TaskStatusLabels, Department, DepartmentLabels } from '../types';
import { motion } from 'framer-motion';
import {
  MdAdd,
  MdSearch,
  MdCheck,
  MdDelete,
  MdClose,
  MdCheckCircle,
  MdHourglassEmpty,
  MdOutlineRemoveCircle,
  MdRadioButtonUnchecked,
  MdError,
  MdFilterList,
  MdPerson,
  MdCategory,
  MdSort,
  MdFilterAlt
} from 'react-icons/md';
import { RiPencilFill } from 'react-icons/ri';

interface TaskListProps {
  filteredTasks: Task[];
  filterStatus: TaskStatus | null;
  setFilterStatus: (status: TaskStatus | null) => void;
  filterDepartment: string;
  setFilterDepartment: (department: string) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  removeTask: (id: string) => void;
  onAddNewTask: () => void;
  onEditTask: (task: Task) => void;
  onViewTaskDetails: (task: Task) => void;
  isLoading?: boolean;
  error?: string | null;
  workers: any[]; // Добавляем доступ к списку работников
}

export const TaskList = ({
  filteredTasks,
  filterStatus,
  setFilterStatus,
  filterDepartment,
  setFilterDepartment,
  updateTaskStatus,
  removeTask,
  onAddNewTask,
  onEditTask,
  onViewTaskDetails,
  isLoading = false,
  error = null,
  workers = []
}: TaskListProps) => {
  const animationProps = {
    initial: { opacity: 0, x: -30, scale: 0.98 },
    animate: { opacity: 1, x: 0, scale: 1 },
    exit:    { opacity: 0, x: 30, scale: 0.98 },
    transition: { duration: 0.4 }
  };

  // Функция для получения названия отдела из перечисления
  const getDepartmentName = (department: Department | string): string => {
    if (typeof department === 'number') {
      return DepartmentLabels[department as Department] || String(department);
    }
    return String(department);
  };
  
  // Функция для отображения статуса задачи
  const getStatusIcon = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.ToDo:
        return <MdRadioButtonUnchecked size={20} className="text-gray-400" />;
      case TaskStatus.InProgress:
        return <MdOutlineRemoveCircle size={20} className="text-yellow-500" />;
      case TaskStatus.OnReview:
        return (
          <div className="animate-pulse">
            <MdHourglassEmpty size={20} className="text-accent" />
          </div>
        );
      case TaskStatus.Done:
        return <MdCheckCircle size={20} className="text-green-500" />;
      default:
        return null;
    }
  };

  // Функция для получения ФИО работника по его ID
  const getWorkerName = (task: Task): string => {
    if (!task.assignedWorkerId) return "Не назначен";
    
    // Если есть имя в самой задаче, используем его
    if (task.assignedWorkerName) return task.assignedWorkerName;
    
    // Иначе ищем среди списка работников
    const worker = workers.find(w => w.telegramId === task.assignedWorkerId);
    return worker ? worker.fullName : "Не найден";
  };
  
  return (
    <motion.div key="tasks" {...animationProps}>
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-primary/20 backdrop-blur-sm">
              <MdSort className="text-2xl text-primary" />
            </span>
            Список задач
          </h2>
          <button
            className="btn btn-primary btn-md gap-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            onClick={onAddNewTask}
            disabled={isLoading}
          >
            <MdAdd size={20} /> <span>Добавить задачу</span>
          </button>
        </div>
        
        <div className="bg-base-200/70 backdrop-blur-sm p-5 rounded-xl shadow-md mb-8">
          <div className="text-sm font-medium mb-3 flex items-center gap-2">
            <MdFilterAlt className="text-primary" /> Фильтры
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="relative">
                <MdFilterList className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
                <select
                  className="select select-bordered w-full pl-10 rounded-xl bg-base-100/70 backdrop-blur-sm focus:bg-base-100"
                  value={filterDepartment}
                  onChange={e => {
                    console.log('Выбран фильтр отдела:', e.target.value);
                    setFilterDepartment(e.target.value);
                  }}
                  disabled={isLoading}
                >
                  <option value="">Все отделы</option>
                  {Object.entries(DepartmentLabels)
                    .filter(([deptId]) => Number(deptId) !== Department.Empty)
                    .map(([deptId, deptName]) => {
                      console.log('Отдел в списке фильтров:', deptId, deptName);
                      return (
                        <option key={deptId} value={deptName}>
                          {deptName}
                        </option>
                      );
                    })
                  }
                </select>
              </div>
            </div>
            <div className="relative">
              <MdFilterList className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
              <select
                className="select select-bordered pl-10 w-full rounded-xl bg-base-100/70 backdrop-blur-sm focus:bg-base-100"
                value={filterStatus === null ? '' : filterStatus.toString()}
                onChange={e => setFilterStatus(e.target.value === '' ? null : Number(e.target.value) as TaskStatus)}
                disabled={isLoading}
              >
                <option value="">Все статусы</option>
                {Object.values(TaskStatus).filter(value => typeof value === 'number').map(status => (
                  <option key={status} value={status}>{TaskStatusLabels[status as TaskStatus]}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-error shadow-lg mb-6 rounded-xl">
          <div className="flex items-center">
            <MdError className="shrink-0 h-6 w-6" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col justify-center items-center py-16 bg-base-200/70 backdrop-blur-sm rounded-xl">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-base-content/70">Загрузка данных...</p>
        </div>
      ) : (
        <>
          {/* Таблица для десктопов */}
          <div className="hidden md:block rounded-xl overflow-hidden shadow-xl bg-base-100/80 backdrop-blur-sm border border-base-300/30">
            <table className="table table-zebra w-full">
              <thead className="bg-base-200/80 backdrop-blur-sm text-base-content">
                <tr>
                  <th className="bg-opacity-80 rounded-tl-xl">#</th>
                  <th className="bg-opacity-80">Название</th>
                  <th className="bg-opacity-80">Отдел</th>
                  <th className="bg-opacity-80">Исполнитель</th>
                  <th className="text-center bg-opacity-80">Статус</th>
                  <th className="text-right bg-opacity-80 rounded-tr-xl">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-base-content/70">
                      <div className="flex flex-col items-center justify-center py-8">
                        <MdSearch className="text-4xl mb-2 opacity-50" />
                        <p>Нет задач для отображения</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task, index) => (
                    <tr key={task.id} className="hover">
                      <td className="font-medium">{index + 1}</td>
                      <td>
                        <button
                          className="font-medium text-primary hover:underline"
                          onClick={() => onViewTaskDetails(task)}
                        >
                          {task.title}
                        </button>
                      </td>
                      <td>
                        <div className="badge badge-outline backdrop-blur-sm">{getDepartmentName(task.department)}</div>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <MdPerson className="text-base-content/70" />
                          <span>{getWorkerName(task)}</span>
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="tooltip" data-tip={TaskStatusLabels[task.status]}>
                          {getStatusIcon(task.status)}
                        </div>
                      </td>
                      <td className="text-right">
                        <div className="flex justify-end gap-1">
                          {task.status === TaskStatus.ToDo && (
                            <button
                              className="btn btn-xs btn-outline rounded-lg"
                              onClick={() => onEditTask(task)}
                              disabled={isLoading}
                            >
                              <RiPencilFill size={16} />
                            </button>
                          )}
                          {task.status === TaskStatus.OnReview && (
                            <div className="flex justify-end gap-1">
                              <button
                                className="btn btn-xs btn-success rounded-lg tooltip backdrop-blur-sm"
                                data-tip="Утвердить задачу"
                                onClick={() => updateTaskStatus(task.id, TaskStatus.Done)}
                                disabled={isLoading}
                              >
                                <MdCheck size={16} />
                              </button>
                              <button
                                className="btn btn-xs btn-warning rounded-lg tooltip backdrop-blur-sm"
                                data-tip="Вернуть на доработку"
                                onClick={() => updateTaskStatus(task.id, TaskStatus.InProgress)}
                                disabled={isLoading}
                              >
                                <MdClose size={16} />
                              </button>
                            </div>
                          )}
                          <button
                            className="btn btn-xs btn-error tooltip rounded-lg backdrop-blur-sm" 
                            data-tip="Удалить задачу"
                            onClick={() => removeTask(task.id)}
                            disabled={isLoading}
                          >
                            <MdDelete size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Карточки для мобильных устройств */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-8 rounded-xl bg-base-200/70 backdrop-blur-sm shadow-md">
                <MdSearch className="text-4xl mx-auto mb-2 opacity-50" />
                <p>Нет задач для отображения</p>
              </div>
            ) : (
              filteredTasks.map((task, index) => (
                <div key={task.id} className="card bg-base-100/80 backdrop-blur-sm shadow-xl border border-base-300/30 rounded-xl">
                  <div className="card-body p-5">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className="badge badge-primary rounded-lg">{index + 1}</div>
                        <h3 className="card-title text-base" onClick={() => onViewTaskDetails(task)}>
                          {task.title}
                        </h3>
                      </div>
                      <div className="tooltip" data-tip={TaskStatusLabels[task.status]}>
                        {getStatusIcon(task.status)}
                      </div>
                    </div>
                    
                    <div className="h-px bg-gradient-to-r from-transparent via-base-300/50 to-transparent w-full my-3"></div>
                    
                    <div className="mt-2 text-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <MdCategory className="text-base-content/70" />
                        <div className="badge badge-outline badge-sm backdrop-blur-sm">{getDepartmentName(task.department)}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MdPerson className="text-base-content/70" />
                        <span>{getWorkerName(task)}</span>
                      </div>
                    </div>
                    
                    <div className="card-actions justify-end mt-3">
                      {task.status === TaskStatus.ToDo && (
                        <button
                          className="btn btn-xs btn-outline rounded-lg"
                          onClick={() => onEditTask(task)}
                          disabled={isLoading}
                        >
                          <RiPencilFill size={16} className="mr-1" /> Изменить
                        </button>
                      )}
                      {task.status === TaskStatus.OnReview && (
                        <div className="card-actions justify-end mt-3 gap-2">
                          <button
                            className="btn btn-xs btn-success rounded-lg tooltip backdrop-blur-sm"
                            data-tip="Утвердить задачу"
                            onClick={() => updateTaskStatus(task.id, TaskStatus.Done)}
                            disabled={isLoading}
                          >
                            <MdCheck size={16} />
                          </button>
                          <button
                            className="btn btn-xs btn-warning rounded-lg tooltip backdrop-blur-sm"
                            data-tip="Вернуть на доработку"
                            onClick={() => updateTaskStatus(task.id, TaskStatus.InProgress)}
                            disabled={isLoading}
                          >
                            <MdClose size={16} />
                          </button>
                        </div>
                      )}
                      <button
                        className="btn btn-xs btn-error rounded-lg backdrop-blur-sm" 
                        onClick={() => removeTask(task.id)}
                        disabled={isLoading}
                      >
                        <MdDelete size={16} className="mr-1" /> Удалить
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}; 