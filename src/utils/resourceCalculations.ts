import { ResourceDefinitions, ResourceName } from "./definitions";
import { Tresource, Tresources } from "./saveload";

export const resourceCapacity = (res: Tresource): number => {
  const resourceBaseCapacity = ResourceDefinitions[res.name].baseCapacity;
  return (resourceBaseCapacity + res.baseIncreaseAmount) * (1 + res.baseIncreasePercent / 100.0)
}

export const resourceRegenRate = (res: Tresource): number => {
  const resourceRegen = ResourceDefinitions[res.name].regenPerSec;
  return (resourceRegen + res.regenIncreaseAmount) * (1 + res.regenIncreasePercent / 100.0)
}

const addValueToResource = (res: Tresource, val: number) => {
  res.value = Math.min(res.value + val, resourceCapacity(res));
}

const substractValueFromResource = (res: Tresource, val: number) => {
  res.value = Math.max(res.value - val, 0);
}

const processResourceElapsedTime = (res: Tresource, elapsedSeconds: number) => {
  const gainedAmount = resourceRegenRate(res) * elapsedSeconds;
  addValueToResource(res, gainedAmount)
}

export const processResourcesElapsedTime = (resources: Tresources, elapsedSeconds: number) => {
  processResourceElapsedTime(resources[ResourceName.ENERGY], elapsedSeconds)
  processResourceElapsedTime(resources[ResourceName.PRODUCTIVITY], elapsedSeconds)
  processResourceElapsedTime(resources[ResourceName.KNOWLEDGE], elapsedSeconds)
  processResourceElapsedTime(resources[ResourceName.INFLUENCE], elapsedSeconds)
}