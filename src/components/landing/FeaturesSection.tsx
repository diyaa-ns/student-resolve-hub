import { 
  MessageSquare, 
  Bell, 
  Users, 
  BarChart2, 
  QrCode, 
  Map, 
  Kanban, 
  Languages,
  Star,
  Clock,
  ArrowUpRight
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Internal Chat System",
    description: "Direct messaging between students and admins per complaint with attachment support"
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description: "Real-time email and push notifications for status updates and escalations"
  },
  {
    icon: Clock,
    title: "Auto Escalation",
    description: "Automatic escalation if complaints aren't addressed within set timeframes"
  },
  {
    icon: Users,
    title: "Role-Based Access",
    description: "Separate dashboards for students, admins, and super administrators"
  },
  {
    icon: BarChart2,
    title: "Analytics Dashboard",
    description: "Comprehensive analytics with heatmaps and performance metrics"
  },
  {
    icon: QrCode,
    title: "QR Code Scanning",
    description: "Place QR codes across campus for instant location-based reporting"
  },
  {
    icon: Map,
    title: "Location Tagging",
    description: "Pin complaint locations on campus map for better tracking"
  },
  {
    icon: Kanban,
    title: "Kanban Board",
    description: "Trello-style board for admins to manage and organize complaints"
  },
  {
    icon: Languages,
    title: "Multi-Language",
    description: "Support for multiple languages including English, Hindi, and regional languages"
  },
  {
    icon: Star,
    title: "Feedback System",
    description: "Rating and feedback collection after complaint resolution"
  },
  {
    icon: ArrowUpRight,
    title: "Live Status Tracking",
    description: "Track complaints like food delivery with real-time stage updates"
  }
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-secondary/30">
      <div className="container px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Powerful Features for
            <span className="gradient-text"> Modern Institutions</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage student complaints efficiently and transparently
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={feature.title}
              className="glass-card rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
