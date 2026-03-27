import { cookies } from "next/headers";
import Monitor from "../_types/monitor";

const NEXT_URL = "http://localhost:3000";

export async function getProjects() {
  const c = await cookies();
  const jwt = c.get("jwt")?.value;

  const res = await fetch(`${NEXT_URL}/api/projects`, {
    headers: {
      Cookie: `jwt=${jwt ?? ""}`,
    },
  });
  return res.json();
}

export async function getMonitorResults() {
  const res = await fetch(`${NEXT_URL}/api/monitor-results`);
  return res.json();
}

export async function getProjectByID(id: string) {
  const c = await cookies();
  const jwt = c.get("jwt")?.value;
  console.log("Get projects by id: ", jwt);

  const res = await fetch(`${NEXT_URL}/api/projects/${id}`, {
    headers: {
      Cookie: `jwt=${jwt}`,
    },
  });
  return res.json();
}

export async function getMonitors() {
  const res = await fetch(`${NEXT_URL}/api/monitors`);
  return res.json();
}

export async function getMonitorByID(id: string) {
  const c = await cookies();
  const jwt = c.get("jwt")?.value;

  console.log(`GetMonitorsByID: ${id}`);
  const res = await fetch(`${NEXT_URL}/api/monitors/${id}`, {
    headers: {
      Cookie: `jwt=${jwt}`,
    },
  });
  return res.json();
}

export async function updateMonitor(id: string, data: Monitor) {
  console.log("Sending update");
  const c = await cookies();
  const jwt = c.get("jwt")?.value;

  const res = await fetch(`${NEXT_URL}/api/monitors/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Cookie: `jwt=${jwt}`,
    },
    body: JSON.stringify(data),
  });

  return res.json();
}
