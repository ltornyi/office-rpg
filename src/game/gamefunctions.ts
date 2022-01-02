import { canActivateGenAction, canDecreaseCurrentLevel, canIncreaseCurrentLevel, canUpgradeGenAction, genActionCooldownTime, genActionEnergyUsage, genActionExperienceGenerated, genActionExtraResourceUsage, genActionNextLevelResourceNeeded, genActionResourceGenerated } from "./calculations/activityCalculations";
import { generatorActionLevel, playerActivitiesLevel } from "./calculations/experience";
import { clonePlayer, Player, TgeneratorActionMasteryLevel, TgeneratorActionMasteryLevels, Tresource, Tresources } from "./definitions/player";
import { resourceCapacity, resourceRegenRate } from "./calculations/resourceCalculations";
import { calcCanLevelup, calcLevelingCosts, canLevelUp, skillVisible } from "./calculations/skillCalculations";
import { canAffordUpgrade, upgradeVisible } from "./calculations/upgradeCalculations";
import { ResourceEnumFromString, ResourceName, ResourceNameNotEnergy } from "./definitions/resourceDefinitions";
import { UpgradeDefinitions, UpgradeEnumFromString, UpgradeName } from "./definitions/upgradeDefinitions";
import { SkillDefinitions, SkillEnumFromString, SkillName } from "./definitions/skillDefinitions";
import { GeneratorActionDefinitions } from "./definitions/generatorActionDefinitions";

const addValueToResource = (res: Tresource, val: number, player: Player) => {
  res.value = Math.min(res.value + val, resourceCapacity(res, player));
}

const substractValueFromResource = (res: Tresource, val: number) => {
  res.value = Math.max(res.value - val, 0);
}

const processResourceElapsedTime = (res: Tresource, elapsedSeconds: number, player: Player) => {
  const gainedAmount = resourceRegenRate(res) * elapsedSeconds;
  addValueToResource(res, gainedAmount, player)
}

const processResourcesElapsedTime = (resources: Tresources, elapsedSeconds: number, player: Player) => {
  Object.keys(resources).forEach( resname => {
    const resnameEnum = ResourceEnumFromString(resname);
    if (resnameEnum) {
      processResourceElapsedTime(resources[resnameEnum], elapsedSeconds, player)
    }
  })
}

const processGenActionElapsedTime = (generatorActionMasteryLevel: TgeneratorActionMasteryLevel, elapsedSeconds: number) => {
  generatorActionMasteryLevel.cooldownLeft = Math.max(generatorActionMasteryLevel.cooldownLeft - elapsedSeconds, 0);
}

const processGenActionsElapsedTime = (generatorActionMasteryLevels: TgeneratorActionMasteryLevels, elapsedSeconds: number) => {
  Object.keys(generatorActionMasteryLevels).forEach( resname => {
    const resnameEnum = ResourceEnumFromString(resname);
    if (resnameEnum && resnameEnum !== ResourceName.ENERGY) {
      processGenActionElapsedTime(generatorActionMasteryLevels[resnameEnum], elapsedSeconds)
    }
  })
}

const processLockedUpgradesSeen = (player: Player) => {
  Object.keys(player.upgrades).forEach( upgradename => {
    const upgradenameEnum = UpgradeEnumFromString(upgradename);
    if (upgradenameEnum) {
      if (!player.upgrades[upgradenameEnum].unlocked
          && !player.upgrades[upgradenameEnum].seen
          && upgradeVisible(player, upgradenameEnum)) {
            player.upgrades[upgradenameEnum].seen = true;
          }
    }
  })
}

const processSkillsSeen = (player: Player) =>
  //level 0 skills that are visible: mark as seen
  Object.keys(player.skills)
    .map(s => SkillEnumFromString(s))
    .filter(sk => sk && player.skills[sk].level === 0 && skillVisible(player, sk))
    .forEach(sk => {
      if(sk)
        player.skills[sk].seen = true
    });

//called when a skill is upgraded
export const levelUpSkill = (player: Player, skillName: SkillName) => {
  const skill = player.skills[skillName];
  const levelingCosts = calcLevelingCosts(skillName, skill.level);
  const canLevelArr = calcCanLevelup(player, levelingCosts);
  const canLevel = canLevelUp(canLevelArr);
  if (canLevel) {
    const newPlayer = clonePlayer(player);
    levelingCosts.forEach( lvlCost => substractValueFromResource(newPlayer.resources[lvlCost.resourceName], lvlCost.cost) );
    newPlayer.skills[skillName].level++;
    const resourceUnlock = SkillDefinitions[skillName].resourceUnlock
    if (resourceUnlock && resourceUnlock.skillLevelNeeded <= newPlayer.skills[skillName].level) {
      newPlayer.resources[resourceUnlock.resourceName].unlocked = true;
    }
    SkillDefinitions[skillName].levelupImpact?.(newPlayer);
    return newPlayer;
  } else {
    return player;
  }
}

