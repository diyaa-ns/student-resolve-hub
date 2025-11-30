import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatusBadge } from "@/components/complaints/StatusBadge";
import { PriorityBadge } from "@/components/complaints/PriorityBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, MapPin, Calendar, Send, Loader2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { formatDistanceToNow, format } from "date-fns";

interface ComplaintDetail {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'assigned' | 'in_progress' | 'on_hold' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  created_at: string;
  location: string | null;
  resolution_notes: string | null;
  mood: string | null;
  category: { name: string } | null;
}

interface Comment { id: string; message: string; created_at: string; user_id: string; }

export default function AdminComplaintDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState<ComplaintDetail | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [status, setStatus] = useState<string>("");
  const [priority, setPriority] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => { if (id) { fetchComplaint(); fetchComments(); } }, [id]);

  const fetchComplaint = async () => {
    try {
      const { data, error } = await supabase.from('complaints').select(`id, title, description, status, priority, created_at, location, resolution_notes, mood, category:categories(name)`).eq('id', id).single();
      if (error) throw error;
      const typedData = { ...data, status: data.status as ComplaintDetail['status'], priority: data.priority as ComplaintDetail['priority'], category: data.category as { name: string } | null };
      setComplaint(typedData);
      setStatus(typedData.status);
      setPriority(typedData.priority);
      setResolutionNotes(typedData.resolution_notes || "");
    } catch (error) { console.error(error); } finally { setLoading(false); }
  };

  const fetchComments = async () => {
    const { data } = await supabase.from('comments').select('id, message, created_at, user_id').eq('complaint_id', id).order('created_at', { ascending: true });
    setComments(data || []);
  };

  const handleUpdateComplaint = async () => {
    setUpdating(true);
    try {
      const updates: Record<string, unknown> = { status, priority, resolution_notes: resolutionNotes.trim() || null, assigned_admin_id: user?.id || null };
      if (status === 'resolved' || status === 'closed') updates.resolved_at = new Date().toISOString();
      const { error } = await supabase.from('complaints').update(updates).eq('id', id);
      if (error) throw error;
      toast.success("Updated"); fetchComplaint();
    } catch (error) { toast.error("Failed"); } finally { setUpdating(false); }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from('comments').insert({ complaint_id: id, user_id: user?.id, message: newComment.trim() });
      if (error) throw error;
      toast.success("Sent"); setNewComment(""); fetchComments();
    } catch (error) { toast.error("Failed"); } finally { setSubmitting(false); }
  };

  if (loading) return <DashboardLayout><div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></DashboardLayout>;
  if (!complaint) return <DashboardLayout><div className="text-center py-12"><h2 className="text-xl font-semibold mb-2">Not found</h2><Button asChild><Link to="/admin/complaints">Back</Link></Button></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <Link to="/admin/complaints" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="w-4 h-4" />Back</Link>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="font-display text-2xl mb-2">{complaint.title}</CardTitle>
                <div className="flex flex-wrap gap-2"><StatusBadge status={complaint.status} /><PriorityBadge priority={complaint.priority} />{complaint.category && <span className="status-badge bg-secondary text-secondary-foreground">{complaint.category.name}</span>}</div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4 text-sm text-muted-foreground"><Calendar className="w-4 h-4" />{formatDistanceToNow(new Date(complaint.created_at), { addSuffix: true })}{complaint.location && <><MapPin className="w-4 h-4 ml-4" />{complaint.location}</>}</div>
                <div><h3 className="font-semibold mb-2">Description</h3><p className="text-muted-foreground whitespace-pre-wrap">{complaint.description}</p></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-lg">Messages</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {comments.length===0?<p className="text-center text-muted-foreground py-4">No messages</p>:<div className="space-y-4 max-h-96 overflow-y-auto">{comments.map(c=><div key={c.id} className={`p-4 rounded-xl ${c.user_id===user?.id?'bg-primary/10 ml-8':'bg-secondary mr-8'}`}><p className="text-sm">{c.message}</p><span className="text-xs text-muted-foreground">{format(new Date(c.created_at),'MMM d, h:mm a')}</span></div>)}</div>}
                <div className="flex gap-2 pt-4 border-t"><Textarea placeholder="Message..." value={newComment} onChange={e=>setNewComment(e.target.value)} rows={2} className="flex-1"/><Button onClick={handleSubmitComment} disabled={!newComment.trim()||submitting} size="icon" className="self-end">{submitting?<Loader2 className="w-4 h-4 animate-spin"/>:<Send className="w-4 h-4"/>}</Button></div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader><CardTitle className="text-lg">Update</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2"><label className="text-sm font-medium">Status</label><Select value={status} onValueChange={setStatus}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="open">Open</SelectItem><SelectItem value="assigned">Assigned</SelectItem><SelectItem value="in_progress">In Progress</SelectItem><SelectItem value="on_hold">On Hold</SelectItem><SelectItem value="resolved">Resolved</SelectItem><SelectItem value="closed">Closed</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><label className="text-sm font-medium">Priority</label><Select value={priority} onValueChange={setPriority}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="low">Low</SelectItem><SelectItem value="medium">Medium</SelectItem><SelectItem value="high">High</SelectItem><SelectItem value="urgent">Urgent</SelectItem></SelectContent></Select></div>
              <div className="space-y-2"><label className="text-sm font-medium">Resolution Notes</label><Textarea placeholder="Notes..." value={resolutionNotes} onChange={e=>setResolutionNotes(e.target.value)} rows={4}/></div>
              <Button onClick={handleUpdateComplaint} disabled={updating} className="w-full">{updating?<><Loader2 className="w-4 h-4 mr-2 animate-spin"/>Saving...</>:<><Save className="w-4 h-4 mr-2"/>Save</>}</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
