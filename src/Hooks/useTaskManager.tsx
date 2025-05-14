import { useState, useEffect, useCallback } from 'react';
import type { 
  Task, 
  Worker, 
  TabType, 
  NewTask, 
  NewWorker, 
  UpdateTask, 
  ProjectTaskFilterDto, 
  WorkersFilterDto 
} from '../types';
import { TaskStatus, Department, DepartmentLabels } from '../types';
import { taskApi, workerApi } from '../api/taskApi';

export const useTaskManager = () => {
  const [tab, setTab] = useState<TabType>('tasks');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingWorkerId, setEditingWorkerId] = useState<number | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [workers, setWorkers] = useState<Worker[]>([]);

  // Функция для загрузки задач
  const loadTasks = useCallback(async (filters?: ProjectTaskFilterDto) => {
    setIsLoading(true);
    setError(null);
    try {
      const tasksData = await taskApi.getTasks(filters);
      setTasks(tasksData);
    } catch (err) {
      setError('Ошибка при загрузке задач с сервера.');
      console.error('Ошибка загрузки задач:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Функция для загрузки работников
  const loadWorkers = useCallback(async (filters?: WorkersFilterDto) => {
    setIsLoading(true);
    setError(null);
    try {
      const workersData = await workerApi.getWorkers(filters);
      setWorkers(workersData);
    } catch (err) {
      setError('Ошибка при загрузке работников с сервера.');
      console.error('Ошибка загрузки работников:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Загрузка данных при первом рендере
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (tab === 'tasks') {
          await loadTasks();
        } else {
          await loadWorkers();
        }
      } catch (err) {
        setError('Ошибка при загрузке данных с сервера.');
        console.error('Ошибка загрузки данных:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Загрузка данных при переключении вкладок
  useEffect(() => {
    const fetchDataForTab = async () => {
      if (tab === 'tasks') {
        await loadTasks();
      } else {
        await loadWorkers();
      }
    };

    fetchDataForTab();
  }, [tab, loadTasks, loadWorkers]);

  const [newTask, setNewTask] = useState<NewTask>({ 
    title: '', 
    text: '', 
    department: Department.Empty
  });
  const [showTaskModal, setShowTaskModal] = useState(false);

  const addTask = async () => {
    if (!newTask.title || !newTask.text) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      if (editingTaskId) {
        const updateTaskData: UpdateTask = {
          id: editingTaskId,
          title: newTask.title,
          text: newTask.text,
          department: newTask.department
        };
        
        console.log('Обновление задачи:', updateTaskData);
        const updatedTask = await taskApi.updateTask(updateTaskData);
        console.log('Задача успешно обновлена:', updatedTask);
        setTasks(tasks.map(t => t.id === editingTaskId ? updatedTask : t));
      } else {
        const createdTask = await taskApi.createTask(newTask);
        setTasks([...tasks, createdTask]);
      }
      
      setEditingTaskId(null);
      setNewTask({ title: '', text: '', department: Department.Empty });
      setShowTaskModal(false);
    } catch (err) {
      console.error('Ошибка при сохранении задачи:', err);
      setError('Ошибка при сохранении задачи');
    } finally {
      setIsLoading(false);
    }
  };

  const updateTaskStatus = async (id: string, status: TaskStatus) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // В зависимости от статуса используем разные API
      if (status === TaskStatus.InProgress) {
        await taskApi.cancelReview(id);
      } else if (status === TaskStatus.OnReview) {
        await taskApi.completeTask(id);
      } else if (status === TaskStatus.Done) {
        await taskApi.finishTask(id);
      }
      
      // Обновляем состояние в интерфейсе
      await loadTasks();
    } catch (err) {
      console.error('Ошибка при обновлении статуса задачи:', err);
      setError('Ошибка при обновлении статуса задачи');
    } finally {
      setIsLoading(false);
    }
  };

  const removeTask = async (id: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Удаление задачи с ID:', id);
      await taskApi.deleteTask(id);
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      console.error('Ошибка при удалении задачи:', err);
      setError('Ошибка при удалении задачи');
    } finally {
      setIsLoading(false);
    }
  };

  const [newWorker, setNewWorker] = useState<NewWorker>({ 
    telegramId: 0, 
    fullName: '', 
    telegramUsername: '', 
    department: Department.Empty 
  });
  const [showWorkerModal, setShowWorkerModal] = useState(false);

  const addWorker = async () => {
    if (!newWorker.fullName || (!editingWorkerId && (!newWorker.telegramUsername || !newWorker.telegramId))) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      if (editingWorkerId) {
        // Находим текущего работника, чтобы сохранить его telegramUsername
        const currentWorker = workers.find(w => w.telegramId === editingWorkerId);
        
        // Обновляем только имя и отдел работника, сохраняя telegramUsername
        const workerToUpdate = {
          ...newWorker,
          telegramId: editingWorkerId,
          telegramUsername: currentWorker?.telegramUsername || newWorker.telegramUsername
        };
        
        console.log('Обновление работника:', workerToUpdate);
        const updatedWorker = await workerApi.updateWorker(workerToUpdate);
        console.log('Работник успешно обновлен:', updatedWorker);
        setWorkers(workers.map(w => w.telegramId === editingWorkerId ? updatedWorker : w));
        setEditingWorkerId(null);
      } else {
        const createdWorker = await workerApi.createWorker(newWorker);
        setWorkers([...workers, createdWorker]);
      }
      
      setNewWorker({ telegramId: 0, fullName: '', telegramUsername: '', department: Department.Empty });
      setShowWorkerModal(false);
    } catch (err) {
      console.error('Ошибка при сохранении работника:', err);
      setError('Ошибка при сохранении работника');
    } finally {
      setIsLoading(false);
    }
  };

  const [filterStatus, setFilterStatus] = useState<TaskStatus | null>(null);
  const [filterDepartment, setFilterDepartment] = useState('');

  // Загрузка задач с учетом фильтров
  const loadFilteredTasks = useCallback(async () => {
    const filterParams: ProjectTaskFilterDto = {};
    
    if (filterStatus !== null) {
      filterParams.status = filterStatus;
    }
    
    if (filterDepartment) {
      // Находим отдел по точному названию из DepartmentLabels
      const departmentEntry = Object.entries(DepartmentLabels).find(
        ([_, label]) => label === filterDepartment
      );
      
      if (departmentEntry) {
        filterParams.department = Number(departmentEntry[0]) as Department;
      }
    }
    
    console.log('Применяемые фильтры:', filterParams);
    await loadTasks(filterParams);
  }, [filterStatus, filterDepartment, loadTasks]);

  // Применяем фильтрацию при изменении параметров фильтра
  useEffect(() => {
    if (tab === 'tasks') {
      loadFilteredTasks();
    }
  }, [filterStatus, filterDepartment, tab, loadFilteredTasks]);

  // Фильтрация на клиенте (используется пока не пришли новые данные с сервера)
  const filteredTasks = tasks.filter(task => {
    const statusMatch = filterStatus === null || task.status === filterStatus;
    
    // Если фильтр отдела не задан, показываем все задачи
    if (!filterDepartment) {
      return statusMatch;
    }
    
    // Получаем название отдела из задачи
    const taskDepartmentName = DepartmentLabels[task.department as Department];
    
    // Сравниваем точное совпадение с выбранным фильтром
    const departmentMatch = taskDepartmentName === filterDepartment;
    
    return statusMatch && departmentMatch;
  });

  return {
    tab,
    setTab,
    tasks,
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
    filterStatus,
    setFilterStatus,
    filterDepartment,
    setFilterDepartment,
    filteredTasks,
    editingTaskId,
    setEditingTaskId,
    editingWorkerId,
    setEditingWorkerId,
    selectedTask,
    setSelectedTask,
    isLoading,
    error,
    loadTasks,
    loadWorkers
  };
};