import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

interface UserWithRole { id: string; user_id: string; email: string; full_name: string; created_at: string; role: string; }

export default function ManageUsers() {
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    const { data: profiles } = await supabase.from('profiles').select('id, user_id, email, full_name, created_at');
    const { data: roles } = await supabase.from('user_roles').select('user_id, role');
    const roleMap = new Map(roles?.map(r => [r.user_id, r.role]) || []);
    setUsers((profiles || []).map(p => ({ ...p, role: roleMap.get(p.user_id) || 'student' })));
    setLoading(false);
  };

  const updateRole = async (userId: string, newRole: string) => {
    try {
      await supabase.from('user_roles').update({ role: newRole }).eq('user_id', userId);
      toast.success("Role updated");
      fetchUsers();
    } catch { toast.error("Failed to update role"); }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div><h1 className="font-display text-3xl font-bold">Manage Users</h1><p className="text-muted-foreground">View and manage user roles</p></div>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Joined</TableHead><TableHead>Role</TableHead></TableRow></TableHeader>
              <TableBody>
                {loading ? <TableRow><TableCell colSpan={4} className="text-center py-8">Loading...</TableCell></TableRow> : users.map(u => (
                  <TableRow key={u.id}>
                    <TableCell className="font-medium">{u.full_name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{format(new Date(u.created_at), 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      <Select value={u.role} onValueChange={v => updateRole(u.user_id, v)}>
                        <SelectTrigger className="w-32"><SelectValue/></SelectTrigger>
                        <SelectContent><SelectItem value="student">Student</SelectItem><SelectItem value="admin">Admin</SelectItem><SelectItem value="super_admin">Super Admin</SelectItem></SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
