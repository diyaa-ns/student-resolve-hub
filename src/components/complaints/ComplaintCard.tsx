import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Clock, MapPin } from "lucide-react";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface ComplaintCardProps {
  complaint: {
    id: string;
    title: string;
    description: string;
    status: 'open' | 'assigned' | 'in_progress' | 'on_hold' | 'resolved' | 'closed';
    priority: 'low' | 'medium' | 'high' | 'urgent';
    created_at: string;
    location?: string | null;
    category?: { name: string } | null;
  };
  linkPrefix?: string;
}

export function ComplaintCard({ complaint, linkPrefix = '/dashboard/complaints' }: ComplaintCardProps) {
  return (
    <Link to={`${linkPrefix}/${complaint.id}`}>
      <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-semibold text-lg truncate">{complaint.title}</h3>
              {complaint.category && (
                <span className="text-xs text-muted-foreground">{complaint.category.name}</span>
              )}
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <PriorityBadge priority={complaint.priority} />
              <StatusBadge status={complaint.status} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {complaint.description}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formatDistanceToNow(new Date(complaint.created_at), { addSuffix: true })}
            </div>
            {complaint.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {complaint.location}
              </div>
            )}
            <div className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5" />
              0 comments
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
