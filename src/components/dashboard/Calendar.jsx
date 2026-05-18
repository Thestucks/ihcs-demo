import React, { useState, useEffect } from 'react';
import { useTask } from '../../context/TaskContext';
import '../../styles/Calendar.css';

function Calendar() {
  const { selectedDate, setSelectedDate, hasTasksOnDate } = useTask();
  // Indonesian Public Holidays 2025-2026
  const holidays = {
    '2025-01-01': 'Tahun Baru',
    '2025-01-25': 'Isra dan Mi\'raj',
    '2025-01-29': 'Hari Raya Imlek',
    '2025-03-29': 'Hari Raya Idul Fitri',
    '2025-03-30': 'Hari Raya Idul Fitri',
    '2025-03-31': 'Cuti Bersama',
    '2025-04-01': 'Cuti Bersama',
    '2025-04-18': 'Jumat Agung',
    '2025-04-19': 'Hari Raya Nyepi',
    '2025-05-01': 'Hari Buruh Internasional',
    '2025-05-14': 'Hari Raya Waisak',
    '2025-06-08': 'Hari Raya Idul Adha',
    '2025-06-27': 'Tahun Baru Hijriah',
    '2025-08-17': 'Hari Kemerdekaan RI',
    '2025-09-14': 'Mawlid Nabi Muhammad',
    '2025-12-25': 'Hari Raya Natal',
    '2025-12-26': 'Cuti Bersama Natal',
    '2025-12-31': 'Cuti Bersama Tahun Baru',
    '2026-01-01': 'Tahun Baru',
    '2026-02-10': 'Isra dan Mi\'raj',
    '2026-02-17': 'Hari Raya Imlek',
    '2026-03-11': 'Hari Raya Idul Fitri',
    '2026-03-12': 'Hari Raya Idul Fitri',
    '2026-03-13': 'Cuti Bersama',
    '2026-03-14': 'Cuti Bersama',
    '2026-04-10': 'Jumat Agung',
    '2026-04-11': 'Hari Raya Nyepi',
    '2026-05-01': 'Hari Buruh Internasional',
    '2026-05-03': 'Hari Raya Waisak',
    '2026-05-30': 'Hari Raya Idul Adha',
    '2026-06-16': 'Tahun Baru Hijriah',
    '2026-08-17': 'Hari Kemerdekaan RI',
    '2026-09-04': 'Mawlid Nabi Muhammad',
    '2026-12-25': 'Hari Raya Natal',
    '2026-12-31': 'Cuti Bersama Tahun Baru',
  };

  const [currentDate, setCurrentDate] = useState(new Date()); // Today's date

  useEffect(() => {
    setSelectedDate(currentDate);
  }, [currentDate, setSelectedDate]);

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const monthName = currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  // Add empty cells for days before the first day of month
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Add days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const today = new Date();
  const isCurrentMonth =
    today.getFullYear() === currentDate.getFullYear() &&
    today.getMonth() === currentDate.getMonth();

  const getHolidayInfo = (day) => {
    if (!day) return null;
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return holidays[dateStr] || null;
  };

  return (
    <div className="calendar-wrapper">
      <div className="calendar-header">
        <div className="month-year-display">
          <h2>{monthName}</h2>
        </div>
        <div className="calendar-controls">
          <button className="btn-control" onClick={handlePrevMonth} title="Bulan Sebelumnya">
            ❮
          </button>
          <button className="btn-today" onClick={handleToday}>
            Hari Ini
          </button>
          <button className="btn-control" onClick={handleNextMonth} title="Bulan Berikutnya">
            ❯
          </button>
        </div>
      </div>

      <div className="calendar-container">
        <div className="calendar-grid">
          {/* Day headers */}
          <div className="day-header">Min</div>
          <div className="day-header">Sen</div>
          <div className="day-header">Sel</div>
          <div className="day-header">Rab</div>
          <div className="day-header">Kam</div>
          <div className="day-header">Jum</div>
          <div className="day-header">Sab</div>

          {/* Calendar days */}
          {days.map((day, index) => {
            const holiday = getHolidayInfo(day);
            const hasTask = day && hasTasksOnDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
            const isSelected = day && selectedDate && 
              day === selectedDate.getDate() &&
              currentDate.getMonth() === selectedDate.getMonth() &&
              currentDate.getFullYear() === selectedDate.getFullYear();
            
            return (
              <div
                key={index}
                className={`calendar-day ${!day ? 'empty' : ''} ${
                  isCurrentMonth && day === today.getDate() ? 'today' : ''
                } ${holiday ? 'holiday' : ''} ${isSelected ? 'selected' : ''} ${hasTask ? 'has-tasks' : ''}`}
                title={holiday || ''}
                onClick={() => day && setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                style={{ cursor: day ? 'pointer' : 'default' }}
              >
                <div className="day-number">{day}</div>
                {holiday && <div className="holiday-indicator">•</div>}
                {hasTask && <div className="task-indicator">📌</div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Calendar;
