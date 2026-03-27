import { Request, Response, NextFunction } from "express";
import {
  factory,
  catchAsync,
  FindOneOptions,
  AppError,
  AuthenticatedRequest,
} from "@monitorapp/shared";
import { Project } from "../Models/project.model";

export const addMonitor = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { monitorId } = req.body;

    console.log("Adding monitor to project");

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { monitors: monitorId },
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!project) {
      return next(new AppError("No project found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: project,
      },
    });
  },
);

function isAuth(req: Request): req is AuthenticatedRequest {
  return (req as AuthenticatedRequest).user !== undefined;
}

export const userToUserId = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!isAuth(req)) {
      throw new AppError("Impossible Route", 404);
    }

    console.log("User to user ID: ", req.body);
    req.body.user = req.user.id;
    next();
  },
);

export const getAllProjects = factory.getAll(Project);
export const getProject = factory.getOne(Project);
export const findProject = (options?: FindOneOptions) =>
  factory.findOne(Project, options);
export const createProject = factory.createOne(Project);
export const updateProject = factory.updateOne(Project);
export const deleteProject = factory.deleteOne(Project);
