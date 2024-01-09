"use server"

import { Model, Prisma } from '@prisma/client';
import prisma from '../prisma';
import { handleError } from '../utils';

export async function createModel(model: Prisma.ModelUncheckedCreateInput) {
    try {
        const newModel = await prisma.model.create({
            data: model
        })

        return newModel;
    } catch (error) {
        handleError(error)
    }
}

export async function getModelById(modelId: number) {
    try {
        const model = await prisma.model.findUnique({
            where: {
                id: modelId
            }
        })

        if (!model) throw new Error('Model not found')

        return model;
    } catch (error) {
        handleError(error)
    }
}

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