//called when a generator action is upgraded
export const upgradeGenAction = (player: Player, forResourceName: ResourceNameNotEnergy) => {
  if (canUpgradeGenAction(player, forResourceName)) {
    const newPlayer = clonePlayer(player);
    const resName = GeneratorActionDefinitions[forResourceName].levelUpResourceName;
    const currentMaxLevel = newPlayer.generatorActionMasteryLevels[forResourceName].maxLevel;
    const currentLevel = newPlayer.generatorActionMasteryLevels[forResourceName].currentLevel;
    substractValueFromResource(newPlayer.resources[resName], genActionNextLevelResourceNeeded(forResourceName, currentMaxLevel))
    newPlayer.generatorActionMasteryLevels[forResourceName].maxLevel++;
    //convenience: if upgrading while sitting at the maximum level, then the currentLevel is also set to the new maximum:
    if (currentLevel === currentMaxLevel) {
      newPlayer.generatorActionMasteryLevels[forResourceName].currentLevel = newPlayer.generatorActionMasteryLevels[forResourceName].maxLevel
    }
    return newPlayer;
  } else {
    return player;
  }
}

const gainActivitiesExperience = (player: Player, experience: number) => {
  player.activitiesTotalExperience += experience;
  player.activitiesLevel = playerActivitiesLevel(player.activitiesTotalExperience);
}

const gainGeneratorActionExperience = (player: Player, forResourceName: ResourceNameNotEnergy, experience: number) => {
  const curr = player.generatorActionMasteryLevels[forResourceName];
  curr.experience += experience;
  curr.mastery = generatorActionLevel(curr.experience);
  gainActivitiesExperience(player, experience);
}

//called when a generator action is activated
export const activateGenAction = (player: Player, forResourceName: ResourceNameNotEnergy) => {
  if (canActivateGenAction(player, forResourceName)) {
    const newPlayer = clonePlayer(player);
    //goes on cooldown
    newPlayer.generatorActionMasteryLevels[forResourceName].cooldownLeft = genActionCooldownTime(newPlayer, forResourceName);
    
    //consumes energy
    const currentLevel = newPlayer.generatorActionMasteryLevels[forResourceName].currentLevel;
    const energyUsage = genActionEnergyUsage(forResourceName, currentLevel);
    substractValueFromResource(newPlayer.resources[ResourceName.ENERGY], energyUsage);

    //consumes extra resource if any
    const extraResourceUsage = genActionExtraResourceUsage(forResourceName, currentLevel);
    if (extraResourceUsage) {
      substractValueFromResource(newPlayer.resources[extraResourceUsage.resourceName], extraResourceUsage.amount);
    }

    //generates resource
    const resourceGenerated = genActionResourceGenerated(newPlayer, forResourceName);
    addValueToResource(newPlayer.resources[forResourceName], resourceGenerated, player);

    //gives experience
    const experienceGenerated = genActionExperienceGenerated(newPlayer, forResourceName);
    gainGeneratorActionExperience(newPlayer, forResourceName, experienceGenerated);

    return newPlayer;
  } else {
    return player;
  }
}

//called when the current level of a generator action is lowered
export const decreaseGenActionCurrentLevel = (player: Player, forResourceName: ResourceNameNotEnergy) => {
  if (canDecreaseCurrentLevel(player, forResourceName)) {
    const newPlayer = clonePlayer(player);
    newPlayer.generatorActionMasteryLevels[forResourceName].currentLevel--;
    return newPlayer;
  } else {
    return player;
  }
}

//called when the current level of a generator action is increased
export const increaseGenActionCurrentLevel = (player: Player, forResourceName: ResourceNameNotEnergy) => {
  if (canIncreaseCurrentLevel(player, forResourceName)) {
    const newPlayer = clonePlayer(player);
    newPlayer.generatorActionMasteryLevels[forResourceName].currentLevel++;
    return newPlayer;
  } else {
    return player;
  }
}

//called from the main game loop
export const generateNewPlayerState = (player: Player, elapsedSeconds: number) => {
  const newPlayer = clonePlayer(player);

  //generates resources based on elapsed time
  processResourcesElapsedTime(newPlayer.resources, elapsedSeconds, newPlayer);
  //decrease remaining cooldowns
  processGenActionsElapsedTime(newPlayer.generatorActionMasteryLevels, elapsedSeconds);
  //mark skills as seen - so they show even if the condition to show them later isn't true anymore
  processSkillsSeen(newPlayer)
  //mark upgrades as seen - so they show even if the condition to show them later isn't true anymore
  processLockedUpgradesSeen(newPlayer)
  
  newPlayer.lastUpdateTimeStamp = Date.now();
  return newPlayer;
}

const buyUpgradeImpact = (player: Player, upgrade: UpgradeName) => {
  if (upgrade === UpgradeName.PRODUCT_MANIFESTO) {
    player.resources[ResourceName.CONCEPTS].unlocked = true;
  }
}

//called when buying an upgrade
export const buyUpgrade = (player: Player, upgrade: UpgradeName) => {
  if (canAffordUpgrade(player, upgrade) && upgradeVisible(player, upgrade)) {
    const newPlayer = clonePlayer(player);
    UpgradeDefinitions[upgrade].cost.forEach( cost => substractValueFromResource(newPlayer.resources[cost.resourceName], cost.amount) );
    newPlayer.upgrades[upgrade].unlocked = true;
    buyUpgradeImpact(newPlayer, upgrade);
    return newPlayer;
  } else {
    return player;
  }
}