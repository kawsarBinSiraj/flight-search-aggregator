import { PageHeader } from "@/components/page-layouts/page-header";
import { PageFooter } from "@/components/page-layouts/page-footer";

export default function WebsiteLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col">
            <div className="w-full border-b border-gray-300 z-10 bg-background/10 backdrop-blur-md">
                <PageHeader />
            </div>
            <main className="relative min-h-screen flex-1 overflow-x-clip px-4 py-6 pt-12">
                <div className="pointer-events-none fixed inset-0 h-screen bg-[radial-gradient(circle_at_top,#fff7ed_0%,#ffedd5_26%,#fff_64%)] dark:bg-[radial-gradient(circle_at_top,#1f2937_0%,#111827_35%,#030712_72%)]" />
                <div className="pointer-events-none absolute -left-24 top-8 h-64 w-64 rounded-full bg-amber-100/35 blur-3xl dark:bg-amber-300/20" />
                <div className="pointer-events-none absolute -right-16 bottom-10 h-72 w-72 rounded-full bg-sky-300/35 blur-3xl dark:bg-sky-500/20" />
                <div className="relative">
                    {children}
                </div>
            </main>
            <PageFooter />
        </div>
    );
}
