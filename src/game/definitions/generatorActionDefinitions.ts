import { ResourceName } from "./resourceDefinitions"

type GeneratorActionDefinition = {
  forResourceName: ResourceName,
  levelNames: string[],
  baseEnergyUsage: number,
  resourceGenerated: number,
  cooldownTime: number,
  baseExperience: number,
  levelUpResourceName: ResourceName,
  levelUpResourceBaseAmount: number,
  extraResourceUsage?: {resourceName: ResourceName, baseUsage: number, multiplier: number}
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
  resourceGenerated: 3,
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
  levelNames: ['Look at App Store listings', 'Research the problem', 'Talk to customers', 'Concepts level 4', 'Concepts level 5',
    'Concepts level 6', 'Concepts level 7', 'Concepts level 8', 'Concepts level 9',
    'Concepts level 10', 'Tap into the galactic intelligence'
  ],
  baseEnergyUsage: 90,
  resourceGenerated: 5,
  cooldownTime: 6,
  baseExperience: 12,
  levelUpResourceName: ResourceName.KNOWLEDGE,
  levelUpResourceBaseAmount: 20
}

const DesignsGeneratorActionDefinition: GeneratorActionDefinition = {
  forResourceName: ResourceName.DESIGNS,
  levelNames: ['Ask questions', 'Draw on a piece of paper', 'Talk to customers', 'Join design critique', 'Design level 5',
    'Design level 6', 'Design level 7', 'Design level 8', 'Design level 9',
    'Design level 10', 'Tap into the galactic intelligence'
  ],
  baseEnergyUsage: 90,
  resourceGenerated: 5,
  cooldownTime: 6,
  baseExperience: 12,
  levelUpResourceName: ResourceName.KNOWLEDGE,
  levelUpResourceBaseAmount: 20,
  extraResourceUsage: {resourceName: ResourceName.CONCEPTS, baseUsage: 10, multiplier: 1.2}
}

export const GeneratorActionDefinitions = {
  [ResourceName.PRODUCTIVITY]: ProductivityGeneratorActionDefinition,
  [ResourceName.KNOWLEDGE]: KnowledgeGeneratorActionDefinition,
  [ResourceName.INFLUENCE]: InfluenceGeneratorActionDefinition,
  [ResourceName.CONCEPTS]: ConceptsGeneratorActionDefinition,
  [ResourceName.DESIGNS]: DesignsGeneratorActionDefinition,
}