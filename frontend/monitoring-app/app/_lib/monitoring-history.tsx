export type MonitorResultStatus = "success" | "fail";
export type MonitorRef = string | { _id: string };

export type MonitorResult = {
  _id: string;
  start: string;
  responseInMs: number;
  status: MonitorResultStatus;
  monitor: MonitorRef;
};

export type MonitorResultFilters = {
  status: "" | MonitorResultStatus;
  monitor: string;
  startFrom: string;
  startTo: string;
  minResponseTime: string;
  maxResponseTime: string;
  search: string;
};

export const initialMonitorResultFilters: MonitorResultFilters = {
  status: "",
  monitor: "",
  startFrom: "",
  startTo: "",
  minResponseTime: "",
  maxResponseTime: "",
  search: "",
};

export function getMonitorId(monitor: MonitorRef): string {
  return typeof monitor === "string" ? monitor : monitor._id;
}

export function filterMonitorResults(
  results: MonitorResult[],
  filters: MonitorResultFilters,
) {
  return [...results]
    .filter((result) => {
      const monitorId = getMonitorId(result.monitor);

      if (filters.status && result.status !== filters.status) {
        return false;
      }

      if (
        filters.monitor &&
        !monitorId.toLowerCase().includes(filters.monitor.toLowerCase())
      ) {
        return false;
      }

      if (filters.search) {
        const haystack = [
          result._id,
          monitorId,
          result.status,
          String(result.responseInMs),
        ]
          .join(" ")
          .toLowerCase();

        if (!haystack.includes(filters.search.toLowerCase())) {
          return false;
        }
      }

      if (filters.startFrom) {
        const resultDate = new Date(result.start);
        const fromDate = new Date(filters.startFrom);
        if (resultDate < fromDate) {
          return false;
        }
      }

      if (filters.startTo) {
        const resultDate = new Date(result.start);
        const toDate = new Date(filters.startTo);
        toDate.setHours(23, 59, 59, 999);
        if (resultDate > toDate) {
          return false;
        }
      }

      if (
        filters.minResponseTime &&
        result.responseInMs < Number(filters.minResponseTime)
      ) {
        return false;
      }

      if (
        filters.maxResponseTime &&
        result.responseInMs > Number(filters.maxResponseTime)
      ) {
        return false;
      }

      return true;
    })
    .sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime());
}
