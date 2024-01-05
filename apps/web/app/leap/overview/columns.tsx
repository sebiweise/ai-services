"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/shared/data-table-column-header"

import { Sample, Workflow } from "@prisma/client";
import { SignedIn } from "@clerk/nextjs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ModelForm } from "@/components/model/model-form"
import { Icons } from "@/components/icons"

export const columns: ColumnDef<Workflow>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "id",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="ID" />
        ),
    },
    {
        accessorKey: "name",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Name" />
        ),
    },
    {
        accessorKey: "status",
        header: () => <div className="text-right">Status</div>,
        cell: ({ row }) => {
            const status: string = row.getValue("status")

            return <Badge
                className="flex gap-2 items-center w-min"
                variant={
                    status === "finished" ? "default" : "secondary"
                }
            >
                {status === "processing" ? "training" : status}
                {status === "processing" && (
                    <Icons.spinner className="h-4 w-4 animate-spin" />
                )}
            </Badge>
        },
    },
    {
        accessorKey: "type",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Type" />
        ),
    },
    {
        accessorKey: "status",
        header: () => <div className="text-right">Status</div>,
        cell: ({ row }) => {
            const samples: Sample[] = row.getValue("samples")

            return <div className="flex gap-2 flex-shrink-0 items-center">
                {samples.slice(0, 3).map((sample) => (
                    <Avatar key={sample.id.toString()}>
                        <AvatarImage src={sample.uri} className="object-cover" />
                    </Avatar>
                ))}
                {samples.length > 3 && (
                    <Badge className="rounded-full h-10" variant={"outline"}>
                        +{samples.length - 3}
                    </Badge>
                )}
            </div>
        },
    },
    {
        id: "actions",
        cell: () => {
            return (
                <Dialog>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <SignedIn>
                                <DropdownMenuSeparator />
                                <DialogTrigger asChild>
                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                </DialogTrigger>
                                <DropdownMenuItem>Delete</DropdownMenuItem>
                            </SignedIn>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>View model</DropdownMenuItem>
                            <DropdownMenuItem>View vendor</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Edit model</DialogTitle>
                            <DialogDescription>
                                Make changes to the model here. Click save when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <ModelForm />
                        </div>
                        <DialogFooter>
                            <Button type="submit">Save changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )
        },
    },
]
