import { ResourceName, SkillDefinitions, SkillEnumFromString, SkillName } from "./definitions";
import { Player } from "./player";

export const skillVisible = (player: Player, skill: SkillName) => {
  //if the skill is leveled, then it's visible
  if (player.skills[skill].level > 0)
    return true;
  //if the skill has special visibility rules, then only those apply:
  if (SkillDefinitions[skill].exceptionalVisibility) {
    return SkillDefinitions[skill].exceptionalVisibility!(player) //my typescript compiler needs the !
  }
  //otherwise if the skill is at level 0, then it's visible if the player has 70% of all resources needed for level 1 of the skill
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
