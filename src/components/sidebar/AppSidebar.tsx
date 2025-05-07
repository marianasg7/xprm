
import { useLocation, NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  UserMinus,
  Film,
  CreditCard,
  BarChart3,
  Settings,
  Package,
  MessagesSquare,
  Lightbulb
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
}

export function AppSidebar() {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const links = [
    { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard" },
    { icon: User, label: "Subscribers", to: "/subscribers" },
    { icon: UserMinus, label: "Non-Subscribers", to: "/non-subscribers" },
    { icon: Film, label: "Castings", to: "/castings" },
    { icon: Package, label: "Plans", to: "/plans" },
    { icon: CreditCard, label: "Sales", to: "/sales" },
    { icon: MessagesSquare, label: "Telegram", to: "/telegram" },
    { icon: Lightbulb, label: "Projects", to: "/projects" },
    { icon: BarChart3, label: "Analytics", to: "/analytics" },
    { icon: Settings, label: "Settings", to: "/settings" },
  ];

  return (
    <div className="bg-background border-r w-64 flex flex-col p-4 overflow-y-auto">
      <div className="h-14 flex items-center px-4">
        <h2 className="text-lg font-bold">Content Manager</h2>
      </div>

      <nav className="space-y-2 mt-6 flex-1">
        {links.map((item) => (
          <SidebarItem
            key={item.to}
            icon={item.icon}
            label={item.label}
            to={item.to}
          />
        ))}
      </nav>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, to }: SidebarItemProps) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-4 px-4 py-2 rounded-md text-sm transition-colors",
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-accent"
        )
      }
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </NavLink>
  );
}
