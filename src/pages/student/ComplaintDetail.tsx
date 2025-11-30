import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProgressTracker } from "@/components/complaints/ProgressTracker";
import { StatusBadge } from "@/components/complaints/StatusBadge";
import { PriorityBadge } from "@/components/complaints/PriorityBadge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, MapPin, Calendar, User, Send, Loader2, Star } from "lucide-react";
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
  updated_at: string;
  location: string | null;
  resolution_notes: string | null;
  category: { name: string } | null;
}

interface Comment {
  id: string;
  message: string;
  created_at: string;
  user_id: string;
}

export default function ComplaintDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState<ComplaintDetail | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [hasRated, setHasRated] = useState(false);

  useEffect(() => {
    if (id) {
      fetchComplaint();
      fetchComments();
      checkRating();
    }
  }, [id]);

  const fetchComplaint = async () => {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select(`
          id, title, description, status, priority, created_at, updated_at, location, resolution_notes,
          category:categories(name)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      setComplaint({
        ...data,
        status: data.status as ComplaintDetail['status'],
        priority: data.priority as ComplaintDetail['priority'],
        category: data.category as { name: string } | null
      });
    } catch (error) {
      console.error('Error fetching complaint:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('id, message, created_at, user_id')
        .eq('complaint_id', id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const checkRating = async () => {
    const { data } = await supabase
      .from('ratings')
      .select('rating, feedback')
      .eq('complaint_id', id)
      .single();

    if (data) {
      setRating(data.rating);
      setFeedback(data.feedback || '');
      setHasRated(true);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const { error } = await supabase.from('comments').insert({
        complaint_id: id,
        user_id: user?.id,
        message: newComment.trim()
      });
      if (error) throw error;
      toast.success("Comment added");
      setNewComment("");
      fetchComments();
    } catch (error) {
      toast.error("Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitRating = async () => {
    if (rating === 0) return;
    try {
      const { error } = await supabase.from('ratings').insert({
        complaint_id: id,
        student_id: user?.id,
        rating,
        feedback: feedback.trim() || null
      });
      if (error) throw error;
      toast.success("Thank you for your feedback!");
      setHasRated(true);
    } catch (error) {
      toast.error("Failed to submit rating");
    }
  };

  if (loading) {
    return <DashboardLayout><div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div></DashboardLayout>;
  }

  if (!complaint) {
    return <DashboardLayout><div className="text-center py-12"><h2 className="text-xl font-semibold mb-2">Complaint not found</h2><Button asChild><Link to="/dashboard/complaints">Back</Link></Button></div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <Link to="/dashboard/complaints" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="w-4 h-4" />Back</Link>
        <Card>
          <CardHeader>
            <CardTitle className="font-display text-2xl mb-2">{complaint.title}</CardTitle>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={complaint.status} />
              <PriorityBadge priority={complaint.priority} />
              {complaint.category && <span className="status-badge bg-secondary text-secondary-foreground">{complaint.category.name}</span>}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <ProgressTracker currentStatus={complaint.status} />
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="w-4 h-4" />{formatDistanceToNow(new Date(complaint.created_at), { addSuffix: true })}</div>
              {complaint.location && <div className="flex items-center gap-2 text-muted-foreground"><MapPin className="w-4 h-4" />{complaint.location}</div>}
            </div>
            <div><h3 className="font-semibold mb-2">Description</h3><p className="text-muted-foreground whitespace-pre-wrap">{complaint.description}</p></div>
            {complaint.resolution_notes && <div className="p-4 rounded-xl bg-green-100 border border-green-200"><h3 className="font-semibold mb-2 text-green-700">Resolution</h3><p className="text-muted-foreground">{complaint.resolution_notes}</p></div>}
          </CardContent>
        </Card>

        {(complaint.status === 'resolved' || complaint.status === 'closed') && (
          <Card>
            <CardHeader><CardTitle className="text-lg">Rate this resolution</CardTitle></CardHeader>
            <CardContent>
              {hasRated ? <div className="text-center py-4"><div className="flex justify-center gap-1 mb-2">{[1,2,3,4,5].map(s=><Star key={s} className={`w-8 h-8 ${s<=rating?'fill-yellow-400 text-yellow-400':'text-muted'}`}/>)}</div><p className="text-muted-foreground">Thanks!</p></div> : (
                <div className="space-y-4">
                  <div className="flex justify-center gap-2">{[1,2,3,4,5].map(s=><button key={s} onClick={()=>setRating(s)}><Star className={`w-10 h-10 ${s<=rating?'fill-yellow-400 text-yellow-400':'text-muted hover:text-yellow-300'}`}/></button>)}</div>
                  <Textarea placeholder="Feedback (optional)" value={feedback} onChange={e=>setFeedback(e.target.value)} rows={3}/>
                  <Button onClick={handleSubmitRating} disabled={rating===0} className="w-full">Submit</Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader><CardTitle className="text-lg">Messages</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {comments.length===0?<p className="text-center text-muted-foreground py-4">No messages</p>:(
              <div className="space-y-4">{comments.map(c=><div key={c.id} className={`p-4 rounded-xl ${c.user_id===user?.id?'bg-primary/10 ml-8':'bg-secondary mr-8'}`}><p className="text-sm">{c.message}</p><span className="text-xs text-muted-foreground">{format(new Date(c.created_at),'MMM d, h:mm a')}</span></div>)}</div>
            )}
            <div className="flex gap-2 pt-4 border-t">
              <Textarea placeholder="Type a message..." value={newComment} onChange={e=>setNewComment(e.target.value)} rows={2} className="flex-1"/>
              <Button onClick={handleSubmitComment} disabled={!newComment.trim()||submitting} size="icon" className="self-end">{submitting?<Loader2 className="w-4 h-4 animate-spin"/>:<Send className="w-4 h-4"/>}</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
