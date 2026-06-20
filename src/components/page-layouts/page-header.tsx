"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuthStore } from "@/store/auth-store";
import { useLogout } from "@/hooks/auth/use-logout";
import { ROUTES } from "@/utils/constants";
import { LogOut } from "lucide-react";

export function PageHeader() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const { mutate: logout, isPending: isLoggingOut } = useLogout();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="w-full">
            <div className="container flex h-16 items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-1">
                    <span className="text-xl lg:text-2xl font-bold tracking-tight text-foreground">
                        Aero<span className="text-primary">Fly</span>
                    </span>
                </Link>

                {/* Auth actions */}
                {isAuthenticated ? (
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild className="rounded-full! px-6!">
                            <Link href={ROUTES.DASHBOARD}>Dashboard</Link>
                        </Button>
                        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="h-9 gap-1! px-5! rounded-full border-slate-200 bg-white/80 text-sm font-medium hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900/80 dark:hover:bg-slate-800"
                                    disabled={isLoggingOut}
                                >
                                    <LogOut className="size-4" />
                                    {isLoggingOut ? "Signing out..." : "Sign out"}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Sign out</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Are you sure you want to sign out? You will need to log in again to access your account.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => logout()}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        Sign out
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                ) : (
                    <Button asChild className="rounded-full px-6! pb-2.5!">
                        <Link href={ROUTES.LOGIN} className="inline-block">Sign In</Link>
                    </Button>
                )}
            </div>
        </header>
    );
}
