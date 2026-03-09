import { ENERGY_FACTORS } from "./constants";
import type { EnergyMetrics } from "./types";

export function computeEnergyMetrics(totalTokens: number): EnergyMetrics {
  const totalKwh = totalTokens * ENERGY_FACTORS.kwhPerToken * ENERGY_FACTORS.pueRatio;
  const co2Kg = totalKwh * ENERGY_FACTORS.co2PerKwh;
  return {
    totalKwh,
    co2Kg,
    pueRatio: ENERGY_FACTORS.pueRatio,
    renewablePercent: ENERGY_FACTORS.renewablePercent,
  };
}
