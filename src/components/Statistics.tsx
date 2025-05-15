import { useState, useEffect } from 'react';
import {
  BarChart, Bar,
  PieChart, Pie, Cell,
  LineChart, Line,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import type { Task, Worker } from '../types';
import { Department, DepartmentLabels, TaskStatus } from '../types';

interface StatisticsProps {
  tasks: Task[];
  workers: Worker[];
}

interface WorkerTaskTime {
  workerId: number;
  fullName: string;
  department: Department;
  averageTaskTime: number; // в часах
  totalTasks: number;
}

export const Statistics = ({ tasks, workers }: StatisticsProps) => {
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [workerStats, setWorkerStats] = useState<WorkerTaskTime[]>([]);
  
  // Рассчитываем статистику по времени выполнения задач
  useEffect(() => {
    // Имитация расчета среднего времени выполнения задач
    // В реальном приложении здесь будет логика расчета на основе фактических данных
    const calculateWorkerStats = () => {
      const filteredWorkers = selectedDepartment !== null 
        ? workers.filter(w => w.department === selectedDepartment)
        : workers;
      
      return filteredWorkers.map(worker => {
        const workerTasks = tasks.filter(task => task.assignedWorkerId === worker.telegramId);
        
        // Имитация расчета среднего времени (в реальном приложении будет основано на реальных данных)
        const randomAverage = Math.random() * 10 + 2; // от 2 до 12 часов
        
        return {
          workerId: worker.telegramId,
          fullName: worker.fullName,
          department: worker.department,
          averageTaskTime: parseFloat(randomAverage.toFixed(1)),
          totalTasks: workerTasks.length
        };
      }).sort((a, b) => b.averageTaskTime - a.averageTaskTime); // Сортируем по убыванию времени
    };
    
    setWorkerStats(calculateWorkerStats());
  }, [tasks, workers, selectedDepartment]);

  // Данные для графика распределения задач по отделам
  const departmentTasksData = [
    { name: DepartmentLabels[Department.Frontend], value: tasks.filter(t => t.department === Department.Frontend).length },
    { name: DepartmentLabels[Department.Backend], value: tasks.filter(t => t.department === Department.Backend).length },
    { name: DepartmentLabels[Department.UiUx], value: tasks.filter(t => t.department === Department.UiUx).length },
  ];

  // Цвета для графиков
  const COLORS = ['#0088FE', '#FF8042', '#00C49F', '#FFBB28'];

  // Данные для графика статусов задач
  const taskStatusData = [
    { name: 'Нужно сделать', value: tasks.filter(t => t.status === TaskStatus.ToDo).length },
    { name: 'В процессе', value: tasks.filter(t => t.status === TaskStatus.InProgress).length },
    { name: 'На проверке', value: tasks.filter(t => t.status === TaskStatus.OnReview).length },
    { name: 'Сделано', value: tasks.filter(t => t.status === TaskStatus.Done).length },
  ];

  // Данные для графика времени выполнения задач работниками
  const workerTimeChartData = workerStats.map(worker => ({
    name: worker.fullName,
    hours: worker.averageTaskTime,
    department: DepartmentLabels[worker.department]
  }));

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-2xl font-bold mb-4">Статистика проекта</h2>
        <p className="text-base-content/70 mb-6">
          Аналитика по задачам, отделам и эффективности работников
        </p>
      </div>

      {/* Фильтр по отделам */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Выберите отдел для анализа:</h3>
        <div className="flex flex-wrap gap-2">
          <button
            className={`btn ${selectedDepartment === null ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setSelectedDepartment(null)}
          >
            Все отделы
          </button>
          {Object.entries(DepartmentLabels)
            .filter(([key]) => key !== '0') // Исключаем "Пусто"
            .map(([key, label]) => (
              <button
                key={key}
                className={`btn ${selectedDepartment === parseInt(key) ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setSelectedDepartment(parseInt(key))}
              >
                {label}
              </button>
            ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* График распределения задач по отделам */}
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <h3 className="card-title">Распределение задач по отделам</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentTasksData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {departmentTasksData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} задач`, 'Количество']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* График статусов задач */}
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body">
            <h3 className="card-title">Статусы задач</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {taskStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} задач`, 'Количество']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* График времени выполнения задач работниками */}
      <div className="card bg-base-200 shadow-lg mt-8">
        <div className="card-body">
          <h3 className="card-title">Среднее время выполнения задач (часы)</h3>
          <p className="text-sm text-base-content/70 mb-4">
            Работники с более высоким значением тратят больше времени на выполнение задач
          </p>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={workerTimeChartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 'dataMax + 1']} />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip formatter={(value) => [`${value} часов`, 'Среднее время']} />
                <Legend />
                <Bar 
                  dataKey="hours" 
                  name="Среднее время (часы)" 
                  fill="#8884d8"
                  background={{ fill: '#eee' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Таблица с детальной информацией */}
      <div className="card bg-base-200 shadow-lg mt-8">
        <div className="card-body">
          <h3 className="card-title">Детальная информация по работникам</h3>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Имя</th>
                  <th>Отдел</th>
                  <th>Среднее время (часы)</th>
                  <th>Всего задач</th>
                  <th>Статус</th>
                </tr>
              </thead>
              <tbody>
                {workerStats.map((stat) => (
                  <tr key={stat.workerId} className={stat.averageTaskTime > 8 ? 'bg-warning/20' : ''}>
                    <td>{stat.fullName}</td>
                    <td>{DepartmentLabels[stat.department]}</td>
                    <td className={stat.averageTaskTime > 8 ? 'font-bold text-warning' : ''}>
                      {stat.averageTaskTime}
                    </td>
                    <td>{stat.totalTasks}</td>
                    <td>
                      {stat.averageTaskTime > 8 ? (
                        <span className="badge badge-warning">Требует внимания</span>
                      ) : (
                        <span className="badge badge-success">Норма</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}; 