import { Player } from "./player";
import { ResourceName } from "./resourceDefinitions";
import { UpgradeName } from "./upgradeDefinitions";

export enum SkillName {
  FOCUS = 'Focus',
  MEMORY = 'Memory',
  CHANGE_MANAGEMENT = 'Change Management',
  SENIORITY = 'Seniority',
  CHARISMA = 'Charisma',
  ENTERPRISE_LEADERSHIP = 'Enterprise Leadership',
  TECH_LEADERSHIP = 'Tech Leadership',
  RESILIENCE = 'Resilience',
  AGILITY = 'Agility',
  IDEA_MANAGEMENT = 'Idea Management',
  DESIGN_THINKING = 'Design thinking',
}

export const SkillNameLookup = {
  'Focus': SkillName.FOCUS,
  'Memory': SkillName.MEMORY,
  'Change Management': SkillName.CHANGE_MANAGEMENT,
  'Seniority': SkillName.SENIORITY,
  'Charisma': SkillName.CHARISMA,
  'Enterprise Leadership': SkillName.ENTERPRISE_LEADERSHIP,
  'Tech Leadership': SkillName.TECH_LEADERSHIP,
  'Resilience': SkillName.RESILIENCE,
  'Agility': SkillName.AGILITY,
  'Idea Management': SkillName.IDEA_MANAGEMENT,
  'Design thinking': SkillName.DESIGN_THINKING
}

export const SkillEnumFromString = (str: string) => {
  if (str in SkillNameLookup)
    return SkillNameLookup[str as keyof typeof SkillNameLookup]
  else
    return null;
}

type SkillResourceUnlockType = {
  resourceName: ResourceName,
  skillLevelNeeded: number
}

type SkillLevelingSetup = {
  resourceName: ResourceName,
  initialCost: number,
  costMultiplier: number
}

export type SkillDefinitionType = {
  name: SkillName,
  levelupImpact: Function,
  description: string,
  resourceUnlock: SkillResourceUnlockType | null,
  levelingSetup: SkillLevelingSetup[],
  exceptionalVisibility?: (pl: Player) => boolean,
  dynamicDescription?: (player: Player) => string
};

const FocusDefinition: SkillDefinitionType = {
  name: SkillName.FOCUS,
  resourceUnlock: {resourceName: ResourceName.PRODUCTIVITY, skillLevelNeeded: 2},
  levelingSetup: [{resourceName: ResourceName.ENERGY, initialCost: 50, costMultiplier: 1.25}],
  levelupImpact: (player: Player) => player.resources[ResourceName.ENERGY].regenIncreaseAmount += 2,
  description: '<div>Gain +2 Energy / second</div>'
};

const MemoryDefinition: SkillDefinitionType = {
  name: SkillName.MEMORY,
  resourceUnlock: {resourceName: ResourceName.KNOWLEDGE, skillLevelNeeded: 1},
  levelingSetup: [{resourceName: ResourceName.PRODUCTIVITY, initialCost: 2, costMultiplier: 1.15}],
  levelupImpact: (player: Player) => {
    player.resources[ResourceName.PRODUCTIVITY].baseIncreaseAmount += 2;
    player.resources[ResourceName.KNOWLEDGE].baseIncreaseAmount += 6;
  },
  description: '<div>Gain +2 Productivity capacity</div><div>Gain +6 Knowledge capacity</div>',
  dynamicDescription: (player: Player) => {
    let descr = '<div>Gain +2 Productivity capacity</div><div>Gain +6 Knowledge capacity</div>';
    if (player.upgrades[UpgradeName.PILE_OR_FILE].unlocked) {
      descr += '<div>+0.3 Productivity gained</div>'
    }
    return descr;
  }
};

const ChangeManagementDefinition: SkillDefinitionType = {
  name: SkillName.CHANGE_MANAGEMENT,
  resourceUnlock: {resourceName: ResourceName.INFLUENCE, skillLevelNeeded: 4},
  levelingSetup: [{resourceName: ResourceName.KNOWLEDGE, initialCost: 5, costMultiplier: 1.15}],
  levelupImpact: (player: Player) => player.resources[ResourceName.ENERGY].baseIncreaseAmount += 30,
  description: '<div>Gain +30 Energy capacity</div>'
};

const SeniorityDefinition: SkillDefinitionType = {
  name: SkillName.SENIORITY,
  resourceUnlock: null,
  levelingSetup: [{resourceName: ResourceName.INFLUENCE, initialCost: 10, costMultiplier: 1.15}],
  levelupImpact: (player: Player) => player.resources[ResourceName.ENERGY].baseIncreasePercent += 4,
  description: '<div>Gain +4% Energy capacity</div>'
};

const CharismaDefinition: SkillDefinitionType = {
  name: SkillName.CHARISMA,
  resourceUnlock: null,
  levelingSetup: [{resourceName: ResourceName.PRODUCTIVITY, initialCost: 8, costMultiplier: 1.15}],
  levelupImpact: (player: Player) => player.resources[ResourceName.INFLUENCE].baseIncreaseAmount += 12,
  description: '<div>Gain +12 Influence capacity</div>',
  exceptionalVisibility: (player: Player) => player.upgrades[UpgradeName.PRACTICING_MIRROR].unlocked
};

