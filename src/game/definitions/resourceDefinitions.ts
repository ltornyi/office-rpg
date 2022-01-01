export enum ResourceName {
  ENERGY = 'Energy',
  PRODUCTIVITY = 'Productivity',
  KNOWLEDGE = 'Knowledge',
  INFLUENCE = 'Influence',
  CONCEPTS = 'Concepts',
  DESIGNS = 'Designs',
  
}

export type ResourceNameNotEnergy = Exclude<ResourceName, ResourceName.ENERGY>

export const ResourceNameLookup = {
  'Energy': ResourceName.ENERGY,
  'Productivity': ResourceName.PRODUCTIVITY,
  'Knowledge': ResourceName.KNOWLEDGE,
  'Influence': ResourceName.INFLUENCE,
  'Concepts': ResourceName.CONCEPTS,
  'Designs': ResourceName.DESIGNS,
}

export const ResourceEnumFromString = (str: string) => {
  if (str in ResourceNameLookup)
    return ResourceNameLookup[str as keyof typeof ResourceNameLookup]
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

const DesignsDefinition: ResourceDefinitionType = {
  name: ResourceName.DESIGNS,
  baseCapacity: 40,
  regenPerSec: 0
}

export const ResourceDefinitions = {
  [ResourceName.ENERGY]: EnergyDefinition,
  [ResourceName.PRODUCTIVITY]: ProductivityDefinition,
  [ResourceName.KNOWLEDGE]: KnowledgeDefinition,
  [ResourceName.INFLUENCE]: InfluenceDefinition,
  [ResourceName.CONCEPTS]: ConceptsDefinition,
  [ResourceName.DESIGNS]: DesignsDefinition
}


