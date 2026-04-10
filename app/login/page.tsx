"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";

const demoUsers = [
  {
    name: "Sophie Martin",
    email: "sophie@lendly.demo",
    role: "Admin",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Sophie",
  },
  {
    name: "James Chen",
    email: "james@lendly.demo",
    role: "Member",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=James",
  },
  {
    name: "Priya Sharma",
    email: "priya@lendly.demo",
    role: "Member",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Priya",
  },
  {
    name: "Marcus Johnson",
    email: "marcus@lendly.demo",
    role: "Member",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Marcus",
  },
  {
    name: "Ava Tremblay",
    email: "ava@lendly.demo",
    role: "Member",
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Ava",
  },
];

export default function LoginPage() {
  const [loadingEmail, setLoadingEmail] = useState<string | null>(null);

  function handleDemoLogin(email: string) {
    setLoadingEmail(email);
    signIn("credentials", {
      email,
      redirect: true,
      callbackUrl: "/catalog",
    });
  }

  const isLoading = loadingEmail !== null;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg space-y-8">
        {/* Branding */}
        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold text-primary">
            Lendly
          </h1>
          <p className="mt-2 text-muted-foreground">
            Sign in to borrow, share, and connect with your neighbours
          </p>
        </div>

        {/* Demo profile heading */}
        <div className="text-center">
          <p className="text-sm font-medium text-foreground">
            Choose a demo profile to get started
          </p>
        </div>

        {/* Demo users */}
        <div className="grid gap-3 sm:grid-cols-2">
          {demoUsers.map((user) => (
            <button
              key={user.email}
              type="button"
              onClick={() => handleDemoLogin(user.email)}
              disabled={isLoading}
              className="w-full text-left disabled:opacity-50"
            >
              <Card className="cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                <CardContent className="flex items-center gap-3">
                  {loadingEmail === user.email ? (
                    <div className="flex size-8 shrink-0 items-center justify-center">
                      <Loader2 className="size-5 animate-spin text-primary" />
                    </div>
                  ) : (
                    <Avatar>
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-medium">
                        {user.name}
                      </span>
                      <Badge
                        variant={
                          user.role === "Admin" ? "default" : "secondary"
                        }
                      >
                        {user.role}
                      </Badge>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
