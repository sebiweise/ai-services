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
    vendor: "OpenAI",
    params: "{\"maxLength\": 12000, \"tokenLimit\": 4000, \"requestLimit\": 3000}",
}

export function ModelForm() {
    const form = useForm<ModelFormValues>({
        resolver: zodResolver(modelFormSchema),
        defaultValues,
        mode: "onChange",
    })

    function onSubmit(data: ModelFormValues) {
        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        })
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
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a verified email to display" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="OpenAI">OpenAI</SelectItem>
                                    <SelectItem value="Azure">Azure</SelectItem>
                                    <SelectItem value="Anthropic">Anthropic</SelectItem>
                                    <SelectItem value="Google">Google</SelectItem>
                                    <SelectItem value="Ollama">Ollama</SelectItem>
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