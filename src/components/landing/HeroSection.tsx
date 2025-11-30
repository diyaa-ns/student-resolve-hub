import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-hero-bg opacity-5" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
      </div>

      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 animate-fade-in">
            <Shield className="w-4 h-4" />
            <span>Trusted by 50+ Institutions</span>
          </div>

          {/* Main heading */}
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-slide-up">
            Smart Complaint
            <span className="block gradient-text">Management System</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Transform how your institution handles student concerns with AI-powered categorization, 
            real-time tracking, and actionable insights.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Button asChild size="xl" variant="gradient">
              <Link to="/auth">
                Get Started
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button asChild size="xl" variant="outline">
              <Link to="/auth?mode=login">
                Sign In
              </Link>
            </Button>
          </div>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="glass-card rounded-2xl p-6 text-left hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">AI-Powered</h3>
              <p className="text-muted-foreground text-sm">
                Auto-categorize complaints with smart priority detection
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 text-left hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">Real-time Tracking</h3>
              <p className="text-muted-foreground text-sm">
                Track complaints like delivery apps with live status updates
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 text-left hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-status-resolved/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-status-resolved" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">Smart Analytics</h3>
              <p className="text-muted-foreground text-sm">
                Data-driven insights to identify and resolve issues faster
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
