import axios from 'axios';

// Базовый URL API бэкенда
const API_URL = 'http://150.241.88.0:8080/api';

// Создаем экземпляр axios с настройками по умолчанию
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Интерцептор для запросов
api.interceptors.request.use(
  (config) => {
    // Упрощенный интерцептор без авторизации
    console.log(`Отправка запроса: ${config.method?.toUpperCase()} ${config.url}`, config.params || config.data);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Интерцептор для ответов
api.interceptors.response.use(
  (response) => {
    // Обработка успешных ответов
    console.log(`Получен ответ от ${response.config.url}:`, response.data);
    return response;
  },
  (error) => {
    // Обработка ошибок
    if (error.response) {
      // Если сервер вернул ошибку со статусом
      console.error('Ошибка от сервера:', error.response.data);
    } else if (error.request) {
      // Запрос был сделан, но ответ не получен
      console.error('Нет ответа от сервера:', error.request);
    } else {
      // Что-то пошло не так при настройке запроса
      console.error('Ошибка запроса:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api; 