const EnterpriseLeadershipDefinition: SkillDefinitionType = {
  name: SkillName.ENTERPRISE_LEADERSHIP,
  resourceUnlock: null,
  levelingSetup: [{resourceName: ResourceName.KNOWLEDGE, initialCost: 20, costMultiplier: 1.15}],
  levelupImpact: (player: Player) => player.resources[ResourceName.INFLUENCE].baseIncreasePercent += 5,
  description: '<div>Gain +5% Influence capacity</div>',
  exceptionalVisibility: (player: Player) => player.upgrades[UpgradeName.PRACTICING_MIRROR].unlocked
};

const TechLeadershipDefinition: SkillDefinitionType = {
  name: SkillName.TECH_LEADERSHIP,
  resourceUnlock: null,
  levelingSetup: [{resourceName: ResourceName.INFLUENCE, initialCost: 80, costMultiplier: 1.1}],
  levelupImpact: (player: Player) => {
    player.resources[ResourceName.PRODUCTIVITY].baseIncreasePercent += 6
    player.resources[ResourceName.KNOWLEDGE].baseIncreasePercent += 4
  },
  description: '<div>Gain +6% Productivity capacity</div><div>Gain +4% Knowledge capacity</div>',
  dynamicDescription: (player: Player) => {
    let descr = '<div>Gain +6% Productivity capacity</div><div>Gain +4% Knowledge capacity</div>';
    if (player.upgrades[UpgradeName.DIGITAL_LIBRARY].unlocked) {
      descr += '<div>+0.3 Knowledge gained</div>'
    }
    return descr;
  }
};

const ResilienceDefinition: SkillDefinitionType = {
  name: SkillName.RESILIENCE,
  resourceUnlock: null,
  levelingSetup: [{resourceName: ResourceName.PRODUCTIVITY, initialCost: 50, costMultiplier: 1.15}],
  levelupImpact: (player: Player) => player.resources[ResourceName.ENERGY].regenIncreasePercent += 5,
  description: '<div>Gain +5% Energy / second</div>',
};

const AgilityDefinition: SkillDefinitionType = {
  name: SkillName.AGILITY,
  resourceUnlock: null,
  levelingSetup: [
    {resourceName: ResourceName.PRODUCTIVITY, initialCost: 50, costMultiplier: 1.15},
    {resourceName: ResourceName.INFLUENCE, initialCost: 40, costMultiplier: 1.15}
  ],
  levelupImpact: (player: Player) => player.resources[ResourceName.ENERGY].regenIncreasePercent += 5,
  description: '<div>-5% cooldown time</div>',
};

const IdeaManagementDefinition: SkillDefinitionType = {
  name: SkillName.IDEA_MANAGEMENT,
  resourceUnlock: null,
  levelingSetup: [
    {resourceName: ResourceName.INFLUENCE, initialCost: 50, costMultiplier: 1.15},
    {resourceName: ResourceName.CONCEPTS, initialCost: 2, costMultiplier: 1.15}
  ],
  levelupImpact: (player: Player) => player.resources[ResourceName.CONCEPTS].baseIncreasePercent += 10,
  description: '<div>+10% Concepts capacity</div>',
};

const DesignThinkingDefinition: SkillDefinitionType = {
  name: SkillName.DESIGN_THINKING,
  resourceUnlock: {resourceName: ResourceName.DESIGNS, skillLevelNeeded: 2},
  levelingSetup: [
    {resourceName: ResourceName.CONCEPTS, initialCost: 70, costMultiplier: 1.15},
    {resourceName: ResourceName.KNOWLEDGE, initialCost: 100, costMultiplier: 1.15},
  ],
  levelupImpact: (player: Player) => player.resources[ResourceName.CONCEPTS].baseIncreaseAmount += 5,
  description: '<div>Gain +10 Concepts capacity</div><div>+1 Influence gained</div>',
  exceptionalVisibility: (player: Player) => player.upgrades[UpgradeName.DISCOVER_DESIGN].unlocked
};

export const SkillDefinitions = {
  [SkillName.FOCUS]: FocusDefinition,
  [SkillName.MEMORY]: MemoryDefinition,
  [SkillName.CHANGE_MANAGEMENT]: ChangeManagementDefinition,
  [SkillName.SENIORITY]: SeniorityDefinition,
  [SkillName.CHARISMA]: CharismaDefinition,
  [SkillName.ENTERPRISE_LEADERSHIP]: EnterpriseLeadershipDefinition,
  [SkillName.TECH_LEADERSHIP]: TechLeadershipDefinition,
  [SkillName.RESILIENCE]: ResilienceDefinition,
  [SkillName.AGILITY]: AgilityDefinition,
  [SkillName.IDEA_MANAGEMENT]: IdeaManagementDefinition,
  [SkillName.DESIGN_THINKING]: DesignThinkingDefinition,
}