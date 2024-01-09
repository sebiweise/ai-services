"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { createVendor } from "@/lib/actions/vendor.actions"
import { useRouter } from "next/navigation"

const vendorFormSchema = z.object({
    name: z
        .string()
        .min(2, {
            message: "Name must be at least 2 characters.",
        }),
})

type VendorFormValues = z.infer<typeof vendorFormSchema>

// This can come from your database or API.
const defaultValues: Partial<VendorFormValues> = {}

export function VendorForm() {
    const router = useRouter();
    const form = useForm<VendorFormValues>({
        resolver: zodResolver(vendorFormSchema),
        defaultValues,
        mode: "onChange",
    })

    async function onSubmit(data: VendorFormValues) {
        try {
            const newVendor = await createVendor({ ...data })

            if (newVendor) {
                toast({
                    title: "New vendor submitted",
                    description: (
                        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                            <code className="text-white">{JSON.stringify(newVendor, null, 2)}</code>
                        </pre>
                    ),
                })
                form.reset();
                router.push(`/vendor`)
            }
        } catch (error) {
            console.log(error);
            toast({
                variant: "destructive",
                title: "Error while submitting new model",
                description: JSON.stringify(error),
            })
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="OpenAI" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is the name of the new AI model vendor.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit vendor</Button>
            </form>
        </Form>
    )
}