import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const API_BASE_URL = 'http://localhost:5000/api';

  // Fetch tasks dari database
  const fetchTasks = async (userId) => {
    if (!userId || userId === 'undefined') return;
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${API_BASE_URL}/tasks/${userId}`);
      const data = await response.json();

      if (data.success) {
        setTasks(data.data || data.tasks || []);
      } else {
        setError(data.message || 'Gagal mengambil data task');
      }
    } catch (err) {
      setError('Gagal terhubung ke server');
      console.error('Fetch tasks error:', err);
      // Fallback ke data lokal jika ada error
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch tasks saat user login
  useEffect(() => {
    const userId = user?.id || user?.user_id;
    if (userId && userId !== 'undefined') {
      fetchTasks(userId);
    }
  }, [user]);

  const addTask = async (title, deadline) => {
    const userId = user?.id || user?.user_id;
    if (!userId || userId === 'undefined') return null;

    try {
      setError('');
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          title,
          deadline,
          status: 'pending'
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Gagal membuat task');
        return null;
      }

      // Fetch ulang tasks
      await fetchTasks(userId);
      return data;
    } catch (err) {
      setError('Gagal terhubung ke server');
      console.error('Add task error:', err);
      return null;
    }
  };

  const updateTask = async (id, updates) => {
    const userId = user?.id || user?.user_id;
    if (!userId || userId === 'undefined') return false;
    if (!id || id === 'undefined') return false;

    // If only status is being updated, use PATCH endpoint
    if (Object.keys(updates).length === 1 && updates.status !== undefined) {
      try {
        setError('');
        const response = await fetch(`${API_BASE_URL}/tasks/${id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status: updates.status })
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.message || 'Gagal mengubah status task');
          return false;
        }

        // Fetch ulang tasks
        await fetchTasks(userId);
        return true;
      } catch (err) {
        setError('Gagal terhubung ke server');
        console.error('Update status error:', err);
        return false;
      }
    }

    // For full update, get current task first
    const currentTask = tasks.find(t => t.taskId === id || t.task_id === id || t.id === id);
    if (!currentTask) {
      setError('Task tidak ditemukan');
      return false;
    }

    const fullUpdate = {
      title: updates.title || currentTask.title,
      deadline: updates.deadline || currentTask.deadline,
      status: updates.status || currentTask.status
    };

    try {
      setError('');
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fullUpdate)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Gagal mengubah task');
        return false;
      }

      // Fetch ulang tasks
      await fetchTasks(userId);
      return true;
    } catch (err) {
      setError('Gagal terhubung ke server');
      console.error('Update task error:', err);
      return false;
    }
  };

  const deleteTask = async (id) => {
    const userId = user?.id || user?.user_id;
    if (!userId || userId === 'undefined') return false;
    if (!id || id === 'undefined') return false;

    try {
      setError('');
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Gagal menghapus task');
        return false;
      }

      // Fetch ulang tasks
      await fetchTasks(userId);
      return true;
    } catch (err) {
      setError('Gagal terhubung ke server');
      console.error('Delete task error:', err);
      return false;
    }
  };

  const toggleTaskStatus = async (id) => {
    if (!id || id === 'undefined') return false;
    const task = tasks.find(t => t.taskId === id || t.task_id === id || t.id === id);
    if (!task) return false;

    const newStatus = task.status === 'pending' ? 'completed' : 'pending';

    try {
      setError('');
      const response = await fetch(`${API_BASE_URL}/tasks/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Gagal mengubah status task');
        return false;
      }

      // Fetch ulang tasks
      const userId = user?.id || user?.user_id;
      if (userId) {
        await fetchTasks(userId);
      }
      return true;
    } catch (err) {
      setError('Gagal terhubung ke server');
      console.error('Toggle status error:', err);
      return false;
    }
  };

  const getTasksByDate = (date) => {
    if (!Array.isArray(tasks)) return [];
    const dateStr = date.toISOString().split('T')[0];
    return tasks.filter(task => {
      const taskDateStr = task.deadline.split('T')[0];
      return taskDateStr === dateStr;
    });
  };

  const getSelectedDateTasks = () => {
    return getTasksByDate(selectedDate);
  };

  const getDatesWithTasks = () => {
    return [...new Set(tasks.map(task => task.deadline.split('T')[0]))];
  };

  const hasTasksOnDate = (date) => {
    return getTasksByDate(date).length > 0;
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        selectedDate,
        setSelectedDate,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        getTasksByDate,
        getSelectedDateTasks,
        getDatesWithTasks,
        hasTasksOnDate,
        fetchTasks,
        loading,
        error
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export default TaskContext;
