import React, { useState } from 'react';
import { useTask } from '../../context/TaskContext';

// Helper to format date as YYYY-MM-DD using local timezone
const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const TaskCard = () => {
  const { tasks, addTask, toggleTaskStatus, deleteTask, loading } = useTask();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDeadline, setNewTaskDeadline] = useState(getLocalDateString());

  const handleAddTask = async () => {
    if (newTaskTitle.trim()) {
      await addTask(newTaskTitle, newTaskDeadline);
      setNewTaskTitle('');
      setNewTaskDeadline(getLocalDateString());
      setShowAddModal(false);
    }
  };

  const handleToggleStatus = async (id) => {
    await toggleTaskStatus(id);
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Hapus tugas ini?')) {
      await deleteTask(id);
    }
  };

  // Format date for display - handles YYYY-MM-DD format
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try {
      // Parse YYYY-MM-DD format manually to avoid timezone issues
      const parts = dateString.split('-');
      if (parts.length === 3) {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        const day = parseInt(parts[2], 10);
        const month = months[parseInt(parts[1], 10) - 1];
        const year = parts[0];
        return `${day} ${month} ${year}`;
      }
      return dateString;
    } catch {
      return dateString;
    }
  };

  // Sort tasks: pending first, then by deadline
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (a.status !== 'pending' && b.status === 'pending') return 1;
    return new Date(a.deadline) - new Date(b.deadline);
  });

  // Show only first 5 tasks
  const displayTasks = sortedTasks.slice(0, 5);

  return (
    <div className="card task-card">
      <div className="task-header">
        <h3>Daftar Tugas</h3>
        <button className="add-task-btn" onClick={() => setShowAddModal(true)} title="Tambah Tugas">
          ➕
        </button>
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="task-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="task-modal" onClick={(e) => e.stopPropagation()}>
            <h4>Tambah Tugas Baru</h4>
            <div className="modal-form">
              <div className="form-group">
                <label>Judul Tugas</label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  placeholder="Masukkan judul tugas..."
                  autoFocus
                />
              </div>
              <div className="form-group">
                <label>Deadline</label>
                <input
                  type="date"
                  value={newTaskDeadline}
                  onChange={(e) => setNewTaskDeadline(e.target.value)}
                />
              </div>
              <div className="modal-actions">
                <button className="btn-save" onClick={handleAddTask} disabled={!newTaskTitle.trim()}>
                  💾 Simpan
                </button>
                <button className="btn-cancel" onClick={() => setShowAddModal(false)}>
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="empty-state">
          <div className="empty-icon">⏳</div>
          <p>Memuat tugas...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📁</div>
          <p>Tidak Ada Tugas</p>
          <small style={{ color: '#999', marginTop: '0.5rem' }}>
            Klik tombol + untuk menambah tugas
          </small>
        </div>
      ) : (
        <>
          <div className="task-list">
            {displayTasks.map(task => (
              <div key={task.taskId || task.task_id || task.id} className={`task-item ${task.status}`}>
                <div className="task-checkbox">
                  <input
                    type="checkbox"
                    checked={task.status === 'selesai' || task.status === 'completed'}
                    onChange={() => handleToggleStatus(task.taskId || task.task_id || task.id)}
                  />
                </div>
                <div className="task-content">
                  <p className="task-title">{task.title}</p>
                  <small className="task-deadline">📅 {formatDate(task.deadline)}</small>
                </div>
                <button
                  className="task-delete"
                  onClick={() => handleDeleteTask(task.taskId || task.task_id || task.id)}
                  title="Hapus Tugas"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
          {tasks.length > 5 && (
            <div className="task-more">
              <small>+{tasks.length - 5} tugas lainnya</small>
            </div>
          )}
          <div className="task-summary">
            <span className="summary-pending">⏳ {tasks.filter(t => t.status === 'pending').length} Pending</span>
            <span className="summary-completed">✅ {tasks.filter(t => t.status === 'selesai' || t.status === 'completed').length} Selesai</span>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskCard;
