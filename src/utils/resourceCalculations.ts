import { ResourceDefinitions, ResourceName, UpgradeName } from "./definitions";
import { Player, Tresource } from "./player";


export const resourceCapacity = (res: Tresource, player: Player): number => {
  const resourceBaseCapacity = ResourceDefinitions[res.name].baseCapacity;
  let specMultiplier = 1;
  if ((res.name === ResourceName.PRODUCTIVITY && player.upgrades[UpgradeName.SWITCH_TO_MAC].unlocked) ||
      (res.name === ResourceName.CONCEPTS && player.upgrades[UpgradeName.DIGITAL_LIBRARY].unlocked)
  ) {
    specMultiplier = 2;
  }
  return (resourceBaseCapacity + res.baseIncreaseAmount) * (1 + res.baseIncreasePercent / 100.0) * specMultiplier;
}

export const resourceRegenRate = (res: Tresource): number => {
  const resourceRegen = ResourceDefinitions[res.name].regenPerSec;
  return (resourceRegen + res.regenIncreaseAmount) * (1 + res.regenIncreasePercent / 100.0)
}
