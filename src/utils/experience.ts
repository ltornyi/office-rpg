type ExperienceTable = {
  [lvl: number]: number
}

//(2: 299) means you are level 2 up to having 299 exp (=> at 300 and you are level 3)
export const generatorActionExperienceTable : ExperienceTable = {
  1: 99,
  2: 299,
  3: 799,
  4: 2099,
  5: 5999,
  6: 17499,
  7: 53999,
  8: 149999,
  9: 399999,
  10: 999999
}

export const playerActivitiesExperienceTable : ExperienceTable = {
  1: 99,
  2: 199,
  3: 399,
  4: 699,
  5: 1199,
  6: 1999,
  7: 3699,
  8: 6999,
  9: 11999,
  10: 21999
}

const findMatchingLevel = (expTable: ExperienceTable, expValue: number) => {
  let level = 0;
  for (const lvl in expTable) {
    if (expTable[lvl] >= expValue) {
      level = parseInt(lvl);
      break;
    }
  }
  return level;
}

export const generatorActionLevel = (experience: number) => {
  let level = findMatchingLevel(generatorActionExperienceTable, experience);
  if (level === 0)
    level = 11;
  return level;
}

export const playerActivitiesLevel = (experience: number) => {
  let level = findMatchingLevel(playerActivitiesExperienceTable, experience);
  if (level === 0)
    level = 11;
  return level;
}

export const experienceForNextActivitiesLevel = (currentLevel: number) => {
  let key = 10;
  if (currentLevel < 11) {
    key = currentLevel
  }
  return playerActivitiesExperienceTable[key] + 1;
}

export const experienceForNextMasteryLevel = (currentLevel: number) => {
  let key = 10;
  if (currentLevel < 11) {
    key = currentLevel
  }
  return generatorActionExperienceTable[key] + 1;
}