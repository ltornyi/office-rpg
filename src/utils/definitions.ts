export enum ResourceName {
  ENERGY = 'Energy',
  PRODUCTIVITY = 'Productivity',
  KNOWLEDGE = 'Knowledge',
  INFLUENCE = 'Influence'
}

export enum SkillName {
  FOCUS = 'Focus',
  MEMORY = 'Memory',
  CHANGE_MANAGEMENT = 'Change Management',
  SENIORITY = 'Seniority'
}

export type ResourceDefinitionType = {
  name: ResourceName,
  baseCapacity: number,
  regenPerSec: number,
}

export const EnergyDefinition: ResourceDefinitionType = {
  name: ResourceName.ENERGY,
  baseCapacity: 100,
  regenPerSec: 2
}

export const ProductivityDefinition: ResourceDefinitionType = {
  name: ResourceName.PRODUCTIVITY,
  baseCapacity: 10,
  regenPerSec: 0
}

export const KnowledgeDefinition: ResourceDefinitionType = {
  name: ResourceName.KNOWLEDGE,
  baseCapacity: 10,
  regenPerSec: 0
}

export const InfluenceDefinition: ResourceDefinitionType = {
  name: ResourceName.INFLUENCE,
  baseCapacity: 50,
  regenPerSec: 0
}

export const ResourceDefinitions = {
  [ResourceName.ENERGY]: EnergyDefinition,
  [ResourceName.PRODUCTIVITY]: ProductivityDefinition,
  [ResourceName.KNOWLEDGE]: KnowledgeDefinition,
  [ResourceName.INFLUENCE]: InfluenceDefinition
}

type SkillResourceUnlockType = {
  resourceName: ResourceName,
  skillLevelNeeded: number
}

type SkillLevelingSetup = {
  resourceName: ResourceName,
  initialCost: number,
  costMupltiplier: number
}

export type SkillDefinitionType =
 {name: SkillName} & {resourceUnlock: SkillResourceUnlockType | null} & {levelingSetup: SkillLevelingSetup[]};

export const FocusDefinition: SkillDefinitionType = {
  name: SkillName.FOCUS,
  resourceUnlock: {resourceName: ResourceName.PRODUCTIVITY, skillLevelNeeded: 2},
  levelingSetup: [{resourceName: ResourceName.ENERGY, initialCost: 50, costMupltiplier: 1.15}]
};

export const MemoryDefinition: SkillDefinitionType = {
  name: SkillName.MEMORY,
  resourceUnlock: {resourceName: ResourceName.KNOWLEDGE, skillLevelNeeded: 1},
  levelingSetup: [{resourceName: ResourceName.PRODUCTIVITY, initialCost: 2, costMupltiplier: 1.15}]
};

export const ChangeManagementDefinition: SkillDefinitionType = {
  name: SkillName.CHANGE_MANAGEMENT,
  resourceUnlock: {resourceName: ResourceName.INFLUENCE, skillLevelNeeded: 4},
  levelingSetup: [{resourceName: ResourceName.KNOWLEDGE, initialCost: 5, costMupltiplier: 1.15}]
};

export const SeniorityDefinition: SkillDefinitionType = {
  name: SkillName.SENIORITY,
  resourceUnlock: null,
  levelingSetup: [{resourceName: ResourceName.INFLUENCE, initialCost: 10, costMupltiplier: 1.15}]
};
