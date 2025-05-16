import { useTaskManager } from "../Hooks/useTaskManager";
import { AnimatePresence } from 'framer-motion';
import { AppTabs } from '../components/AppTabs';
import { TaskList } from '../components/TaskList';
import { WorkerList } from '../components/WorkerList';
import { TaskModal } from '../components/TaskModal';
import { TaskDetailsModal } from '../components/TaskDetailsModal';
import { WorkerModal } from '../components/WorkerModal';
import { Statistics } from '../components/Statistics';
import { Toast, ToastContainer } from '../components/Toast';
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
    error,
    toasts,
    removeToast
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
    setNewWorker({ telegramId: 0, fullName: '', telegramUsername: '', department: Department.Frontend });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-300 to-base-100">
      {/* Контейнер для уведомлений */}
      <ToastContainer>
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </ToastContainer>

      {/* Main Content */}
      <main className="container mx-auto py-6 px-4 sm:py-8 sm:px-6">
        <div className="bg-base-100/80 backdrop-blur-sm rounded-box shadow-xl border border-base-300/50">
          <div className="p-4 sm:p-6">
            <AppTabs tab={tab} setTab={setTab} />

            <div className="mt-6">
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
                    workers={workers}
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
                
                {tab === 'statistics' && (
                  <Statistics 
                    tasks={tasks}
                    workers={workers}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
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
        workers={workers}
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