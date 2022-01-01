import { experienceForNextActivitiesLevel } from "./experience";
import { Player } from "./player";

export enum ResourceName {
  ENERGY = 'Energy',
  PRODUCTIVITY = 'Productivity',
  KNOWLEDGE = 'Knowledge',
  INFLUENCE = 'Influence',
  CONCEPTS = 'Concepts',
  
}

export type ResourceNameNotEnergy = Exclude<ResourceName, ResourceName.ENERGY>

export const ResourceNameLookup = {
  'Energy': ResourceName.ENERGY,
  'Productivity': ResourceName.PRODUCTIVITY,
  'Knowledge': ResourceName.KNOWLEDGE,
  'Influence': ResourceName.INFLUENCE,
  'Concepts': ResourceName.CONCEPTS,
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
  TECH_LEADERSHIP = 'Tech Leadership',
  RESILIENCE = 'Resilience',
  AGILITY = 'Agility',
  IDEA_MANAGEMENT = 'Idea Management',
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
  'Idea Management': SkillName.IDEA_MANAGEMENT
}

export const SkillEnumFromString = (str: string) => {
  if (str in SkillNameLookup)
    return SkillNameLookup[str as keyof typeof SkillNameLookup]
  else
    return null;
}

export enum UpgradeName {
  MAGNIFYING_APP = 'Magnifier app',
  PRACTICING_MIRROR = 'Practicing mirror',
  SWITCH_TO_MAC = 'Switch to Mac',
  PILE_OR_FILE = 'Pile or File',
  DIGITAL_LIBRARY = 'Digital Library',
  PRODUCT_MANIFESTO = 'The Product Manifesto',
}

export const UpgradeNameLookup = {
  'Magnifier app': UpgradeName.MAGNIFYING_APP,
  'Practicing mirror': UpgradeName.PRACTICING_MIRROR,
  'Switch to Mac': UpgradeName.SWITCH_TO_MAC,
  'Pile or File': UpgradeName.PILE_OR_FILE,
  'Digital Library': UpgradeName.DIGITAL_LIBRARY,
  'The Product Manifesto': UpgradeName.PRODUCT_MANIFESTO
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
  baseCapacity: 65,
  regenPerSec: 0
}

const ConceptsDefinition: ResourceDefinitionType = {
  name: ResourceName.CONCEPTS,
  baseCapacity: 40,
  regenPerSec: 0
}

export const ResourceDefinitions = {
  [ResourceName.ENERGY]: EnergyDefinition,
  [ResourceName.PRODUCTIVITY]: ProductivityDefinition,
  [ResourceName.KNOWLEDGE]: KnowledgeDefinition,
  [ResourceName.INFLUENCE]: InfluenceDefinition,
  [ResourceName.CONCEPTS]: ConceptsDefinition
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

const ConceptsGeneratorActionDefinition: GeneratorActionDefinition = {
  forResourceName: ResourceName.CONCEPTS,
  levelNames: ['Look at App Store listings', 'Research the problem', 'Talk to customers', 'Ideas level 4', 'Ideas level 5',
    'Influence level 6', 'Ideas level 7', 'Ideas level 8', 'Ideas level 9',
    'Ideas level 10', 'Tap into the galactic intelligence'
  ],
  baseEnergyUsage: 90,
  resourceGenerated: 5,
  cooldownTime: 6,
  baseExperience: 12,
  levelUpResourceName: ResourceName.KNOWLEDGE,
  levelUpResourceBaseAmount: 20
}

export const GeneratorActionDefinitions = {
  [ResourceName.PRODUCTIVITY]: ProductivityGeneratorActionDefinition,
  [ResourceName.KNOWLEDGE]: KnowledgeGeneratorActionDefinition,
  [ResourceName.INFLUENCE]: InfluenceGeneratorActionDefinition,
  [ResourceName.CONCEPTS]: ConceptsGeneratorActionDefinition,
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
  visible: (player: Player) => player.resources[ResourceName.ENERGY].value >= 350 && player.resources[ResourceName.KNOWLEDGE].value >= 20
}

const SwitchToMacUpgradeDefinition: UpgradeDefinitionType = {
  name: UpgradeName.SWITCH_TO_MAC,
  description: 'A study reports 97% of enterprise users feel more productive after switching to a Mac.',
  cost: [{resourceName:ResourceName.INFLUENCE, amount: 100}, {resourceName:ResourceName.KNOWLEDGE, amount: 150}],
  visible: (player: Player) => player.skills[SkillName.SENIORITY].level >= 10
                            || player.skills[SkillName.CHARISMA].level >= 5
                            || player.skills[SkillName.ENTERPRISE_LEADERSHIP].level >= 3
}

const PileOrFileUpgradeDefinition: UpgradeDefinitionType = {
  name: UpgradeName.PILE_OR_FILE,
  description: 'Pile or file? Neither - now memory improves productivity capacity',
  cost: [{resourceName:ResourceName.KNOWLEDGE, amount: 120}],
  visible: (player: Player) => player.skills[SkillName.MEMORY].level >= 12
}

const DigitalLibraryUpgradeDefinition: UpgradeDefinitionType = {
  name: UpgradeName.DIGITAL_LIBRARY,
  description: 'Tech leadership generates extra knowledge. Also expands Concepts capacity.',
  cost: [{resourceName:ResourceName.KNOWLEDGE, amount: 120}],
  visible: (player: Player) => player.skills[SkillName.TECH_LEADERSHIP].level >= 1
}

const ProductManifestoUpgradeDefinition: UpgradeDefinitionType = {
  name: UpgradeName.PRODUCT_MANIFESTO,
  description: 'Unlocks new ideas',
  cost: [
    {resourceName:ResourceName.ENERGY, amount: 1000},
    {resourceName:ResourceName.KNOWLEDGE, amount: 100},
    {resourceName:ResourceName.INFLUENCE, amount: 100}
  ],
  visible: (player: Player) => player.skills[SkillName.TECH_LEADERSHIP].level >= 1
}

export const UpgradeDefinitions = {
  [UpgradeName.MAGNIFYING_APP]: MagnifyingAppUpgradeDefinition,
  [UpgradeName.PRACTICING_MIRROR]: PracticingMirrorUpgradeDefinition,
  [UpgradeName.SWITCH_TO_MAC]: SwitchToMacUpgradeDefinition,
  [UpgradeName.PILE_OR_FILE]: PileOrFileUpgradeDefinition,
  [UpgradeName.DIGITAL_LIBRARY]: DigitalLibraryUpgradeDefinition,
  [UpgradeName.PRODUCT_MANIFESTO]: ProductManifestoUpgradeDefinition
}