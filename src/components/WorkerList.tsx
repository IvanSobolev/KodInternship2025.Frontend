import { useState, useMemo } from 'react';
import type { Worker } from '../types';
import { Department, DepartmentLabels, WorkerStatus, WorkerStatusLabels } from '../types';
import { motion } from 'framer-motion';
import { MdError, MdPerson, MdCategory, MdOutlineBadge, MdCheckCircle, MdHourglassEmpty, MdCancel, MdFilterList } from 'react-icons/md';
import { RiPencilFill } from 'react-icons/ri';

interface WorkerListProps {
  workers: Worker[];
  onEditWorker: (worker: Worker) => void;
  isLoading?: boolean;
  error?: string | null;
}

export const WorkerList = ({
  workers,
  onEditWorker,
  isLoading = false,
  error = null
}: WorkerListProps) => {
  const [filterDepartment, setFilterDepartment] = useState<string>('');
  
  const animationProps = {
    initial: { opacity: 0, x: 10 },
    animate: { opacity: 1, x: 0 },
    exit:    { opacity: 0, x: -10 },
    transition: { duration: 0.3 }
  };

  // Функция для получения названия отдела из перечисления
  const getDepartmentName = (department: Department | string): string => {
    if (typeof department === 'number') {
      return DepartmentLabels[department as Department] || String(department);
    }
    return String(department);
  };

  // Функция для отображения статуса работника
  const getStatusClassName = (status: WorkerStatus): string => {
    switch (status) {
      case WorkerStatus.Free:
        return 'badge badge-success';
      case WorkerStatus.Busy:
        return 'badge badge-warning';
      case WorkerStatus.Unavailable:
        return 'badge badge-error';
      default:
        return 'badge';
    }
  };

  // Функция для отображения иконки статуса работника
  const getStatusIcon = (status: WorkerStatus) => {
    switch (status) {
      case WorkerStatus.Free:
        return <MdCheckCircle size={20} className="text-green-500" />;
      case WorkerStatus.Busy:
        return <MdHourglassEmpty size={20} className="text-yellow-500" />;
      case WorkerStatus.Unavailable:
        return <MdCancel size={20} className="text-red-500" />;
      default:
        return null;
    }
  };

  // Фильтрация и сортировка работников
  const filteredWorkers = useMemo(() => {
    // Сначала фильтруем по отделу, если выбран
    let result = workers;
    
    if (filterDepartment) {
      // Находим отдел по названию
      const departmentEntry = Object.entries(DepartmentLabels).find(
        ([_, label]) => label === filterDepartment
      );
      
      if (departmentEntry) {
        const departmentId = Number(departmentEntry[0]);
        result = workers.filter(worker => worker.department === departmentId);
      }
    }
    
    // Сортируем по отделу
    return result.sort((a, b) => {
      // Сначала сортируем по отделу
      if (a.department !== b.department) {
        return a.department - b.department;
      }
      // Если отделы одинаковые, сортируем по имени
      return a.fullName.localeCompare(b.fullName);
    });
  }, [workers, filterDepartment]);

  return (
    <motion.div key="workers" {...animationProps}>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-xs">
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
                  <th>#</th>
                  <th>TG ID</th>
                  <th>ФИО</th>
                  <th>Telegram</th>
                  <th>Отдел</th>
                  <th className="text-center">Статус</th>
                  <th className="text-right">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8">
                      Нет работников для отображения
                    </td>
                  </tr>
                ) : (
                  filteredWorkers.map((worker, index) => (
                    <tr key={worker.telegramId} className="hover:bg-base-100">
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">{worker.telegramId}</td>
                      <td className="px-4 py-3">{worker.fullName}</td>
                      <td className="px-4 py-3">@{worker.telegramUsername}</td>
                      <td className="px-4 py-3">{getDepartmentName(worker.department)}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="tooltip" data-tip={WorkerStatusLabels[worker.workerStatus]}>
                          {getStatusIcon(worker.workerStatus)}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          className="btn btn-xs btn-outline"
                          onClick={() => onEditWorker(worker)}
                          disabled={isLoading}
                        >
                          <RiPencilFill size={16} />
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
            {filteredWorkers.length === 0 ? (
              <div className="text-center py-8 border rounded-lg bg-base-100">
                Нет работников для отображения
              </div>
            ) : (
              filteredWorkers.map((worker, index) => (
                <div key={worker.telegramId} className="card bg-base-100 shadow-sm">
                  <div className="card-body p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <span className="badge badge-sm">{index + 1}</span>
                        <h3 className="card-title text-base">{worker.fullName}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="tooltip" data-tip={WorkerStatusLabels[worker.workerStatus]}>
                          {getStatusIcon(worker.workerStatus)}
                        </div>
                        <button
                          className="btn btn-xs btn-outline"
                          onClick={() => onEditWorker(worker)}
                          disabled={isLoading}
                        >
                          <RiPencilFill size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <MdOutlineBadge className="text-gray-500" />
                        <span>ID: {worker.telegramId}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <MdPerson className="text-gray-500" />
                        <span>@{worker.telegramUsername}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MdCategory className="text-gray-500" />
                        <span>{getDepartmentName(worker.department)}</span>
                      </div>
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