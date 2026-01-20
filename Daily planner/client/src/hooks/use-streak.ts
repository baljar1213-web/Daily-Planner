import { useState, useEffect } from 'react';
import { differenceInCalendarDays, isToday, isYesterday } from 'date-fns';

interface StreakData {
  count: number;
  lastCompletionDate: string | null;
}

export function useStreak(allTasksCompleted: boolean) {
  const [streak, setStreak] = useState<number>(0);
  
  useEffect(() => {
    // Load streak from local storage on mount
    const stored = localStorage.getItem('focus_streak');
    if (stored) {
      const data: StreakData = JSON.parse(stored);
      const lastDate = data.lastCompletionDate ? new Date(data.lastCompletionDate) : null;
      
      // If last completion was yesterday or today, keep streak. Otherwise reset.
      if (lastDate && (isToday(lastDate) || isYesterday(lastDate))) {
        setStreak(data.count);
      } else {
        setStreak(0);
        localStorage.setItem('focus_streak', JSON.stringify({ count: 0, lastCompletionDate: null }));
      }
    }
  }, []);

  useEffect(() => {
    // Only update if all tasks are completed
    if (allTasksCompleted) {
      const stored = localStorage.getItem('focus_streak');
      let currentStreak = 0;
      let lastDate = null;

      if (stored) {
        const data: StreakData = JSON.parse(stored);
        currentStreak = data.count;
        lastDate = data.lastCompletionDate ? new Date(data.lastCompletionDate) : null;
      }

      // If already completed today, don't increment again
      if (lastDate && isToday(lastDate)) {
        return;
      }

      // If completed yesterday, increment. If null (first time), start at 1. Else reset to 1.
      const newStreak = (lastDate && isYesterday(lastDate)) ? currentStreak + 1 : 1;
      
      setStreak(newStreak);
      localStorage.setItem('focus_streak', JSON.stringify({
        count: newStreak,
        lastCompletionDate: new Date().toISOString()
      }));
    }
  }, [allTasksCompleted]);

  return streak;
}
