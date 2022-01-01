import { ResourceName } from "../game/definitions/resourceDefinitions";

export const oneDecimal = (value: number) => {
  return (Math.floor(value * 10) / 10).toFixed(1);
}

export const integerPart = (value: number) => {
  return Math.floor(value)
}

export const resourceCost = (resName: ResourceName, amount: number) => resName.substring(0,1) + ': ' + oneDecimal(amount)