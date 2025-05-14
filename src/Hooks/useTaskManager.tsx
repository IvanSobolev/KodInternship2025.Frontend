import { useState } from 'react';
import type { Task, Worker, TaskStatus, TabType, NewTask, NewWorker } from '../types';

export const useTaskManager = () => {
  const [tab, setTab] = useState<TabType>('tasks');
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      name: 'Проверить сигнализацию',
      text: 'Осмотреть панель в здании А',
      department: 'Охрана',
      assignee: 'Иван Петров',
      status: 'Нужно сделать',
      createdAt: new Date('2025-01-10T10:00:00'),
      updatedAt: null
    },
    {
      id: 2,
      name: 'Установить камеры',
      text: 'Установка камеры в офисе 3',
      department: 'Монтаж',
      assignee: 'Анна Смирнова',
      status: 'В процессе',
      createdAt: new Date('2025-02-05T14:30:00'),
      updatedAt: new Date('2025-02-06T09:15:00')
    },
    {
      id: 3,
      name: 'Проверка доступа',
      text: 'Тестирование системы доступа',
      department: 'ИТ',
      assignee: 'Дмитрий Волков',
      status: 'Сделано',
      createdAt: new Date('2025-03-20T08:45:00'),
      updatedAt: new Date('2025-03-22T16:00:00')
    },
    {
      id: 4,
      name: 'Согласование чертежей',
      text: 'Отправить на утверждение',
      department: 'Проектировщики',
      assignee: 'Елена Кузнецова',
      status: 'На проверке',
      createdAt: new Date('2025-04-12T11:20:00'),
      updatedAt: null
    }
  ]);

  const [newTask, setNewTask] = useState<NewTask>({ 
    name: '', 
    text: '', 
    department: '', 
    assignee: '', 
    status: 'Нужно сделать' 
  });
  const [showTaskModal, setShowTaskModal] = useState(false);

  const addTask = () => {
    if (!newTask.name || !newTask.department) return;
    
    const now = new Date();
    if (editingTaskId) {
      setTasks(tasks.map(t =>
        t.id === editingTaskId
          ? { 
              ...t, 
              name: newTask.name, 
              text: newTask.text, 
              department: newTask.department, 
              assignee: newTask.assignee, 
              updatedAt: now 
            }
          : t
      ));
      setEditingTaskId(null);
    } else {
      setTasks([...tasks, {
        id: Date.now(),
        name: newTask.name,
        text: newTask.text,
        department: newTask.department,
        assignee: newTask.assignee,
        status: 'Нужно сделать',
        createdAt: now,
        updatedAt: null
      }]);
    }
    setNewTask({ name: '', text: '', department: '', assignee: '', status: 'Нужно сделать' });
    setShowTaskModal(false);
  };

  const updateTaskStatus = (id: number, status: TaskStatus) => {
    const now = new Date();
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, status, updatedAt: now } : t
    ));
  };

  const removeTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const [workers, setWorkers] = useState<Worker[]>([
    { id: 1, name: 'Иван Петров', telegram: 'ivan_fire', department: 'Охрана' },
    { id: 2, name: 'Анна Смирнова', telegram: 'smirnova_cam', department: 'Монтаж' },
    { id: 3, name: 'Дмитрий Волков', telegram: 'volkov_it', department: 'ИТ' },
    { id: 4, name: 'Елена Кузнецова', telegram: 'kuzn_arch', department: 'Проектировщики' }
  ]);

  const [newWorker, setNewWorker] = useState<NewWorker>({ name: '', telegram: '', department: '' });
  const [showWorkerModal, setShowWorkerModal] = useState(false);

  const addWorker = () => {
    if (!newWorker.name || !newWorker.department) return;
    
    setWorkers([...workers, { ...newWorker, id: Date.now() }]);
    setNewWorker({ name: '', telegram: '', department: '' });
    setShowWorkerModal(false);
  };

  const [filterStatus, setFilterStatus] = useState<TaskStatus | ''>('');
  const [filterDepartment, setFilterDepartment] = useState('');

  const filteredTasks = tasks.filter(task =>
    (filterStatus ? task.status === filterStatus : true) &&
    (filterDepartment ? task.department.toLowerCase().includes(filterDepartment.toLowerCase()) : true)
  );

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
    selectedTask,
    setSelectedTask
  };
};