import { ResourceDefinitions } from "./definitions";
import { Tresource } from "./player";


export const resourceCapacity = (res: Tresource): number => {
  const resourceBaseCapacity = ResourceDefinitions[res.name].baseCapacity;
  return (resourceBaseCapacity + res.baseIncreaseAmount) * (1 + res.baseIncreasePercent / 100.0)
}

export const resourceRegenRate = (res: Tresource): number => {
  const resourceRegen = ResourceDefinitions[res.name].regenPerSec;
  return (resourceRegen + res.regenIncreaseAmount) * (1 + res.regenIncreasePercent / 100.0)
}
