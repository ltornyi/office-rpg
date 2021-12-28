import { SkillName, ResourceName } from "./definitions";

export type SaveSlotInfo = {
  exists: boolean,
  lastUpdateTimeStamp?: number
}

const saveName = (slot: number) => 'Office-RPG-slot' + slot

export const getSaveSlotInfo = (slot: number) => {
  const savegame = localStorage.getItem(saveName(slot));
  const info: SaveSlotInfo = {exists: false};
  if (savegame) {
    const data = JSON.parse(savegame);
    info.exists = true;
    info.lastUpdateTimeStamp = data.lastUpdateTimeStamp;
  }
  return info;
}

export const deleteSaveSlot = (slot: number) => {
  localStorage.removeItem(saveName(slot));
}

export type TgeneratorActionMasteryLevel = {
  mastery: number,
  level: number,
  experience: number
}

export type TgeneratorActionMasteryLevels = {
  [ResourceName.PRODUCTIVITY]: TgeneratorActionMasteryLevel,
  [ResourceName.KNOWLEDGE]: TgeneratorActionMasteryLevel,
  [ResourceName.INFLUENCE]: TgeneratorActionMasteryLevel,
}

export type Tresource = {
  name: ResourceName,
  baseIncreaseAmount: number,
  baseIncreasePercent: number,
  regenIncreaseAmount: number,
  regenIncreasePercent: number,
  unlocked: boolean,
  value: number,
}

export type Tresources = {
  [ResourceName.ENERGY]: Tresource,
  [ResourceName.PRODUCTIVITY]: Tresource,
  [ResourceName.KNOWLEDGE]: Tresource,
  [ResourceName.INFLUENCE]: Tresource
}

export type Tskill = {
  name: SkillName,
  level: number,
}

export type Tskills = {
  [SkillName.FOCUS]: Tskill,
  [SkillName.MEMORY]: Tskill,
  [SkillName.CHANGE_MANAGEMENT]: Tskill,
  [SkillName.SENIORITY]: Tskill,
}

export type SavedGame = {
  lastUpdateTimeStamp: number,
  activitiesLevel: number,
  activitiesTotalExperience: number,
  generatorActionMasteryLevels: TgeneratorActionMasteryLevels,
  resources: Tresources,
  skills: Tskills
}

const buildNewSaveGame = () => {
  const val: SavedGame = {
    lastUpdateTimeStamp: Date.now(),
    activitiesLevel: 1,
    activitiesTotalExperience: 0,
    generatorActionMasteryLevels: {
      [ResourceName.PRODUCTIVITY]: {mastery: 1, level: 1, experience: 0},
      [ResourceName.KNOWLEDGE]: {mastery: 1, level: 1, experience: 0},
      [ResourceName.INFLUENCE]: {mastery: 1, level: 1, experience: 0},
    },
    resources: {
      [ResourceName.ENERGY]: {name: ResourceName.ENERGY, baseIncreaseAmount: 0, baseIncreasePercent: 0, regenIncreaseAmount: 0, regenIncreasePercent: 0, unlocked: true, value:0},
      [ResourceName.PRODUCTIVITY]: {name: ResourceName.PRODUCTIVITY, baseIncreaseAmount: 0, baseIncreasePercent: 0, regenIncreaseAmount: 0, regenIncreasePercent: 0, unlocked: false, value:0},
      [ResourceName.KNOWLEDGE]: {name: ResourceName.KNOWLEDGE, baseIncreaseAmount: 0, baseIncreasePercent: 0, regenIncreaseAmount: 0, regenIncreasePercent: 0, unlocked: false, value:0},
      [ResourceName.INFLUENCE]: {name: ResourceName.INFLUENCE, baseIncreaseAmount: 0, baseIncreasePercent: 0, regenIncreaseAmount: 0, regenIncreasePercent: 0, unlocked: false, value:0},
    },
    skills: {
      [SkillName.FOCUS]: {name: SkillName.FOCUS, level: 0},
      [SkillName.MEMORY]: {name: SkillName.MEMORY, level: 0},
      [SkillName.CHANGE_MANAGEMENT]: {name: SkillName.CHANGE_MANAGEMENT, level: 0},
      [SkillName.SENIORITY]: {name: SkillName.SENIORITY, level: 0},
    }
  }
  return val;
}

export const loadSaveSlot = (slot: number): SavedGame => {
  const savegame = localStorage.getItem(saveName(slot));
  if (savegame) {
    const restoredPlayer = JSON.parse(savegame) as SavedGame;
    //The line below disables offline progression
    restoredPlayer.lastUpdateTimeStamp = Date.now();
    return restoredPlayer;
  } else {
    return buildNewSaveGame()
  }
}