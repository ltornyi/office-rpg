import { ResourceEnumFromString, ResourceName } from "./definitions"
import { Player } from "./player"

export const generatorActionVisible = (player: Player, forResourceName: ResourceName) => {
  return player.resources[forResourceName].unlocked
}

export const hasVisibleGeneratorAction = (player: Player) => {
  let has = false;
  for (const resname of Object.keys(player.generatorActionMasteryLevels)) {
    const resnameEnum = ResourceEnumFromString(resname);
    if (resnameEnum) {
      has = generatorActionVisible(player, resnameEnum);
      if (has) {
        break;
      }
    }
  }
  return has;
}