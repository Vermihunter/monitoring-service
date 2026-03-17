import Monitor from "./monitor.model";

export default interface Project {
  identifier: string;
  label: string;
  description: string;
  monitors: Monitor[];
}
