export default interface Monitor {
  _id: string;
  label: string;
  periodicity: number;
  badge_label: string;
  project: string;
  active: boolean;
  type: string;
  badge?: string;
}
