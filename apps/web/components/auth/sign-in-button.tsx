import { SignInButton as ClerkSignInButton } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { LogInIcon } from "lucide-react";

export default function SignInButton() {
    return (
        <div>
            <ClerkSignInButton>
                <Button>
                    <LogInIcon className="mr-2 h-4 w-4" /> Login
                </Button>
            </ClerkSignInButton>
        </div>
    );
}