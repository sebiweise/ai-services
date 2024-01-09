"use client"

import Link from "next/link"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Vendor } from "@prisma/client"
import { useEffect, useState } from "react"
import { createModel } from "@/lib/actions/model.actions"
import { useRouter } from "next/navigation"

const modelFormSchema = z.object({
    name: z
        .string()
        .min(2, {
            message: "Name must be at least 2 characters.",
        }),
    vendor: z
        .string({
            required_error: "Please select a vendor.",
        }),
    params: z.string().optional(),
})

type ModelFormValues = z.infer<typeof modelFormSchema>

// This can come from your database or API.
const defaultValues: Partial<ModelFormValues> = {
    params: "{\"maxLength\": 12000, \"tokenLimit\": 4000, \"requestLimit\": 3000}",
}

export function ModelForm() {
    const router = useRouter();
    const [vendors, setVendors] = useState<Vendor[]>([])

    const form = useForm<ModelFormValues>({
        resolver: zodResolver(modelFormSchema),
        defaultValues,
        mode: "onChange",
    })

    async function onSubmit(data: ModelFormValues) {
        try {
            const newModel = await createModel({ ...data, vendorId: Number(data.vendor) })

            if (newModel) {
                toast({
                    title: "New model submitted",
                    description: (
                        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                            <code className="text-white">{JSON.stringify(newModel, null, 2)}</code>
                        </pre>
                    ),
                })
                form.reset();
                router.push(`/vendor`)
            }
        } catch (error) {
            console.log(error);
        }
        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        })
    }

    useEffect(() => {
        fetch('/api/vendors')
            .then((res) => res.json())
            .then((data) => {
                setVendors(data)
            })
    }, [])

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
                                <Input placeholder="gpt-4-1106-preview" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is the name or id of the new AI model.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="vendor"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Vendor</FormLabel>
                            <Select onValueChange={field.onChange}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a AI model vendor" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {vendors.map((vendor) => (
                                        <SelectItem key={vendor.id} value={vendor.id.toString()}>{vendor.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                You can add a new AI vendor using{" "}
                                <Link href="/form/vendor">this form</Link>.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="params"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Parameters</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Tell us a little bit about yourself"
                                    className="resize-none"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                You can define the parameters that are needed by this AI model.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit model</Button>
            </form>
        </Form>
    )
}