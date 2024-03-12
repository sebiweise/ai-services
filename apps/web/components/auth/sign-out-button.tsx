import { SignOutButton as ClerkSignOutButton } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { LogOutIcon } from "lucide-react";

export default function SignOutButton() {
    return (
        <div>
            <ClerkSignOutButton>
                <Button>
                    <LogOutIcon className="mr-2 h-4 w-4" /> Logout
                </Button>
            </ClerkSignOutButton>
        </div>
    );
}