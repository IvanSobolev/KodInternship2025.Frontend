// Перечисления для работы с API
export enum TaskStatus {
  ToDo = 0,      // Нужно сделать
  InProgress = 1, // В процессе
  OnReview = 2,   // На проверке
  Done = 3        // Сделано
}

export enum Department {
  Empty = 0,      // Пусто
  Frontend = 1,   // Frontend
  Backend = 2,    // Backend
  UiUx = 3        // UI/UX
}

export enum WorkerStatus {
  Free = 0,      // Свободен
  Busy = 1,      // Занят
  Unavailable = 2 // Недоступен
}

// Маппинг для отображения статусов в понятной форме
export const TaskStatusLabels: Record<TaskStatus, string> = {
  [TaskStatus.ToDo]: 'Нужно сделать',
  [TaskStatus.InProgress]: 'В процессе',
  [TaskStatus.OnReview]: 'На проверке',
  [TaskStatus.Done]: 'Сделано'
};

export const DepartmentLabels: Record<Department, string> = {
  [Department.Empty]: 'Пусто',
  [Department.Frontend]: 'Frontend',
  [Department.Backend]: 'Backend',
  [Department.UiUx]: 'UI/UX'
};

export const WorkerStatusLabels: Record<WorkerStatus, string> = {
  [WorkerStatus.Free]: 'Свободен',
  [WorkerStatus.Busy]: 'Занят',
  [WorkerStatus.Unavailable]: 'Ожидает принятия задачи'
};

// Интерфейсы для задач
export interface Task {
  id: string;
  title: string;
  text: string;             
  status: TaskStatus;
  department: Department;
  assignedWorkerId: number | null;
  assignedWorkerName?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Интерфейсы для фильтрации задач
export interface ProjectTaskFilterDto {
  department?: Department;
  status?: TaskStatus;
}

// Интерфейсы для работников
export interface Worker {
  telegramId: number;
  fullName: string;
  department: Department;
  telegramUsername: string;
  workerStatus: WorkerStatus;
}

// Интерфейсы для фильтрации работников
export interface WorkersFilterDto {
  department?: Department;
  workerStatus?: WorkerStatus;
}

// Типы для форм
export type TabType = 'tasks' | 'workers' | 'statistics';

// DTO для создания новой задачи
export interface NewTask {
  title: string;
  text: string;
  department: Department;
}

export interface AddProjectTaskDto extends NewTask {}

// DTO для обновления задачи
export interface UpdateTask {
  id: string;
  title: string;
  text: string;
  department: Department;
}

export interface UpdateTaskDto extends UpdateTask {}

// DTO для создания нового работника
export interface NewWorker {
  telegramId: number;
  fullName: string;
  department: Department;
  telegramUsername: string;
}

export interface AddWorkerDto extends NewWorker {}

// DTO для обновления работника
export interface UpdateWorkerDto extends NewWorker {}