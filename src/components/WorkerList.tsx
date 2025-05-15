import { useState, useMemo } from 'react';
import type { Worker } from '../types';
import { Department, DepartmentLabels, WorkerStatus, WorkerStatusLabels } from '../types';
import { motion } from 'framer-motion';
import { 
  MdError, 
  MdPerson, 
  MdCategory, 
  MdOutlineBadge, 
  MdCheckCircle, 
  MdHourglassEmpty, 
  MdCancel, 
  MdFilterList,
  MdFilterAlt,
  MdSearch,
  MdPeople
} from 'react-icons/md';
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
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-primary/20 backdrop-blur-sm">
              <MdPeople className="text-2xl text-primary" />
            </span>
            Список работников
          </h2>
        </div>
        
        <div className="bg-base-200/70 backdrop-blur-sm p-5 rounded-xl shadow-md mb-8">
          <div className="text-sm font-medium mb-3 flex items-center gap-2">
            <MdFilterAlt className="text-primary" /> Фильтры
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-xs">
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
                  <th className="bg-opacity-80">TG ID</th>
                  <th className="bg-opacity-80">ФИО</th>
                  <th className="bg-opacity-80">Telegram</th>
                  <th className="bg-opacity-80">Отдел</th>
                  <th className="text-center bg-opacity-80">Статус</th>
                  <th className="text-right bg-opacity-80 rounded-tr-xl">Действия</th>
                </tr>
              </thead>
              <tbody>
                {filteredWorkers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-base-content/70">
                      <div className="flex flex-col items-center justify-center py-8">
                        <MdSearch className="text-4xl mb-2 opacity-50" />
                        <p>Нет работников для отображения</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredWorkers.map((worker, index) => (
                    <tr key={worker.telegramId} className="hover">
                      <td className="font-medium">{index + 1}</td>
                      <td>{worker.telegramId}</td>
                      <td className="font-medium">{worker.fullName}</td>
                      <td className="text-primary">@{worker.telegramUsername}</td>
                      <td>
                        <div className="badge badge-outline backdrop-blur-sm">{getDepartmentName(worker.department)}</div>
                      </td>
                      <td className="text-center">
                        <div className="tooltip" data-tip={WorkerStatusLabels[worker.workerStatus]}>
                          {getStatusIcon(worker.workerStatus)}
                        </div>
                      </td>
                      <td className="text-right">
                        <button
                          className="btn btn-xs btn-outline rounded-lg"
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
              <div className="text-center py-8 rounded-xl bg-base-200/70 backdrop-blur-sm shadow-md">
                <MdSearch className="text-4xl mx-auto mb-2 opacity-50" />
                <p>Нет работников для отображения</p>
              </div>
            ) : (
              filteredWorkers.map((worker, index) => (
                <div key={worker.telegramId} className="card bg-base-100/80 backdrop-blur-sm shadow-xl border border-base-300/30 rounded-xl">
                  <div className="card-body p-5">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className="badge badge-primary rounded-lg">{index + 1}</div>
                        <h3 className="card-title text-base">{worker.fullName}</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="tooltip" data-tip={WorkerStatusLabels[worker.workerStatus]}>
                          {getStatusIcon(worker.workerStatus)}
                        </div>
                        <button
                          className="btn btn-xs btn-outline rounded-lg"
                          onClick={() => onEditWorker(worker)}
                          disabled={isLoading}
                        >
                          <RiPencilFill size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="h-px bg-gradient-to-r from-transparent via-base-300/50 to-transparent w-full my-3"></div>
                    
                    <div className="mt-2 text-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <MdOutlineBadge className="text-base-content/70" />
                        <span>ID: {worker.telegramId}</span>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <MdPerson className="text-base-content/70" />
                        <span className="text-primary">@{worker.telegramUsername}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MdCategory className="text-base-content/70" />
                        <div className="badge badge-outline badge-sm backdrop-blur-sm">{getDepartmentName(worker.department)}</div>
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