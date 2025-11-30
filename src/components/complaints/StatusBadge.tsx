import { cn } from "@/lib/utils";

type Status = 'open' | 'assigned' | 'in_progress' | 'on_hold' | 'resolved' | 'closed';

const statusConfig: Record<Status, { label: string; className: string }> = {
  open: { label: 'Open', className: 'status-open' },
  assigned: { label: 'Assigned', className: 'status-assigned' },
  in_progress: { label: 'In Progress', className: 'status-in-progress' },
  on_hold: { label: 'On Hold', className: 'status-on-hold' },
  resolved: { label: 'Resolved', className: 'status-resolved' },
  closed: { label: 'Closed', className: 'status-closed' },
};

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span className={cn('status-badge', config.className, className)}>
      {config.label}
    </span>
  );
}
