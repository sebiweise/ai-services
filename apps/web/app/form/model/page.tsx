import { Separator } from "@/components/ui/separator"
import { ModelForm } from "./model-form"
import prisma from '@/lib/prisma';
import { Vendor } from "@prisma/client"

async function getData(): Promise<Vendor[]> {
    const vendors = await prisma.vendor.findMany({
        where: { status: 1 }
    });

    return vendors;
}

export default async function ModelFormPage() {
    const vendors = await getData();

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium">Submit a new AI model</h3>
                <p className="text-sm text-muted-foreground">
                    Submit a new AI model.
                </p>
            </div>
            <Separator />
            <ModelForm vendors={vendors} />
        </div>
    )
}