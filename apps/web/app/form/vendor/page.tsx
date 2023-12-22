import { Separator } from "@/components/ui/separator"
import { VendorForm } from "@/components/vendor/vendor-form"

export default function VendorFormPage() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Submit a new AI model vendor</h3>
                <p className="text-sm text-muted-foreground">
                    Submit a new AI model vendor.
                </p>
            </div>
            <Separator />
            <VendorForm />
        </div>
    )
}