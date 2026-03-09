export interface Department {
  id: string;
  name: string;
  budget: number;
  spent: number;
  headcount: number;
  costCenter: string;
}

export interface UsageRecord {
  id: string;
  departmentId: string;
  model: string;
  tokens: number;
  cost: number;
  date: string; // ISO date string
  project?: string;
  user?: string;
}

export interface Model {
  id: string;
  name: string;
  provider: string;
  costPer1kInput: number;
  costPer1kOutput: number;
  contextWindow: number;
  status: "active" | "deprecated" | "restricted";
}

export interface ApiKey {
  id: string;
  name: string;
  key: string; // masked, e.g. "sk-...abc123"
  departmentId: string;
  createdAt: string;
  lastUsed: string;
  status: "active" | "revoked" | "expired";
  permissions: string[];
}

export interface Alert {
  id: string;
  type: "quota" | "anomaly" | "security" | "billing";
  severity: "info" | "warning" | "critical";
  title: string;
  message: string;
  departmentId?: string;
  createdAt: string;
  acknowledged: boolean;
}

export interface Project {
  id: string;
  name: string;
  departmentId: string;
  budget: number;
  spent: number;
  status: "active" | "paused" | "completed";
  createdAt: string;
}

export interface AuditEntry {
  id: string;
  action: string;
  actor: string;
  target: string;
  timestamp: string;
  details: string;
  category: "access" | "config" | "billing" | "security";
}

export interface EnergyMetrics {
  totalKwh: number;
  co2Kg: number;
  pueRatio: number;
  renewablePercent: number;
}

export interface AppSettings {
  quotaThreshold: number; // 0-100
  alertEmail: string;
  darkMode: boolean; // always true for v1
  currency: "USD" | "EUR" | "GBP";
  role: "user" | "manager" | "admin";
  dataVersion: number;
}

export interface AppData {
  departments: Department[];
  usage: UsageRecord[];
  models: Model[];
  apiKeys: ApiKey[];
  alerts: Alert[];
  projects: Project[];
  auditLog: AuditEntry[];
  settings: AppSettings;
}
