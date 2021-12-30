import { experienceForNextActivitiesLevel } from "./experience";
import { Player } from "./player";

export enum ResourceName {
  ENERGY = 'Energy',
  PRODUCTIVITY = 'Productivity',
  KNOWLEDGE = 'Knowledge',
  INFLUENCE = 'Influence'
}

export type ResourceNameNotEnergy = Exclude<ResourceName, ResourceName.ENERGY>

export const ResourceNameLookup = {
  'Energy': ResourceName.ENERGY,
  'Productivity': ResourceName.PRODUCTIVITY,
  'Knowledge': ResourceName.KNOWLEDGE,
  'Influence': ResourceName.INFLUENCE,
}

export const ResourceEnumFromString = (str: string) => {
  if (str in ResourceNameLookup)
    return ResourceNameLookup[str as keyof typeof ResourceNameLookup]
  else
    return null;
}

export enum SkillName {
  FOCUS = 'Focus',
  MEMORY = 'Memory',
  CHANGE_MANAGEMENT = 'Change Management',
  SENIORITY = 'Seniority',
  CHARISMA = 'Charisma',
  ENTERPRISE_LEADERSHIP = 'Enterprise Leadership',
  // TECH_LEADERSHIP = 'Tech Leadership',
  // RESILIENCE = 'Resilience'
}

export const SkillNameLookup = {
  'Focus': SkillName.FOCUS,
  'Memory': SkillName.MEMORY,
  'Change Management': SkillName.CHANGE_MANAGEMENT,
  'Seniority': SkillName.SENIORITY,
  'Charisma': SkillName.CHARISMA,
  'Enterprise Leadership': SkillName.ENTERPRISE_LEADERSHIP,
  // 'Tech Leadership': SkillName.TECH_LEADERSHIP,
  // 'Resilience': SkillName.RESILIENCE
}

export const SkillEnumFromString = (str: string) => {
  if (str in SkillNameLookup)
    return SkillNameLookup[str as keyof typeof SkillNameLookup]
  else
    return null;
}

export enum UpgradeName {
  MAGNIFYING_APP = 'Magnifier app',
  PRACTICING_MIRROR = 'Practicing mirror'
}

export const UpgradeNameLookup = {
  'Magnifier app': UpgradeName.MAGNIFYING_APP,
  'Practicing mirror': UpgradeName.PRACTICING_MIRROR,
}

export const UpgradeEnumFromString = (str: string) => {
  if (str in UpgradeNameLookup)
    return UpgradeNameLookup[str as keyof typeof UpgradeNameLookup]
  else
    return null;
}

export type ResourceDefinitionType = {
  name: ResourceName,
  baseCapacity: number,
  regenPerSec: number,
}

const EnergyDefinition: ResourceDefinitionType = {
  name: ResourceName.ENERGY,
  baseCapacity: 100,
  regenPerSec: 2
}

const ProductivityDefinition: ResourceDefinitionType = {
  name: ResourceName.PRODUCTIVITY,
  baseCapacity: 10,
  regenPerSec: 0
}

const KnowledgeDefinition: ResourceDefinitionType = {
  name: ResourceName.KNOWLEDGE,
  baseCapacity: 10,
  regenPerSec: 0
}

const InfluenceDefinition: ResourceDefinitionType = {
  name: ResourceName.INFLUENCE,
  baseCapacity: 55,
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
  costMultiplier: number
}

