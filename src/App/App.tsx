import { useTaskManager } from "../Hooks/useTaskManager";
import { AnimatePresence } from 'framer-motion';
import { AppTabs } from '../components/AppTabs';
import { TaskList } from '../components/TaskList';
import { WorkerList } from '../components/WorkerList';
import { TaskModal } from '../components/TaskModal';
import { TaskDetailsModal } from '../components/TaskDetailsModal';
import { WorkerModal } from '../components/WorkerModal';
import type { Task, Worker } from "../types";
import { Department } from "../types";

export default function App() {
  const {
    tab,
    setTab,
    filteredTasks,
    filterStatus,
    setFilterStatus,
    filterDepartment,
    setFilterDepartment,
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
    editingWorkerId,
    setEditingWorkerId,
    selectedTask,
    setSelectedTask,
    workers,
    newWorker,
    setNewWorker,
    showWorkerModal,
    setShowWorkerModal,
    addWorker,
    isLoading,
    error
  } = useTaskManager();

  const editTask = editingTaskId != null
    ? tasks.find(t => t.id === editingTaskId) || null
    : null;

  const editWorker = editingWorkerId != null
    ? workers.find(w => w.telegramId === editingWorkerId) || null
    : null;

  const handleAddNewTask = () => {
    setNewTask({ title: '', text: '', department: Department.Empty });
    setEditingTaskId(null);
    setShowTaskModal(true);
  };

  const handleEditTask = (task: Task) => {
    setNewTask({
      title: task.title,
      text: task.text,
      department: task.department
    });
    setEditingTaskId(task.id);
    setShowTaskModal(true);
  };

  const handleEditWorker = (worker: Worker) => {
    setNewWorker({
      fullName: worker.fullName,
      department: worker.department,
      telegramId: worker.telegramId,
      telegramUsername: worker.telegramUsername
    });
    setEditingWorkerId(worker.telegramId);
    setShowWorkerModal(true);
  };

  const handleCloseTaskModal = () => {
    setShowTaskModal(false);
    setEditingTaskId(null);
    setNewTask({ title: '', text: '', department: Department.Empty });
  };

  const handleCloseWorkerModal = () => {
    setShowWorkerModal(false);
    setEditingWorkerId(null);
    setNewWorker({ telegramId: 0, fullName: '', telegramUsername: '', department: Department.Empty });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <AppTabs tab={tab} setTab={setTab} />

      <AnimatePresence mode="wait">
        {tab === 'tasks' && (
          <TaskList
            filteredTasks={filteredTasks}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterDepartment={filterDepartment}
            setFilterDepartment={setFilterDepartment}
            updateTaskStatus={updateTaskStatus}
            removeTask={removeTask}
            onAddNewTask={handleAddNewTask}
            onEditTask={handleEditTask}
            onViewTaskDetails={setSelectedTask}
            isLoading={isLoading}
            error={error}
          />
        )}

        {tab === 'workers' && (
          <WorkerList
            workers={workers}
            onEditWorker={handleEditWorker}
            isLoading={isLoading}
            error={error}
          />
        )}
      </AnimatePresence>

      <TaskModal
        isOpen={showTaskModal}
        newTask={newTask}
        setNewTask={setNewTask}
        editTask={editTask}
        workers={workers}
        onSave={addTask}
        onClose={handleCloseTaskModal}
      />

      <TaskDetailsModal
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
      />

      <WorkerModal
        isOpen={showWorkerModal}
        newWorker={newWorker}
        setNewWorker={setNewWorker}
        editWorker={editWorker}
        onSave={addWorker}
        onClose={handleCloseWorkerModal}
      />
    </div>
  );
}