// src/types.ts

export type PlantStatus = "Operational" | "Under Maintenance" | "Decommissioned";

export interface PowerPlant {
  id: number;
  name: string;
  location: string;
  capacity_mw: number;
  status: PlantStatus;
  water_flow_rate: number;
}

export interface WeeklyProduction {
  id: number;
  power_plant_id: number;
  production_date: string; // ISO Date string
  production_mw: number;
  week_number: number;
  year: number;
}