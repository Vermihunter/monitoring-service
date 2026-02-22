import { Project } from "../Models/project.model";
import { factory } from "@monitorapp/shared";

export const getAllProjects = factory.getAll(Project);
export const getProject = factory.getOne(Project);
export const createProject = factory.createOne(Project);
export const updateProject = factory.updateOne(Project);
export const deleteProject = factory.deleteOne(Project);
