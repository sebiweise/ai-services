"use client"

import { useEffect, useState } from "react"

import {
    GearIcon,
    PersonIcon,
} from "@radix-ui/react-icons"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import { SignedIn } from "@clerk/nextjs"
import { LogOutIcon, SearchIcon } from "lucide-react"
import SignOutButton from "../auth/sign-out-button"

export function CommandMenu() {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <CommandInput placeholder="Type a command or search..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                    <CommandItem>
                        <SearchIcon className="mr-2 h-4 w-4" />
                        <span>Search</span>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Settings">
                    <SignedIn>
                        <CommandItem>
                            <PersonIcon className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </CommandItem>
                        <CommandItem>
                            <GearIcon className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                        </CommandItem>
                    </SignedIn>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    )
}
