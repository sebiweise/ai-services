"use server"

import { Prisma, Vendor } from '@prisma/client';
import prisma from '../prisma';
import { handleError } from '../utils';

export async function createVendor(vendor: Prisma.VendorUncheckedCreateInput) {
    try {
        const newVendor = await prisma.vendor.create({
            data: vendor
        })

        return newVendor;
    } catch (error) {
        handleError(error)
    }
}

export async function getVendorById(vendorId: number) {
    try {
        const vendor = await prisma.vendor.findUnique({
            where: {
                id: vendorId
            }
        })

        if (!vendor) throw new Error('Vendor not found')

        return vendor;
    } catch (error) {
        handleError(error)
    }
}

export async function getAllVendors(): Promise<Vendor[]> {
    try {
        const vendors = await prisma.vendor.findMany({
            include: {
                _count: {
                    select: { models: true },
                },
            },
        });

        return vendors;
    } catch (error) {
        handleError(error)
        return [];
    }
}