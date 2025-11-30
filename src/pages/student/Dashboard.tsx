import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ComplaintCard } from "@/components/complaints/ComplaintCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

interface Complaint {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'assigned' | 'in_progress' | 'on_hold' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  location: string | null;
  category: { name: string } | null;
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    urgent: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchComplaints();
    }
  }, [user]);

  const fetchComplaints = async () => {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select(`
          id,
          title,
          description,
          status,
          priority,
          created_at,
          location,
          category:categories(name)
        `)
        .eq('student_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;

      const typedData = (data || []).map(item => ({
        ...item,
        status: item.status as Complaint['status'],
        priority: item.priority as Complaint['priority'],
        category: item.category as { name: string } | null
      }));

      setComplaints(typedData);

      // Fetch stats
      const { data: allComplaints } = await supabase
        .from('complaints')
        .select('status, priority')
        .eq('student_id', user?.id);

      if (allComplaints) {
        setStats({
          total: allComplaints.length,
          pending: allComplaints.filter(c => ['open', 'assigned', 'in_progress'].includes(c.status)).length,
          resolved: allComplaints.filter(c => ['resolved', 'closed'].includes(c.status)).length,
          urgent: allComplaints.filter(c => c.priority === 'urgent').length
        });
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">Welcome Back!</h1>
            <p className="text-muted-foreground">Track and manage your complaints</p>
          </div>
          <Button asChild variant="gradient">
            <Link to="/dashboard/new-complaint">
              <Plus className="w-4 h-4 mr-2" />
              New Complaint
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Complaints</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-status-in-progress/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-status-in-progress" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-status-resolved/10 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-status-resolved" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.resolved}</p>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-priority-urgent/10 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-priority-urgent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.urgent}</p>
                  <p className="text-sm text-muted-foreground">Urgent</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Complaints */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl font-semibold">Recent Complaints</h2>
            <Button variant="ghost" asChild>
              <Link to="/dashboard/complaints">View All</Link>
            </Button>
          </div>

          {loading ? (
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="h-32" />
                </Card>
              ))}
            </div>
          ) : complaints.length > 0 ? (
            <div className="grid gap-4">
              {complaints.map((complaint) => (
                <ComplaintCard key={complaint.id} complaint={complaint} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No complaints yet</h3>
                <p className="text-muted-foreground mb-4">
                  Submit your first complaint to get started
                </p>
                <Button asChild>
                  <Link to="/dashboard/new-complaint">
                    <Plus className="w-4 h-4 mr-2" />
                    New Complaint
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