export type SkillDefinitionType = {
  name: SkillName,
  levelupImpact: Function,
  description: string,
  resourceUnlock: SkillResourceUnlockType | null,
  levelingSetup: SkillLevelingSetup[],
  exceptionalVisibility?: (pl: Player) => boolean
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
  description: '<div>Gain +2 Productivity capacity</div><div>Gain +6 Knowledge capacity</div>'
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

export const SkillDefinitions = {
  [SkillName.FOCUS]: FocusDefinition,
  [SkillName.MEMORY]: MemoryDefinition,
  [SkillName.CHANGE_MANAGEMENT]: ChangeManagementDefinition,
  [SkillName.SENIORITY]: SeniorityDefinition,
  [SkillName.CHARISMA]: CharismaDefinition,
  [SkillName.ENTERPRISE_LEADERSHIP]: EnterpriseLeadershipDefinition,
}

type GeneratorActionDefinition = {
  forResourceName: ResourceName,
  levelNames: string[],
  baseEnergyUsage: number,
  resourceGenerated: number,
  cooldownTime: number,
  baseExperience: number,
  levelUpResourceName: ResourceName,
  levelUpResourceBaseAmount: number
}

const ProductivityGeneratorActionDefinition: GeneratorActionDefinition = {
  forResourceName: ResourceName.PRODUCTIVITY,
  levelNames: ['Prepare to-do lists', 'Put on headphones', 'Delete unread emails', 'Follow the two minute rule', 'Say no to meetings',
    'Get some leadership training', 'Write down your brilliant ideas', 'Wear multiple hats', 'Work together as a team',
    'Exercise and meditate', 'Work with your ultradian rhythms'
  ],
  baseEnergyUsage: 50,
  resourceGenerated: 2,
  cooldownTime: 5,
  baseExperience: 10,
  levelUpResourceName: ResourceName.KNOWLEDGE,
  levelUpResourceBaseAmount: 20
}

const KnowledgeGeneratorActionDefinition: GeneratorActionDefinition = {
  forResourceName: ResourceName.KNOWLEDGE,
  levelNames: ['Read Forbes on the toilet', 'Google the problem again', 'Browse medium.com', 'Sign up for a free course', 'Ask around the office',
    'Look up case studies', 'Build a prototype', 'Knowledge level 8', 'Knowledge level 9',
    'Knowledge level 10', 'Read Knuth\'s Volume 4'
  ],
  baseEnergyUsage: 30,
  resourceGenerated: 2,
  cooldownTime: 5,
  baseExperience: 10,
  levelUpResourceName: ResourceName.KNOWLEDGE,
  levelUpResourceBaseAmount: 10
}

const InfluenceGeneratorActionDefinition: GeneratorActionDefinition = {
  forResourceName: ResourceName.INFLUENCE,
  levelNames: ['Create Wiki page', 'Build presentation', 'Join debate', 'Run the weekly newsletter', 'Join the enterprise council',
    'Influence level 6', 'Start a new enterprise council', 'Chair the townhall', 'Influence level 9',
    'Influence level 10', 'Get Elon and Jeff to join the team'
  ],
  baseEnergyUsage: 80,
  resourceGenerated: 4,
  cooldownTime: 6,
  baseExperience: 10,
  levelUpResourceName: ResourceName.KNOWLEDGE,
  levelUpResourceBaseAmount: 25
}

export const GeneratorActionDefinitions = {
  [ResourceName.PRODUCTIVITY]: ProductivityGeneratorActionDefinition,
  [ResourceName.KNOWLEDGE]: KnowledgeGeneratorActionDefinition,
  [ResourceName.INFLUENCE]: InfluenceGeneratorActionDefinition,
}

type UpgradeDefinitionType = {
  name: UpgradeName,
  description: string,
  cost: {resourceName: ResourceName, amount: number}[],
  visible: (player: Player) => boolean
}

const MagnifyingAppUpgradeDefinition: UpgradeDefinitionType = {
  name: UpgradeName.MAGNIFYING_APP,
  description: 'It gives you more details',
  cost: [{resourceName:ResourceName.ENERGY, amount: 120}, {resourceName:ResourceName.KNOWLEDGE, amount: 20}],
  visible: (player: Player) => player.activitiesTotalExperience >= 0.7 * experienceForNextActivitiesLevel(1)
}

const PracticingMirrorUpgradeDefinition: UpgradeDefinitionType = {
  name: UpgradeName.PRACTICING_MIRROR,
  description: 'Great for improving your card magic. There might be other use cases, too.',
  cost: [{resourceName:ResourceName.ENERGY, amount: 1000}, {resourceName:ResourceName.KNOWLEDGE, amount: 100}],
  visible: (player: Player) => player.resources[ResourceName.ENERGY].value >= 700 && player.resources[ResourceName.KNOWLEDGE].value >= 70
}

export const UpgradeDefinitions = {
  [UpgradeName.MAGNIFYING_APP]: MagnifyingAppUpgradeDefinition,
  [UpgradeName.PRACTICING_MIRROR]: PracticingMirrorUpgradeDefinition
}