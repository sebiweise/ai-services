import { Separator } from "@/components/ui/separator"
import { ModelForm } from "./model-form"

export default function ModelFormPage() {
    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Submit a new AI model</h3>
                <p className="text-sm text-muted-foreground">
                    Submit a new AI model.
                </p>
            </div>
            <Separator />
            <ModelForm />
        </div>
    )
}