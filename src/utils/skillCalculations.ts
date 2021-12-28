import { SkillDefinitions, SkillEnumFromString, SkillName } from "./definitions";
import { Player } from "./player";

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