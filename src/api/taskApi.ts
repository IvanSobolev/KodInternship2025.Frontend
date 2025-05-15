import type { Task, Worker, NewTask, NewWorker, UpdateTask, ProjectTaskFilterDto, WorkersFilterDto } from '../types';
import api from './axios';

// Функции для работы с задачами
export const taskApi = {
  async getTasks(filter?: ProjectTaskFilterDto): Promise<Task[]> {
    try {
      const { data } = await api.get('/ProjectTask', { params: filter });
      
      // Получаем всех работников для соотнесения их с задачами
      const workersResponse = await api.get('/workers');
      const workers = workersResponse.data;
      
      return data.map((task: any) => {
        // Если есть assignedWorkerId, находим соответствующего работника
        let assignedWorkerName = undefined;
        if (task.assignedWorkerId) {
          const worker = workers.find((w: Worker) => w.telegramId === task.assignedWorkerId);
          if (worker) {
            assignedWorkerName = worker.fullName;
          }
        }
        
        return {
          ...task,
          assignedWorkerName,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt)
        };
      });
    } catch (error) {
      console.error('Ошибка при получении задач:', error);
      throw error;
    }
  },

  // Получить задачу по ID
  async getTaskById(id: string): Promise<Task> {
    try {
      const { data } = await api.get(`/ProjectTask/${id}`);
      
      let assignedWorkerName = undefined;
      if (data.assignedWorkerId) {
        try {
          const workerResponse = await api.get(`/workers/${data.assignedWorkerId}`);
          if (workerResponse.data) {
            assignedWorkerName = workerResponse.data.fullName;
          }
        } catch (workerError) {
          console.error('Ошибка при получении данных работника:', workerError);
        }
      }
      
      return {
        ...data,
        assignedWorkerName,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt)
      };
    } catch (error) {
      console.error('Ошибка при получении задачи по ID:', error);
      throw error;
    }
  },

  // Создать новую задачу
  async createTask(task: NewTask): Promise<Task> {
    try {
      const { data } = await api.post('/ProjectTask', task);
      
      return {
        ...data,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt)
      };
    } catch (error) {
      console.error('Ошибка при создании задачи:', error);
      throw error;
    }
  },

  // Обновить существующую задачу
  async updateTask(task: UpdateTask): Promise<Task> {
    try {
      console.log(`Отправка запроса на обновление задачи с ID: ${task.id}`, task);
      const { data } = await api.put(`/ProjectTask`, task);
      console.log(`Задача с ID ${task.id} успешно обновлена`, data);
      
      return {
        ...data,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt)
      };
    } catch (error) {
      console.error(`Ошибка при обновлении задачи с ID ${task.id}:`, error);
      throw error;
    }
  },

  // Удалить задачу
  async deleteTask(id: string): Promise<void> {
    try {
      console.log(`Отправка запроса на удаление задачи с ID: ${id}`);
      await api.delete(`/ProjectTask/${id}`);
      console.log(`Задача с ID ${id} успешно удалена`);
    } catch (error) {
      console.error(`Ошибка при удалении задачи с ID ${id}:`, error);
      throw error;
    }
  },
  
  // Принять задачу работником
  async acceptTask(taskId: string, telegramId: number): Promise<Task> {
    try {
      console.log(`Принятие задачи ${taskId} работником ${telegramId}`);
      const { data } = await api.post(`/ProjectTask/${taskId}/accept?tgId=${telegramId}`);
      
      return {
        ...data,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt)
      };
    } catch (error) {
      console.error('Ошибка при принятии задачи:', error);
      throw error;
    }
  },
  
  // Завершить задачу (поставить на проверку)
  async completeTask(id: string): Promise<void> {
    try {
      console.log(`Завершение задачи с ID: ${id}`);
      await api.post(`/ProjectTask/${id}/complete`);
      console.log(`Задача с ID ${id} успешно завершена`);
    } catch (error) {
      console.error(`Ошибка при завершении задачи с ID ${id}:`, error);
      throw error;
    }
  },
  
  // Подтвердить выполнение задачи
  async finishTask(id: string): Promise<void> {
    try {
      await api.post(`/ProjectTask/${id}/finish`);
    } catch (error) {
      console.error('Ошибка при подтверждении задачи:', error);
      throw error;
    }
  },
  
  // Отменить проверку (вернуть в работу)
  async cancelReview(id: string): Promise<void> {
    try {
      await api.post(`/ProjectTask/${id}/cancel-review`);
    } catch (error) {
      console.error('Ошибка при отмене проверки:', error);
      throw error;
    }
  },
  
  // Получить активную задачу пользователя
  async getActiveTaskForUser(workerId: number): Promise<Task | null> {
    try {
      const { data } = await api.get(`/ProjectTask/active-for-user/${workerId}`);
      
      if (!data) return null;
      
      return {
        ...data,
        createdAt: new Date(data.createdAt),
        updatedAt: new Date(data.updatedAt)
      };
    } catch (error: any) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      console.error('Ошибка при получении активной задачи:', error);
      throw error;
    }
  },
  
  // Получить задачи пользователя
  async getTasksForUser(workerId: number): Promise<Task[]> {
    try {
      const { data } = await api.get(`/ProjectTask/assigned-to-user/${workerId}`);
      return data.map((task: any) => ({
        ...task,
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt)
      }));
    } catch (error) {
      console.error('Ошибка при получении задач пользователя:', error);
      throw error;
    }
  }
};

// Функции для работы с работниками
export const workerApi = {
  async getWorkers(filters?: WorkersFilterDto): Promise<Worker[]> {
    try {
      const { data } = await api.get('/workers', { params: filters });
      return data;
    } catch (error) {
      console.error('Ошибка при получении работников:', error);
      throw error;
    }
  },

  // Создать нового работника
  async createWorker(worker: NewWorker): Promise<Worker> {
    try {
      const { data } = await api.post('/workers', worker);
      return data;
    } catch (error) {
      console.error('Ошибка при создании работника:', error);
      throw error;
    }
  },
  
  // Обновить работника
  async updateWorker(worker: NewWorker): Promise<Worker> {
    try {
      const { data } = await api.put('/workers', worker);
      return data;
    } catch (error) {
      console.error('Ошибка при обновлении работника:', error);
      throw error;
    }
  },
  
  // Удалить работника
  async deleteWorker(telegramId: number): Promise<void> {
    try {
      await api.delete(`/workers/${telegramId}`);
    } catch (error) {
      console.error('Ошибка при удалении работника:', error);
      throw error;
    }
  },
  
  // Получить работника по Telegram ID
  async getWorkerByTelegramId(telegramId: number): Promise<Worker> {
    try {
      const { data } = await api.get(`/workers/${telegramId}`);
      return data;
    } catch (error) {
      console.error('Ошибка при получении работника:', error);
      throw error;
    }
  }
}; 