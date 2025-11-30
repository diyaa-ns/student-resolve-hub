export default function Header() {
  return (
    <header className="w-full py-4 border-b border-border bg-card">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-lg font-semibold">Student Resolve Hub</div>
        <nav>
          <a className="mr-4 text-muted-foreground" href="#">Home</a>
          <a className="text-muted-foreground" href="#">Dashboard</a>
        </nav>
      </div>
    </header>
  );
}
