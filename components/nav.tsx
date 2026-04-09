"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  Package,
  BookOpen,
  PlusCircle,
  User,
  LogOut,
  Shield,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

function getInitials(name: string | null | undefined) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function Nav() {
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = session?.user;
  const isAdmin = (user as { role?: string } | undefined)?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="font-heading text-xl font-semibold tracking-tight text-primary">
            Lendly
          </span>
        </Link>

        {/* Desktop nav links */}
        <nav className="hidden items-center gap-1 md:flex">
          <Button variant="ghost" size="sm" render={<Link href="/catalog" />}>
            <Package data-icon="inline-start" className="size-4" />
            Catalog
          </Button>
          {user && (
            <>
              <Button variant="ghost" size="sm" render={<Link href="/loans" />}>
                <BookOpen data-icon="inline-start" className="size-4" />
                My Loans
              </Button>
              <Button variant="ghost" size="sm" render={<Link href="/items/new" />}>
                <PlusCircle data-icon="inline-start" className="size-4" />
                List an Item
              </Button>
            </>
          )}
        </nav>

        {/* Desktop right side */}
        <div className="hidden items-center gap-2 md:flex">
          {status === "loading" && (
            <div className="h-8 w-20 animate-pulse rounded-lg bg-muted" />
          )}

          {status === "unauthenticated" && (
            <Button variant="default" size="sm" render={<Link href="/login" />}>
              Sign In
            </Button>
          )}

          {status === "authenticated" && user && (
            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                <Avatar size="default">
                  {user.image && (
                    <AvatarImage src={user.image} alt={user.name ?? "User"} />
                  )}
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" sideOffset={8}>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem render={<Link href="/loans" />}>
                  <BookOpen className="size-4" />
                  My Loans
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/listings" />}>
                  <Package className="size-4" />
                  My Listings
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem render={<Link href="/admin" />}>
                    <Shield className="size-4" />
                    Admin Dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOut className="size-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Mobile hamburger */}
        <div className="flex md:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger render={<Button variant="ghost" size="icon" />}>
              {mobileOpen ? (
                <X className="size-5" />
              ) : (
                <Menu className="size-5" />
              )}
              <span className="sr-only">Toggle menu</span>
            </SheetTrigger>
            <SheetContent side="right" showCloseButton={false}>
              <SheetHeader>
                <SheetTitle className="font-heading text-lg text-primary">
                  Lendly
                </SheetTitle>
              </SheetHeader>

              <nav className="flex flex-col gap-1 px-2 pt-4">
                <Link
                  href="/catalog"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
                  onClick={() => setMobileOpen(false)}
                >
                  <Package className="size-4" />
                  Catalog
                </Link>

                {user && (
                  <>
                    <Link
                      href="/loans"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
                      onClick={() => setMobileOpen(false)}
                    >
                      <BookOpen className="size-4" />
                      My Loans
                    </Link>
                    <Link
                      href="/items/new"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
                      onClick={() => setMobileOpen(false)}
                    >
                      <PlusCircle className="size-4" />
                      List an Item
                    </Link>
                    <Link
                      href="/listings"
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
                      onClick={() => setMobileOpen(false)}
                    >
                      <Package className="size-4" />
                      My Listings
                    </Link>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-muted"
                        onClick={() => setMobileOpen(false)}
                      >
                        <Shield className="size-4" />
                        Admin Dashboard
                      </Link>
                    )}
                  </>
                )}

                <div className="my-2 border-t border-border" />

                {status === "unauthenticated" && (
                  <Link
                    href="/login"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-primary hover:bg-muted"
                    onClick={() => setMobileOpen(false)}
                  >
                    <User className="size-4" />
                    Sign In
                  </Link>
                )}

                {status === "authenticated" && user && (
                  <>
                    <div className="flex items-center gap-3 px-3 py-2">
                      <Avatar size="sm">
                        {user.image && (
                          <AvatarImage
                            src={user.image}
                            alt={user.name ?? "User"}
                          />
                        )}
                        <AvatarFallback>
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {user.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {user.email}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
                    >
                      <LogOut className="size-4" />
                      Sign Out
                    </button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
