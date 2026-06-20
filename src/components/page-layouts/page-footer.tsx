import Link from "next/link";

export function PageFooter() {
    return (
        <footer className="border-t border-border/50 bg-background/50 backdrop-blur-md">
            <div className="container flex items-center justify-center gap-4 py-6 sm:flex-row">
                <div className="flex items-center justify-center gap-1">
                    <span className="text-lg font-bold tracking-tight text-foreground">
                        Aero<span className="text-primary">Fly</span>
                    </span>
                </div>
                <p className="text-xs text-muted-foreground">
                    &copy; {new Date().getFullYear()} AeroFly. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
