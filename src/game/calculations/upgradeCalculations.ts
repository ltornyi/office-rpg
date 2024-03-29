import { Player } from "../definitions/player";
import { ResourceName } from "../definitions/resourceDefinitions";
import { UpgradeDefinitions, UpgradeName } from "../definitions/upgradeDefinitions";

export const hasUpgrade = (player: Player, upgrade: UpgradeName) => player.upgrades[upgrade].unlocked

const seenUpgrade = (player: Player, upgrade: UpgradeName) => player.upgrades[upgrade].seen

export const upgradeVisible = (player: Player, upgrade: UpgradeName) => {
  //if the player already has this upgrade, then it's not visible
  if (hasUpgrade(player, upgrade))
    return false;
  //if not unlocked but was seen earlier then show it:
  if (seenUpgrade(player, upgrade))
    return true;
  //otherwise there's a utility function:
  return UpgradeDefinitions[upgrade].visible(player)
}

type canAffordUpgradeResource = {
  resourceName: ResourceName,
  hasEnough: boolean
}

export type canAffordUpgradeResourceArr = canAffordUpgradeResource[]

export const calcCanAffordUpgrade = (player: Player, upgrade: UpgradeName) => 
  UpgradeDefinitions[upgrade].cost
  .map( cost => ({
    resourceName: cost.resourceName,
    hasEnough: cost.amount <= player.resources[cost.resourceName].value
  }) as canAffordUpgradeResource);

export const canAffordUpgrade = (player: Player, upgrade: UpgradeName, arr?: canAffordUpgradeResourceArr) =>
  (arr ? arr: calcCanAffordUpgrade(player, upgrade))
    .findIndex( can => !can.hasEnough) === -1