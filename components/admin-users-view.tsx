"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import { ShieldCheck, Ban, ShieldOff } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface UserData {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
  suspended: boolean;
  createdAt: string;
  _count: {
    ownedItems: number;
    borrowedLoans: number;
  };
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function AdminUsersView({ users }: { users: UserData[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleAction(
    userId: string,
    action: "promote" | "suspend" | "unsuspend"
  ) {
    setLoadingId(userId);
    try {
      const body: Record<string, unknown> = {};
      if (action === "promote") body.role = "ADMIN";
      if (action === "suspend") body.suspended = true;
      if (action === "unsuspend") body.suspended = false;

      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Action failed");
      }

      const labels = {
        promote: "User promoted to Admin",
        suspend: "User suspended",
        unsuspend: "User unsuspended",
      };
      toast.success(labels[action]);
      router.refresh();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Member Since</TableHead>
          <TableHead>Items</TableHead>
          <TableHead>Active Borrows</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => {
          const isLoading = loadingId === user.id;
          return (
            <TableRow
              key={user.id}
              className={user.suspended ? "opacity-60" : ""}
            >
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar size="sm">
                    {user.image && (
                      <AvatarImage src={user.image} alt={user.name} />
                    )}
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{user.name}</span>
                  {user.suspended && (
                    <Badge variant="destructive" className="text-[10px]">
                      Suspended
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {user.email}
              </TableCell>
              <TableCell>
                <Badge
                  variant={user.role === "ADMIN" ? "default" : "secondary"}
                >
                  {user.role}
                </Badge>
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {format(new Date(user.createdAt), "MMM d, yyyy")}
              </TableCell>
              <TableCell className="text-sm">
                {user._count.ownedItems}
              </TableCell>
              <TableCell className="text-sm">
                {user._count.borrowedLoans}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  {user.role === "MEMBER" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction(user.id, "promote")}
                      disabled={isLoading}
                    >
                      <ShieldCheck className="size-3.5" />
                      Promote
                    </Button>
                  )}
                  {user.suspended ? (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction(user.id, "unsuspend")}
                      disabled={isLoading}
                    >
                      <ShieldOff className="size-3.5" />
                      Unsuspend
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleAction(user.id, "suspend")}
                      disabled={isLoading}
                    >
                      <Ban className="size-3.5" />
                      Suspend
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
