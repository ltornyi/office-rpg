import { experienceForNextActivitiesLevel } from "../calculations/experience";
import { Player } from "./player";
import { ResourceName } from "./resourceDefinitions";
import { SkillName } from "./skillDefinitions";

export enum UpgradeName {
  MAGNIFYING_APP = 'Magnifier app',
  PRACTICING_MIRROR = 'Practicing mirror',
  SWITCH_TO_MAC = 'Switch to Mac',
  PILE_OR_FILE = 'Pile or File',
  DIGITAL_LIBRARY = 'Digital Library',
  PRODUCT_MANIFESTO = 'The Product Manifesto',
  DISCOVER_DESIGN = 'Discover design',
}

export const UpgradeNameLookup = {
  'Magnifier app': UpgradeName.MAGNIFYING_APP,
  'Practicing mirror': UpgradeName.PRACTICING_MIRROR,
  'Switch to Mac': UpgradeName.SWITCH_TO_MAC,
  'Pile or File': UpgradeName.PILE_OR_FILE,
  'Digital Library': UpgradeName.DIGITAL_LIBRARY,
  'The Product Manifesto': UpgradeName.PRODUCT_MANIFESTO,
  'Discover design': UpgradeName.DISCOVER_DESIGN
}

export const UpgradeEnumFromString = (str: string) => {
  if (str in UpgradeNameLookup)
    return UpgradeNameLookup[str as keyof typeof UpgradeNameLookup]
  else
    return null;
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

const DiscoverDesignUpgradeDefinition: UpgradeDefinitionType = {
  name: UpgradeName.DISCOVER_DESIGN,
  description: 'How is this different from product management?',
  cost: [
    {resourceName:ResourceName.INFLUENCE, amount: 200},
    {resourceName:ResourceName.CONCEPTS, amount: 100}
  ],
  visible: (player: Player) => player.resources[ResourceName.CONCEPTS].value >= 25
}

export const UpgradeDefinitions = {
  [UpgradeName.MAGNIFYING_APP]: MagnifyingAppUpgradeDefinition,
  [UpgradeName.PRACTICING_MIRROR]: PracticingMirrorUpgradeDefinition,
  [UpgradeName.SWITCH_TO_MAC]: SwitchToMacUpgradeDefinition,
  [UpgradeName.PILE_OR_FILE]: PileOrFileUpgradeDefinition,
  [UpgradeName.DIGITAL_LIBRARY]: DigitalLibraryUpgradeDefinition,
  [UpgradeName.PRODUCT_MANIFESTO]: ProductManifestoUpgradeDefinition,
  [UpgradeName.DISCOVER_DESIGN]: DiscoverDesignUpgradeDefinition
}