"use server"

import { Model } from '@prisma/client';
import prisma from '../prisma';
import { handleError } from '../utils';

export async function getAllModels(): Promise<Model[]> {
    try {
        const models = await prisma.model.findMany({
            include: {
                vendor: {
                    select: { name: true },
                },
            },
        });

        return models;
    } catch (error) {
        handleError(error)
        return [];
    }
}