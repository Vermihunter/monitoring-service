import { PopulateOptions } from "mongoose";
import { Request } from "express";

/**
 * Options for the findOne factory
 */
export interface FindOneOptions {
  filter?: (req: Request) => Record<string, any>;
  populate?: PopulateOptions | (string | PopulateOptions)[] | null;
  asMiddleware?: boolean;
  localKey?: string;
}
