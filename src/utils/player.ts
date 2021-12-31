import { ResourceName, SkillName, UpgradeName } from "./definitions"

export type TgeneratorActionMasteryLevel = {
  mastery: number,
  currentLevel: number,
  maxLevel: number,
  experience: number,
  cooldownLeft: number
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

type Tskill = {
  name: SkillName,
  level: number,
}

type Tskills = {
  [SkillName.FOCUS]: Tskill,
  [SkillName.MEMORY]: Tskill,
  [SkillName.CHANGE_MANAGEMENT]: Tskill,
  [SkillName.SENIORITY]: Tskill,
  [SkillName.CHARISMA]: Tskill,
  [SkillName.ENTERPRISE_LEADERSHIP]: Tskill,
  [SkillName.TECH_LEADERSHIP]: Tskill,
  [SkillName.RESILIENCE]: Tskill,
}

type Tupgrade = {
  name: UpgradeName,
  seen: boolean,
  unlocked: boolean
}

export type Tupgrades = {
  [UpgradeName.MAGNIFYING_APP]: Tupgrade,
  [UpgradeName.PRACTICING_MIRROR]: Tupgrade
  [UpgradeName.SWITCH_TO_MAC]: Tupgrade
}

export type Player = {
  lastUpdateTimeStamp: number,
  activitiesLevel: number,
  activitiesTotalExperience: number,
  generatorActionMasteryLevels: TgeneratorActionMasteryLevels,
  resources: Tresources,
  skills: Tskills,
  upgrades: Tupgrades
}

export const buildNewPlayer = () => {
  const val: Player = {
    lastUpdateTimeStamp: Date.now(),
    activitiesLevel: 1,
    activitiesTotalExperience: 0,
    generatorActionMasteryLevels: {
      [ResourceName.PRODUCTIVITY]: {mastery: 1, currentLevel: 1, maxLevel: 1, experience: 0, cooldownLeft: 0},
      [ResourceName.KNOWLEDGE]: {mastery: 1, currentLevel: 1, maxLevel: 1, experience: 0, cooldownLeft: 0},
      [ResourceName.INFLUENCE]: {mastery: 1, currentLevel: 1, maxLevel: 1, experience: 0, cooldownLeft: 0},
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
      [SkillName.CHARISMA]: {name: SkillName.CHARISMA, level: 0},
      [SkillName.ENTERPRISE_LEADERSHIP]: {name: SkillName.ENTERPRISE_LEADERSHIP, level: 0},
      [SkillName.TECH_LEADERSHIP]: {name: SkillName.TECH_LEADERSHIP, level: 0},
      [SkillName.RESILIENCE]: {name: SkillName.RESILIENCE, level: 0},
    },
    upgrades: {
      [UpgradeName.MAGNIFYING_APP]: {name: UpgradeName.MAGNIFYING_APP, seen: false, unlocked: false},
      [UpgradeName.PRACTICING_MIRROR]: {name: UpgradeName.PRACTICING_MIRROR, seen: false, unlocked: false},
      [UpgradeName.SWITCH_TO_MAC]: {name: UpgradeName.SWITCH_TO_MAC, seen: false, unlocked: false},
    }
  }
  return val;
}

export const clonePlayer = (player: Player) => JSON.parse(JSON.stringify(player)) as Player;
