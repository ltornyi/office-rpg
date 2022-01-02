import { GeneratorActionDefinitions } from "../definitions/generatorActionDefinitions";
import { Player } from "../definitions/player"
import { ResourceEnumFromString, ResourceName, ResourceNameNotEnergy } from "../definitions/resourceDefinitions";
import { SkillName } from "../definitions/skillDefinitions";
import { UpgradeName } from "../definitions/upgradeDefinitions";

export const generatorActionVisible = (player: Player, forResourceName: ResourceNameNotEnergy) => player.resources[forResourceName].unlocked

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
  //-1% for each agility level (multiplicative)
  return baseCooldown * (1 - 0.01 * playerActivitiesLevel) * Math.pow(1.25, genActionLevel) * Math.pow(0.95, player.skills[SkillName.AGILITY].level);
}

export const genActionEnergyUsage = (forResourceName: ResourceNameNotEnergy, currentLevel: number) => {
  //doubles with each action level
  return GeneratorActionDefinitions[forResourceName].baseEnergyUsage * Math.pow(2.0, currentLevel - 1);
}

export const genActionExtraResourceUsage = (forResourceName: ResourceNameNotEnergy, currentLevel: number) => {
  if (GeneratorActionDefinitions[forResourceName].extraResourceUsage) {
    const {resourceName, baseUsage, multiplier} = GeneratorActionDefinitions[forResourceName].extraResourceUsage!;
    return {
      resourceName: resourceName,
      amount: baseUsage * Math.pow(multiplier, currentLevel - 1)
    }
  } else {
    return null;
  }
}

const adjustGeneratedBaseAmount = (baseAmount: number, player: Player, forResourceName: ResourceNameNotEnergy) => {
  let result = baseAmount;
  if (forResourceName === ResourceName.PRODUCTIVITY) {
    if (player.upgrades[UpgradeName.PILE_OR_FILE].unlocked) {
      result += 0.3 * player.skills[SkillName.MEMORY].level
    }
  } else if (forResourceName === ResourceName.KNOWLEDGE) {
    if (player.upgrades[UpgradeName.DIGITAL_LIBRARY].unlocked) {
      result += 0.3 * player.skills[SkillName.TECH_LEADERSHIP].level
    }
  } else if (forResourceName === ResourceName.INFLUENCE) {
    result += 1 * player.skills[SkillName.DESIGN_THINKING].level
  }
  return result;
}

export const genActionResourceGenerated = (player: Player, forResourceName: ResourceNameNotEnergy) => {
  let baseAmount = GeneratorActionDefinitions[forResourceName].resourceGenerated;
  baseAmount = adjustGeneratedBaseAmount(baseAmount, player, forResourceName)
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

export const hasEnoughExtraResourceToActivateGenAction = (player: Player, forResourceName: ResourceNameNotEnergy) => {
  const level = player.generatorActionMasteryLevels[forResourceName].currentLevel;
  const extraUsage = genActionExtraResourceUsage(forResourceName, level);
  if (extraUsage) {
    return player.resources[extraUsage.resourceName].value >= extraUsage.amount
  } else {
    return true;
  }
}

export const canActivateGenAction = (player: Player, forResourceName: ResourceNameNotEnergy) => {
  return (!isGenActionOnCooldown(player, forResourceName)
    && hasEnoughEnergyToActivateGenAction(player, forResourceName)
    && hasEnoughExtraResourceToActivateGenAction(player, forResourceName)
  )
}

export const canDecreaseCurrentLevel = (player: Player, forResourceName: ResourceNameNotEnergy) => {
  return player.generatorActionMasteryLevels[forResourceName].currentLevel > 1 && !isGenActionOnCooldown(player, forResourceName);
}

export const canIncreaseCurrentLevel = (player: Player, forResourceName: ResourceNameNotEnergy) => {
  return player.generatorActionMasteryLevels[forResourceName].currentLevel < player.generatorActionMasteryLevels[forResourceName].maxLevel
    && !isGenActionOnCooldown(player, forResourceName);
}
