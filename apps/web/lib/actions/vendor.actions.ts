"use server"

import { Vendor } from '@prisma/client';
import prisma from '../prisma';
import { handleError } from '../utils';

export async function getAllVendors(): Promise<Vendor[]> {
    try {
        const categories = await prisma.vendor.findMany({
            include: {
                _count: {
                    select: { models: true },
                },
            },
        });

        return categories;
    } catch (error) {
        handleError(error)
        return [];
    }
}