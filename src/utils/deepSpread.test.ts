import { expect } from "@jest/globals";
import { deepSpread } from "./deepSpread";
import { ResourceName } from "./definitions";

test('deepSpread trivial', () => {
  const target = {};
  const source = {
    lastUpdateTimeStamp: Date.now(),
    activitiesLevel: 1
  }
  const result = deepSpread(target, source);
  expect(result).toEqual(source);
});

test('deepSpread 2', () => {
  const target = {
    lastUpdateTimeStamp: Date.now(),
    activitiesLevel: 1,
    activitiesTotalExperience: 0,
    generatorActionMasteryLevels: {
      [ResourceName.PRODUCTIVITY]: {mastery: 1, currentLevel: 1, maxLevel: 1, experience: 0, cooldownLeft: 0},
      [ResourceName.KNOWLEDGE]: {mastery: 1, currentLevel: 1, maxLevel: 1, experience: 0, cooldownLeft: 0},
      [ResourceName.INFLUENCE]: {mastery: 1, currentLevel: 1, maxLevel: 1, experience: 0, cooldownLeft: 0},
    }
  };
  const source = {
    lastUpdateTimeStamp: Date.now(),
    activitiesLevel: 2,
    activitiesTotalExperience: 400,
    generatorActionMasteryLevels: {
      [ResourceName.PRODUCTIVITY]: {mastery: 2, currentLevel: 1, maxLevel: 1, experience: 200, cooldownLeft: 0},
      [ResourceName.KNOWLEDGE]: {mastery: 1, currentLevel: 1, maxLevel: 1, experience: 0, cooldownLeft: 0},
    }
  }
  const result = deepSpread(target, source);
  expect(result.activitiesLevel).toEqual(2);
  expect(result.activitiesTotalExperience).toEqual(400);
  expect(result.generatorActionMasteryLevels[ResourceName.PRODUCTIVITY].mastery).toEqual(2);
  expect(result.generatorActionMasteryLevels[ResourceName.INFLUENCE].mastery).toEqual(1);
});

  