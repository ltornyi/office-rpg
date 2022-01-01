import { expect } from "@jest/globals";
import { generatorActionExperienceTable, generatorActionLevel } from "./experience";

test('Zero generator action experience is mastery level 1', () => {
  const exp = 0;
  const level = generatorActionLevel(exp);
  expect(level).toBe(1);
});

test('1 generator action experience is mastery level 1', () => {
  const exp = 1;
  const level = generatorActionLevel(exp);
  expect(level).toBe(1);
});

test('Top of level 1 is still mastery level 1', () => {
  const exp = generatorActionExperienceTable['1'];
  const level = generatorActionLevel(exp);
  expect(level).toBe(1);
});

test('Top of level 1 plus 1 is mastery level 2', () => {
  const exp = generatorActionExperienceTable['1'] + 1;
  const level = generatorActionLevel(exp);
  expect(level).toBe(2);
});