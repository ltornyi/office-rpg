import { ResourceName, SkillDefinitions, SkillEnumFromString, SkillName } from "./definitions";
import { Player } from "./player";
import { substractValueFromResource } from "./resourceCalculations";

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

export const hasVisibleSkill = (player: Player) => {
  let has = false;
  for (const skillname of Object.keys(player.skills)) {
    const skillnameEnum = SkillEnumFromString(skillname);
    if (skillnameEnum && skillVisible(player, skillnameEnum)) {
      has = true;
      break;
    }
  }
  return has;
}

type SkillLevelingCost = {
  resourceName: ResourceName,
  cost: number
}

export type SkillLevelingCosts = SkillLevelingCost[];

export const calcLevelingCosts = (skillName: SkillName, currentLevel: number) => {
  const costs: SkillLevelingCosts = [];
  for (const setup of SkillDefinitions[skillName].levelingSetup) {
    const thisCost = (currentLevel === 0 ? setup.initialCost : setup.initialCost * Math.pow(setup.costMultiplier, currentLevel) );
    costs.push({resourceName: setup.resourceName, cost: thisCost});
  }
  return costs;
}

type SkillCanLevelUp = {
  resourceName: ResourceName,
  canLevel: boolean
}

export type SkillCanLevelUpArr = SkillCanLevelUp[]

export const CalcCanLevelup = (player: Player, costs: SkillLevelingCosts) => {
  const can: SkillCanLevelUpArr = [];
  for (const levelCost of costs) {
    const thisCan = levelCost.cost <= player.resources[levelCost.resourceName].value;
    can.push({resourceName: levelCost.resourceName, canLevel: thisCan});
  }
  return can;
}

export const canLevelUp = (canArr: SkillCanLevelUpArr) => {
  let canLevel = true;
  for (const can of canArr) {
    if (canLevel && !can.canLevel) {
      canLevel = false;
      break;
    }
  }
  return canLevel;
}

const skillLevelupImpact = (player: Player, skillName: SkillName) => {
  if (skillName === SkillName.FOCUS) {
    //Focus increases energy per sec by 2
    player.resources[ResourceName.ENERGY].regenIncreaseAmount += 2;
  } else if (skillName === SkillName.MEMORY) {
    //memory increase maxKnowledge and maxProductivity by 6 and 3
    player.resources[ResourceName.KNOWLEDGE].baseIncreaseAmount += 6;
    player.resources[ResourceName.PRODUCTIVITY].baseIncreaseAmount += 2;
  } else if (skillName === SkillName.CHANGE_MANAGEMENT) {
    //change management increases maxEnergy by 30
    player.resources[ResourceName.ENERGY].baseIncreaseAmount += 30;
  } else if (skillName === SkillName.SENIORITY) {
    //seniority increases maxEnergy by %4
    player.resources[ResourceName.ENERGY].baseIncreasePercent += 4;
  }
}

export const levelUpSkill = (player: Player, skillName: SkillName) => {
  const skill = player.skills[skillName];
  const levelingCosts = calcLevelingCosts(skillName, skill.level);
  const canLevelArr = CalcCanLevelup(player, levelingCosts);
  const canLevel = canLevelUp(canLevelArr);
  if (canLevel) {
    levelingCosts.forEach( lvlCost => substractValueFromResource(player.resources[lvlCost.resourceName], lvlCost.cost) );
    player.skills[skillName].level++;
    const resourceUnlock = SkillDefinitions[skillName].resourceUnlock
    if (resourceUnlock && resourceUnlock.skillLevelNeeded <= player.skills[skillName].level) {
      player.resources[resourceUnlock.resourceName].unlocked = true;
    }
    skillLevelupImpact(player, skillName);
  }
}