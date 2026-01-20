import { useEffect } from "react";
import confetti from "canvas-confetti";
import { Loader2 } from "lucide-react";
import { useTasks, useUpdateTask, useDeleteTask } from "@/hooks/use-tasks";
import { useStreak } from "@/hooks/use-streak";
import { Header } from "@/components/Header";
import { ProgressBar } from "@/components/ProgressBar";
import { CreateTask } from "@/components/CreateTask";
import { TaskItem } from "@/components/TaskItem";
import { AnimatePresence } from "framer-motion";

export default function Home() {
  const { data: tasks, isLoading, error } = useTasks();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  // Calculate stats
  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter((t) => t.completed).length || 0;
  const progress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;
  const allCompleted = totalTasks > 0 && completedTasks === totalTasks;

  const streak = useStreak(allCompleted);

  // Celebration effect
  useEffect(() => {
    if (allCompleted) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const random = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function () {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({
          ...defaults,
          particleCount,
          origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 250);
    }
  }, [allCompleted]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-destructive">
        Failed to load tasks
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 px-4 sm:px-6">
      <div className="max-w-md mx-auto w-full">
        <Header streak={streak} />
        
        <ProgressBar progress={progress} />
        
        <CreateTask />

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {tasks?.sort((a, b) => {
              // Sort: incomplete first, then by id
              if (a.completed === b.completed) return b.id - a.id;
              return a.completed ? 1 : -1;
            }).map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={(id, completed) => updateTask.mutate({ id, completed })}
                onDelete={(id) => deleteTask.mutate(id)}
              />
            ))}
          </AnimatePresence>

          {tasks?.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg font-medium mb-1">No tasks yet</p>
              <p className="text-sm">Add a task above to start your day</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
