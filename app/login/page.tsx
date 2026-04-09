"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
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
  const [loadingGoogle, setLoadingGoogle] = useState(false);

  function handleDemoLogin(email: string) {
    setLoadingEmail(email);
    signIn("credentials", {
      email,
      redirect: true,
      callbackUrl: "/catalog",
    });
  }

  function handleGoogleLogin() {
    setLoadingGoogle(true);
    signIn("google");
  }

  const isLoading = loadingEmail !== null || loadingGoogle;

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

        {/* Google sign-in */}
        <Button
          variant="outline"
          size="lg"
          className="w-full gap-2"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          {loadingGoogle ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <svg className="size-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          )}
          Sign in with Google
        </Button>

        {/* Separator */}
        <div className="flex items-center gap-4">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">
            or try a demo account
          </span>
          <Separator className="flex-1" />
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
