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
  MdCategory
} from 'react-icons/md';
import { RiPencilFill } from 'react-icons/ri';
import { useState } from 'react';

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
  error = null
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
        return <MdHourglassEmpty size={20} className="text-blue-500" />;
      case TaskStatus.Done:
        return <MdCheckCircle size={20} className="text-green-500" />;
      default:
        return null;
    }
  };
  
  return (
    <motion.div key="tasks" {...animationProps}>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:max-w-lg">
          <div className="relative flex-1">
            <div className="relative">
              <MdFilterList className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10" />
              <select
                className="select select-bordered w-full pl-10"
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
              className="select select-bordered pl-10 w-full"
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
        <button
          className="btn btn-primary flex items-center gap-2 w-full sm:w-auto"
          onClick={onAddNewTask}
          disabled={isLoading}
        >
          <MdAdd size={20} /> <span className="hidden sm:inline">Добавить задачу</span>
        </button>
      </div>

      {error && (
        <div className="alert alert-error mb-4">
          <MdError className="shrink-0 h-6 w-6" />
          <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : (
        <>
          {/* Таблица для десктопов */}
          <div className="hidden md:block border rounded-lg">
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
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8">
                      Нет задач для отображения
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task, index) => (
                    <tr key={task.id} className="hover:bg-base-100">
                      <td className="px-4 py-3">
                        <span className="mr-2">{index + 1}</span>
                        <button
                          className="text-blue-500"
                          onClick={() => onViewTaskDetails(task)}
                        >
                          {task.title}
                        </button>
                      </td>
                      <td className="px-4 py-3">{getDepartmentName(task.department)}</td>
                      <td className="px-4 py-3">{task.assignedWorkerId ? `ID: ${task.assignedWorkerId}` : '-'}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="tooltip" data-tip={TaskStatusLabels[task.status]}>
                          {getStatusIcon(task.status)}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        {task.status === TaskStatus.ToDo && (
                          <button
                            className="btn btn-xs btn-outline mr-1"
                            onClick={() => onEditTask(task)}
                            disabled={isLoading}
                          >
                            <RiPencilFill size={16} />
                          </button>
                        )}
                        {task.status === TaskStatus.OnReview && (
                          <>
                            <button
                              className="btn btn-xs btn-success mr-1 tooltip"
                              data-tip="Утвердить задачу"
                              onClick={() => updateTaskStatus(task.id, TaskStatus.Done)}
                              disabled={isLoading}
                            >
                              <MdCheck size={16} />
                            </button>
                            <button
                              className="btn btn-xs btn-warning mr-1 tooltip"
                              data-tip="Вернуть на доработку"
                              onClick={() => updateTaskStatus(task.id, TaskStatus.InProgress)}
                              disabled={isLoading}
                            >
                              <MdClose size={16} />
                            </button>
                          </>
                        )}
                        <button
                          className="btn btn-xs btn-error tooltip" 
                          data-tip="Удалить задачу"
                          onClick={() => removeTask(task.id)}
                          disabled={isLoading}
                        >
                          <MdDelete size={16} />
                        </button>
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
              <div className="text-center py-8 border rounded-lg bg-base-100">
                Нет задач для отображения
              </div>
            ) : (
              filteredTasks.map((task, index) => (
                <div key={task.id} className="card bg-base-100 shadow-sm">
                  <div className="card-body p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className="badge badge-sm">{index + 1}</span>
                        <h3 className="card-title text-base" onClick={() => onViewTaskDetails(task)}>
                          {task.title}
                        </h3>
                      </div>
                      <div className="tooltip" data-tip={TaskStatusLabels[task.status]}>
                        {getStatusIcon(task.status)}
                      </div>
                    </div>
                    
                    <div className="mt-2 text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <MdCategory className="text-gray-500" />
                        <span>{getDepartmentName(task.department)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MdPerson className="text-gray-500" />
                        <span>{task.assignedWorkerId ? `ID: ${task.assignedWorkerId}` : 'Не назначен'}</span>
                      </div>
                    </div>
                    
                    <div className="card-actions justify-end mt-3">
                      {task.status === TaskStatus.ToDo && (
                        <button
                          className="btn btn-xs btn-outline"
                          onClick={() => onEditTask(task)}
                          disabled={isLoading}
                        >
                          <RiPencilFill size={16} className="mr-1" /> Изменить
                        </button>
                      )}
                      {task.status === TaskStatus.OnReview && (
                        <>
                          <button
                            className="btn btn-xs btn-success"
                            onClick={() => updateTaskStatus(task.id, TaskStatus.Done)}
                            disabled={isLoading}
                          >
                            <MdCheck size={16} className="mr-1" /> Утвердить
                          </button>
                          <button
                            className="btn btn-xs btn-warning"
                            onClick={() => updateTaskStatus(task.id, TaskStatus.InProgress)}
                            disabled={isLoading}
                          >
                            <MdClose size={16} className="mr-1" /> Доработать
                          </button>
                        </>
                      )}
                      <button
                        className="btn btn-xs btn-error" 
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