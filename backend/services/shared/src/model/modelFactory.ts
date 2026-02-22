import { Request, Response, NextFunction } from "express";
import { Model, PopulateOptions } from "mongoose";

import catchAsync from "../middleware/catchAsync";
import AppError from "../error/error";
import APIFeatures from "../query/apiFeatures";
import { HttpClient } from "../http/httpClient";

/**
 * DELETE ONE
 */
export const deleteOne = <T>(Model: Model<T>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

/**
 * UPDATE ONE
 */
export const updateOne = <T>(Model: Model<T>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

/**
 * CREATE ONE
 */
export const createOne = <T>(Model: Model<T>) =>
  catchAsync(async (req: Request, res: Response) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

/**
 * GET ONE
 */
export const getOne = <T>(
  Model: Model<T>,
  popOptions?: PopulateOptions | (string | PopulateOptions)[],
) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let query = Model.findById(req.params.id);

    if (popOptions) {
      query = query.populate(popOptions);
    }

    const doc = await query;

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

export interface ExternalPopulator {
  path: string; // The field in your Monitor (e.g., 'project')
  endpoint: string; // The URL of the Project Service
  select?: string[]; // Optional: fields to pick from the external response
}

export const getOneMicroservices = <T>(
  Model: Model<T>,
  popOptions?: PopulateOptions | (string | PopulateOptions)[],
  externalPopulators?: ExternalPopulator[],
) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // 1. Get the base document (Local DB)
    let query = Model.findById(req.params.id);

    // Internal populate still works for same-service collections
    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    if (!doc) return next(new AppError("No document found", 404));

    // Convert to a plain JS object so we can modify it
    let result = doc.toObject() as Record<string, any>;

    // 2. Trigger External Hydration
    if (externalPopulators && externalPopulators.length > 0) {
      const hydrationTasks = externalPopulators.map(async (pop) => {
        const foreignId = result[pop.path];

        if (foreignId) {
          try {
            const client = new HttpClient({ baseURL: pop.endpoint });

            // Call the other microservice
            const response = await client.get<any>(`/${foreignId}`);
            const externalData = response.data.data;

            // Replace the ID with the actual object
            result[pop.path] = externalData;
          } catch (err) {
            console.error(`Failed to hydrate ${pop.path}:`, err); // .message
            // Optionally leave the ID there if the service is down
          }
        }
      });

      await Promise.all(hydrationTasks);
    }

    res.status(200).json({
      status: "success",
      data: { data: result },
    });
  });

/**
 * GET ALL
 */
export const getAll = <T>(Model: Model<T>) =>
  catchAsync(async (req: Request, res: Response) => {
    let filter: Record<string, unknown> = {};

    if (req.params.tourId) {
      filter = { tour: req.params.tourId };
    }

    const features = new APIFeatures(
      Model.find(filter),
      req.query as Record<string, unknown>,
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const docs = await features.query;

    res.status(200).json({
      status: "success",
      results: docs.length,
      data: { data: docs },
    });
  });
