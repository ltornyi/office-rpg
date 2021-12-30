import { GeneratorActionDefinitions, ResourceEnumFromString, ResourceName, ResourceNameNotEnergy } from "./definitions"
import { Player } from "./player"

export const generatorActionVisible = (player: Player, forResourceName: ResourceNameNotEnergy) => {
  return player.resources[forResourceName].unlocked
}

export const hasVisibleGeneratorAction = (player: Player) => {
  let has = false;
  for (const resname of Object.keys(player.generatorActionMasteryLevels)) {
    const resnameEnum = ResourceEnumFromString(resname);
    if (resnameEnum && resnameEnum !== ResourceName.ENERGY) {
      has = generatorActionVisible(player, resnameEnum);
      if (has) {
        break;
      }
    }
  }
  return has;
}

export const genActionName = (forResourceName: ResourceNameNotEnergy, currentLevel: number) => {
  const genActDef = GeneratorActionDefinitions[forResourceName];
  return currentLevel <= genActDef.levelNames.length ? genActDef.levelNames[currentLevel - 1] : genActDef.levelNames[genActDef.levelNames.length-1]
}

export const genActionNextLevelResourceNeeded = (forResourceName: ResourceNameNotEnergy, currentLevel: number) => {
  return GeneratorActionDefinitions[forResourceName].levelUpResourceBaseAmount * Math.pow(3.5, currentLevel - 1)
}

export const genActionLevelupResourceName = (forResourceName: ResourceNameNotEnergy) => {
  return GeneratorActionDefinitions[forResourceName].levelUpResourceName
}

export const hasEnoughMasteryToUpgradeGenAction = (player: Player, forResourceName: ResourceNameNotEnergy) => {
  return player.generatorActionMasteryLevels[forResourceName].mastery >= player.generatorActionMasteryLevels[forResourceName].maxLevel + 1;
}

export const hasEnoughResourceToUpgradeGenAction = (player: Player, forResourceName: ResourceNameNotEnergy) => {
  const resName = GeneratorActionDefinitions[forResourceName].levelUpResourceName;
  const currMaxLevel = player.generatorActionMasteryLevels[forResourceName].maxLevel;
  return player.resources[resName].value >= genActionNextLevelResourceNeeded(forResourceName, currMaxLevel);
}

export const canUpgradeGenAction = (player: Player, forResourceName: ResourceNameNotEnergy) => {
  return hasEnoughMasteryToUpgradeGenAction(player, forResourceName) && hasEnoughResourceToUpgradeGenAction(player, forResourceName)
    && !isGenActionOnCooldown(player, forResourceName);
}

export const genActionCooldownTime = (player: Player, forResourceName: ResourceNameNotEnergy) => {
  const baseCooldown = GeneratorActionDefinitions[forResourceName].cooldownTime;
  const playerActivitiesLevel = player.activitiesLevel - 1;
  const genActionLevel = player.generatorActionMasteryLevels[forResourceName].currentLevel - 1;
  //+25% for each action level (multiplicative)
  //-1% for each global activities level (additive)
  return baseCooldown * (1 - 0.01 * playerActivitiesLevel) * Math.pow(1.25, genActionLevel);
}

export const genActionEnergyUsage = (forResourceName: ResourceNameNotEnergy, currentLevel: number) => {
  //doubles with each action level
  return GeneratorActionDefinitions[forResourceName].baseEnergyUsage * Math.pow(2.0, currentLevel - 1);
}

export const genActionResourceGenerated = (player: Player, forResourceName: ResourceNameNotEnergy) => {
  const baseAmount = GeneratorActionDefinitions[forResourceName].resourceGenerated;
  const playerActivitiesLevel = player.activitiesLevel - 1;
  const genActionLevel = player.generatorActionMasteryLevels[forResourceName].currentLevel - 1;
  const genActionMastery = player.generatorActionMasteryLevels[forResourceName].mastery - 1;
  //+75% for each action level (multiplicative)
  //+4% for each global activities level (additive)
  //+5% for each master level (additive)
  return baseAmount * Math.pow(1.75, genActionLevel ) * (1.0 + 0.04 * playerActivitiesLevel) * (1.0 + 0.05 * genActionMastery)
}

export const genActionExperienceGenerated = (player: Player, forResourceName: ResourceNameNotEnergy) => {
  const baseExp = GeneratorActionDefinitions[forResourceName].baseExperience;
  const playerActivitiesLevel = player.activitiesLevel - 1;
  const level = player.generatorActionMasteryLevels[forResourceName].currentLevel - 1;
  //+20% for each action level (multiplicative)
  //+1% for each global activities level (additive)
  return baseExp * Math.pow(1.2, level) * (1.0 + 0.01 * playerActivitiesLevel);
}

export const isGenActionOnCooldown = (player: Player, forResourceName: ResourceNameNotEnergy) => {
    return player.generatorActionMasteryLevels[forResourceName].cooldownLeft > 0.01
}

export const hasEnoughEnergyToActivateGenAction = (player: Player, forResourceName: ResourceNameNotEnergy) => {
  const level = player.generatorActionMasteryLevels[forResourceName].currentLevel;
  return player.resources[ResourceName.ENERGY].value >= genActionEnergyUsage(forResourceName, level)
}

export const canActivateGenAction = (player: Player, forResourceName: ResourceNameNotEnergy) => {
  return (!isGenActionOnCooldown(player, forResourceName) && hasEnoughEnergyToActivateGenAction(player, forResourceName))
}

export const canDecreaseCurrentLevel = (player: Player, forResourceName: ResourceNameNotEnergy) => {
  return player.generatorActionMasteryLevels[forResourceName].currentLevel > 1 && !isGenActionOnCooldown(player, forResourceName);
}

export const canIncreaseCurrentLevel = (player: Player, forResourceName: ResourceNameNotEnergy) => {
  return player.generatorActionMasteryLevels[forResourceName].currentLevel < player.generatorActionMasteryLevels[forResourceName].maxLevel
    && !isGenActionOnCooldown(player, forResourceName);
}
