import { motion } from "framer-motion";
import { Check, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Task } from "@shared/schema";
import { forwardRef } from "react";

interface TaskItemProps {
  task: Task;
  onToggle: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
}

export const TaskItem = forwardRef<HTMLDivElement, TaskItemProps>(({ task, onToggle, onDelete }, ref) => {
  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
      className={cn(
        "group flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200",
        task.completed 
          ? "bg-muted/30 border-transparent" 
          : "bg-white border-border/40 hover:border-primary/20 hover:shadow-md shadow-sm"
      )}
    >
      <button
        onClick={() => onToggle(task.id, !task.completed)}
        className={cn(
          "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
          task.completed
            ? "bg-green-500 border-green-500 text-white"
            : "border-muted-foreground/30 hover:border-primary text-transparent"
        )}
      >
        <Check className="w-3.5 h-3.5" strokeWidth={3} />
      </button>

      <span
        className={cn(
          "flex-grow text-base font-medium transition-all duration-300",
          task.completed ? "text-muted-foreground line-through" : "text-foreground"
        )}
      >
        {task.text}
      </span>

      <button
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-all duration-200"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </motion.div>
  );
});

TaskItem.displayName = "TaskItem";
