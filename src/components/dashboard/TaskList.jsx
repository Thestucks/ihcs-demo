import React from 'react';
import { useTask } from '../../context/TaskContext';
import '../../styles/TaskList.css';

function TaskList() {
  const { selectedDate, getSelectedDateTasks, toggleTaskStatus, deleteTask, addTask } = useTask();

  const tasks = getSelectedDateTasks();
  const dateStr = selectedDate.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handleAddTask = () => {
    const taskTitle = prompt('Masukkan judul tugas:');
    if (taskTitle) {
      // Format date as YYYY-MM-DD using local timezone
      const year = selectedDate.getFullYear();
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const deadline = `${year}-${month}-${day}`;
      addTask(taskTitle, deadline);
    }
  };

  return (
    <div className="task-list-card">
      <div className="task-list-header">
        <div className="task-date-display">
          <h3>Tugas Hari Ini</h3>
          <p className="task-date">{dateStr}</p>
        </div>
        <button className="add-task-btn" onClick={handleAddTask} title="Tambah Tugas">
          ➕
        </button>
      </div>

      <div className="task-list-content">
        {tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p>Tidak Ada Tugas</p>
            <small>Klik tombol + untuk menambah tugas</small>
          </div>
        ) : (
          <div className="task-items">
            {tasks.map(task => (
              <div
                key={task.taskId || task.task_id || task.id}
                className={`task-item ${task.status}`}
              >
                <div className="task-checkbox">
                  <input
                    type="checkbox"
                    checked={task.status === 'completed'}
                    onChange={() => toggleTaskStatus(task.taskId || task.task_id || task.id)}
                  />
                </div>
                <div className="task-content">
                  <p className="task-title">{task.title}</p>
                  <small className="task-meta">
                    <span className={`status-badge ${task.status}`}>
                      {task.status === 'completed' ? '✓ Selesai' : '○ Pending'}
                    </span>
                  </small>
                </div>
                <button
                  className="task-delete-btn"
                  onClick={() => deleteTask(task.taskId || task.task_id || task.id)}
                  title="Hapus Tugas"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {tasks.length > 0 && (
        <div className="task-list-stats">
          <div className="stat-item">
            <span className="stat-label">Total:</span>
            <span className="stat-value">{tasks.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Selesai:</span>
            <span className="stat-value">{tasks.filter(t => t.status === 'completed').length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Pending:</span>
            <span className="stat-value">{tasks.filter(t => t.status === 'pending').length}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskList;
