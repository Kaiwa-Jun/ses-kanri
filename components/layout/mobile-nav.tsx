"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Briefcase, BarChart2, Users, User, Calendar, FileText, Home,
  FileEdit, Bell, Building2, Shield
} from "lucide-react";

type MobileNavProps = {
  role: "sales" | "engineer";
};

type NavItem = {
  title: string;
  href: string;
  icon: React.ReactNode;
};

export function MobileNav({ role }: MobileNavProps) {
  const pathname = usePathname();
  
  const salesNavItems: NavItem[] = [
    {
      title: "ホーム",
      href: "/sales/dashboard",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "案件",
      href: "/sales/projects",
      icon: <Briefcase className="h-5 w-5" />,
    },
    {
      title: "クライアント",
      href: "/sales/clients",
      icon: <Building2 className="h-5 w-5" />,
    },
    {
      title: "通知",
      href: "/sales/notifications",
      icon: <Bell className="h-5 w-5" />,
    },
  ];

  const engineerNavItems: NavItem[] = [
    {
      title: "ホーム",
      href: "/engineer/dashboard",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "報告",
      href: "/engineer/reports",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      title: "スキル",
      href: "/engineer/skills",
      icon: <BarChart2 className="h-5 w-5" />,
    },
    {
      title: "通知",
      href: "/engineer/notifications",
      icon: <Bell className="h-5 w-5" />,
    },
  ];

  const navItems = role === "sales" ?  salesNavItems : engineerNavItems;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-background z-50">
      <div className="grid grid-cols-4 h-16">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 text-xs font-medium",
              pathname === item.href
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            {item.icon}
            <span>{item.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}