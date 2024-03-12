import Link from "next/link"

import { cn } from "@/lib/utils"
import { SignedIn } from "@clerk/nextjs"

export function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>) {
    return (
        <nav
            className={cn("flex items-center space-x-4 lg:space-x-6", className)}
            {...props}
        >
            <Link
                href="/"
                className="text-sm font-medium transition-colors hover:text-primary"
            >
                Overview
            </Link>
            <Link
                href="/vendor"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
                Vendors
            </Link>
            <Link
                href="/model"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
                Models
            </Link>
            <SignedIn>
                <Link
                    href="/leap/overview"
                    className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                    Leap AI
                </Link>
            </SignedIn>
        </nav>
    )
}