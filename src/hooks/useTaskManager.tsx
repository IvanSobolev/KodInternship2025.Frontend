import { useState } from 'react';

export const useTaskManager = () => {
  const [tab, setTab] = useState('tasks');
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  const [tasks, setTasks] = useState([
    { id: 1, name: 'Проверить сигнализацию', text: 'Осмотреть панель в здании А', department: 'Охрана', assignee: 'Иван Петров', status: 'Нужно сделать' },
    { id: 2, name: 'Установить камеры', text: 'Установка камеры в офисе 3', department: 'Монтаж', assignee: 'Анна Смирнова', status: 'В процессе' },
    { id: 3, name: 'Проверка доступа', text: 'Тестирование системы доступа', department: 'ИТ', assignee: 'Дмитрий Волков', status: 'Сделано' },
    { id: 4, name: 'Согласование чертежей', text: 'Отправить на утверждение', department: 'Проектировщики', assignee: 'Елена Кузнецова', status: 'На проверке' }
  ]);

  const [newTask, setNewTask] = useState({ name: '', text: '', department: '', assignee: '', status: 'Нужно сделать' });
  const [showTaskModal, setShowTaskModal] = useState(false);

  const addTask = () => {
    if (!newTask.name || !newTask.department) return;
    if (editingTaskId) {
      setTasks(tasks.map(t => 
        t.id === editingTaskId 
          ? { ...t, name: newTask.name, text: newTask.text, department: newTask.department, assignee: newTask.assignee }
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
        status: 'В процессе'
      }]);
    }
    setNewTask({ name: '', text: '', department: '', assignee: '' });
    setShowTaskModal(false);
  };

  const updateTaskStatus = (id, status) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status } : t));
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const [workers, setWorkers] = useState([
    { id: 1, name: 'Иван Петров', telegram: 'ivan_fire', department: 'Охрана' },
    { id: 2, name: 'Анна Смирнова', telegram: 'smirnova_cam', department: 'Монтаж' },
    { id: 3, name: 'Дмитрий Волков', telegram: 'volkov_it', department: 'ИТ' },
    { id: 4, name: 'Елена Кузнецова', telegram: 'kuzn_arch', department: 'Проектировщики' }
  ]);

  const [newWorker, setNewWorker] = useState({ name: '', telegram: '', department: '' });
  const [showWorkerModal, setShowWorkerModal] = useState(false);

  const addWorker = () => {
    setWorkers([...workers, { ...newWorker, id: Date.now() }]);
    setNewWorker({ name: '', telegram: '', department: '' });
    setShowWorkerModal(false);
  };

  const [filterStatus, setFilterStatus] = useState('');
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