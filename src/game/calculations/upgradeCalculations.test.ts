import { expect } from "@jest/globals";

import { buildNewPlayer, Player } from "../definitions/player";
import { ResourceName } from "../definitions/resourceDefinitions";
import { UpgradeDefinitions, UpgradeName } from "../definitions/upgradeDefinitions";
import { calcCanAffordUpgrade, canAffordUpgrade, canAffordUpgradeResourceArr } from "./upgradeCalculations";

let mockPlayer: Player;

beforeEach(() => {
  mockPlayer = buildNewPlayer()
});

test('canAffordUpgrade if there\'s no cost', () => {
  const upgradeName = UpgradeName.MAGNIFYING_APP;
  const precalcCanAffordArray: canAffordUpgradeResourceArr = [];
  const canAfford = canAffordUpgrade(mockPlayer, upgradeName, precalcCanAffordArray);
  expect(canAfford).toBe(true);
});

test('canAffordUpgrade if one resource needed but says hasEnough', () => {
  const upgradeName = UpgradeName.MAGNIFYING_APP;
  const precalcCanAffordArray: canAffordUpgradeResourceArr = [{resourceName: ResourceName.ENERGY, hasEnough: true}];
  const canAfford = canAffordUpgrade(mockPlayer, upgradeName, precalcCanAffordArray);
  expect(canAfford).toBe(true);
});

test('canAffordUpgrade if all resources say hasEnough', () => {
  const upgradeName = UpgradeName.MAGNIFYING_APP;
  const precalcCanAffordArray: canAffordUpgradeResourceArr = [{resourceName: ResourceName.ENERGY, hasEnough: true}, {resourceName: ResourceName.DESIGNS, hasEnough:true}];
  const canAfford = canAffordUpgrade(mockPlayer, upgradeName, precalcCanAffordArray);
  expect(canAfford).toBe(true);
});

test('canAffordUpgrade if one resource needed but says !hasEnough', () => {
  const upgradeName = UpgradeName.MAGNIFYING_APP;
  const precalcCanAffordArray: canAffordUpgradeResourceArr = [{resourceName: ResourceName.ENERGY, hasEnough: false}];
  const canAfford = canAffordUpgrade(mockPlayer, upgradeName, precalcCanAffordArray);
  expect(canAfford).toBe(false);
});

test('canAffordUpgrade false if at least 1 resource say !hasEnough', () => {
  const upgradeName = UpgradeName.MAGNIFYING_APP;
  const precalcCanAffordArray: canAffordUpgradeResourceArr = [{resourceName: ResourceName.ENERGY, hasEnough: true}, {resourceName: ResourceName.DESIGNS, hasEnough:false}];
  const canAfford = canAffordUpgrade(mockPlayer, upgradeName, precalcCanAffordArray);
  expect(canAfford).toBe(false);
});

test('calcCanAffordUpgrade if has exactly same resource amounts', () => {
  const upgrade = UpgradeName.MAGNIFYING_APP
  const definedCosts = UpgradeDefinitions[upgrade].cost
  definedCosts.forEach(c => mockPlayer.resources[c.resourceName].value = c.amount)
  const expected: canAffordUpgradeResourceArr = definedCosts.map( dc => ({resourceName: dc.resourceName, hasEnough: true}))
  const received = calcCanAffordUpgrade(mockPlayer, upgrade);
  expect(received).toEqual(expected);
});

test('calcCanAffordUpgrade for the new player with zero resources', () => {
  const upgrade = UpgradeName.MAGNIFYING_APP
  const definedCosts = UpgradeDefinitions[upgrade].cost
  const expected: canAffordUpgradeResourceArr = definedCosts.map( dc => ({resourceName: dc.resourceName, hasEnough: false}))
  const received = calcCanAffordUpgrade(mockPlayer, upgrade);
  expect(received).toEqual(expected);
});

test('calcCanAffordUpgrade if partially enough', () => {
  const upgrade = UpgradeName.MAGNIFYING_APP
  const definedCosts = UpgradeDefinitions[upgrade].cost
  definedCosts.forEach(c => mockPlayer.resources[c.resourceName].value = c.amount)
  mockPlayer.resources[definedCosts[0].resourceName].value--;
  const expected: canAffordUpgradeResourceArr = definedCosts.map( dc => ({resourceName: dc.resourceName, hasEnough: true}))
  expected[0].hasEnough=false;
  const received = calcCanAffordUpgrade(mockPlayer, upgrade);
  expect(received).toEqual(expected);
});