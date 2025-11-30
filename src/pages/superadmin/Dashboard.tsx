import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, FileText, CheckCircle, AlertTriangle, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalComplaints: 0, resolved: 0, admins: 0 });

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    const [{ count: users }, { count: complaints }, { data: resolvedData }, { data: adminsData }] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('complaints').select('*', { count: 'exact', head: true }),
      supabase.from('complaints').select('id').in('status', ['resolved', 'closed']),
      supabase.from('user_roles').select('id').eq('role', 'admin')
    ]);
    setStats({ totalUsers: users || 0, totalComplaints: complaints || 0, resolved: resolvedData?.length || 0, admins: adminsData?.length || 0 });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div><h1 className="font-display text-3xl font-bold">Super Admin Dashboard</h1><p className="text-muted-foreground">System overview and management</p></div>
          <Button asChild><Link to="/super-admin/users"><Plus className="w-4 h-4 mr-2"/>Manage Users</Link></Button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card><CardContent className="pt-6"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><Users className="w-6 h-6 text-primary"/></div><div><p className="text-2xl font-bold">{stats.totalUsers}</p><p className="text-sm text-muted-foreground">Total Users</p></div></div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center"><FileText className="w-6 h-6 text-accent"/></div><div><p className="text-2xl font-bold">{stats.totalComplaints}</p><p className="text-sm text-muted-foreground">Complaints</p></div></div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center"><CheckCircle className="w-6 h-6 text-green-500"/></div><div><p className="text-2xl font-bold">{stats.resolved}</p><p className="text-sm text-muted-foreground">Resolved</p></div></div></CardContent></Card>
          <Card><CardContent className="pt-6"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center"><AlertTriangle className="w-6 h-6 text-orange-500"/></div><div><p className="text-2xl font-bold">{stats.admins}</p><p className="text-sm text-muted-foreground">Admins</p></div></div></CardContent></Card>
        </div>
        <Card><CardHeader><CardTitle>Quick Actions</CardTitle></CardHeader><CardContent className="flex gap-4 flex-wrap"><Button asChild variant="outline"><Link to="/super-admin/users">Manage Users</Link></Button><Button asChild variant="outline"><Link to="/super-admin/analytics">View Analytics</Link></Button></CardContent></Card>
      </div>
    </DashboardLayout>
  );
}
