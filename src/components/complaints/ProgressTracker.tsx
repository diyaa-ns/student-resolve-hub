import { cn } from "@/lib/utils";
import { Check, Circle } from "lucide-react";

type Status = 'open' | 'assigned' | 'in_progress' | 'on_hold' | 'resolved' | 'closed';

const stages: { status: Status; label: string }[] = [
  { status: 'open', label: 'Filed' },
  { status: 'assigned', label: 'Assigned' },
  { status: 'in_progress', label: 'In Progress' },
  { status: 'resolved', label: 'Resolved' },
];

interface ProgressTrackerProps {
  currentStatus: Status;
}

export function ProgressTracker({ currentStatus }: ProgressTrackerProps) {
  const statusOrder: Record<Status, number> = {
    open: 0,
    assigned: 1,
    in_progress: 2,
    on_hold: 2,
    resolved: 3,
    closed: 4,
  };

  const currentIndex = statusOrder[currentStatus];

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {stages.map((stage, index) => {
          const isCompleted = currentIndex > index;
          const isCurrent = currentIndex === index;
          
          return (
            <div key={stage.status} className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                {index > 0 && (
                  <div 
                    className={cn(
                      "h-1 flex-1 rounded-full transition-colors",
                      isCompleted ? "bg-status-resolved" : "bg-border"
                    )}
                  />
                )}
                <div 
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all",
                    isCompleted && "bg-status-resolved border-status-resolved",
                    isCurrent && "border-primary bg-primary/10",
                    !isCompleted && !isCurrent && "border-border bg-background"
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 text-primary-foreground" />
                  ) : (
                    <Circle className={cn(
                      "w-3 h-3",
                      isCurrent ? "fill-primary text-primary" : "fill-muted text-muted"
                    )} />
                  )}
                </div>
                {index < stages.length - 1 && (
                  <div 
                    className={cn(
                      "h-1 flex-1 rounded-full transition-colors",
                      currentIndex > index ? "bg-status-resolved" : "bg-border"
                    )}
                  />
                )}
              </div>
              <span className={cn(
                "mt-2 text-xs font-medium text-center",
                isCurrent ? "text-primary" : "text-muted-foreground"
              )}>
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
