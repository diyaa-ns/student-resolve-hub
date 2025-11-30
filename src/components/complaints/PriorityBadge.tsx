import { cn } from "@/lib/utils";

type Priority = 'low' | 'medium' | 'high' | 'urgent';

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  low: { label: 'Low', className: 'priority-low' },
  medium: { label: 'Medium', className: 'priority-medium' },
  high: { label: 'High', className: 'priority-high' },
  urgent: { label: 'Urgent', className: 'priority-urgent' },
};

interface PriorityBadgeProps {
  priority: Priority;
  className?: string;
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const config = priorityConfig[priority];
  
  return (
    <span className={cn('status-badge', config.className, className)}>
      {config.label}
    </span>
  );
}
