import { ResourceDefinitions, ResourceName, SkillDefinitions, SkillName } from "./definitions";
import { Player, Tresource, Tresources } from "./saveload";

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

export const generateNewPlayerState = (player: Player, elapsedSeconds: number) => {
  const newPlayer = JSON.parse(JSON.stringify(player)) as Player;

  processResourcesElapsedTime(newPlayer.resources, elapsedSeconds);
  
  newPlayer.lastUpdateTimeStamp = Date.now();
  return newPlayer;
}

export const skillVisible = (player: Player, skill: SkillName) => {
  //if the skill is leveled, then it's visible
  if (player.skills[skill].level > 0)
    return true;
  //if the skill is at level 0, then it's visible if the player has 70% of all resources needed for level 1 of the skill
  const levelingSetup = SkillDefinitions[skill].levelingSetup;
  let hasEnough = true;
  for (const lvlSetup of levelingSetup) {
    if (lvlSetup.initialCost * 0.7 > player.resources[lvlSetup.resourceName].value) {
      hasEnough = false;
      break;
    }
  }
  return hasEnough;
}