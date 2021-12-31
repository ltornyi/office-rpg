import { deepSpread } from "./deepSpread";
import { buildNewPlayer, Player } from "./player";

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

export const loadSaveSlot = (slot: number): Player => {
  const savegame = localStorage.getItem(saveName(slot));
  let newPlayer = buildNewPlayer();
  if (savegame) {
    const restoredPlayer = JSON.parse(savegame) as Player;
    //crude compatibility with older saves:
    newPlayer = deepSpread(newPlayer, restoredPlayer);
    //The line below implements offline progression
    //newPlayer = generateNewPlayerState(newPlayer, (Date.now() - newPlayer.lastUpdateTimeStamp)/1000);
  }
  return newPlayer;
}

export const savePlayerToSlot = (player: Player, slot: number) => {
  localStorage.setItem(saveName(slot), JSON.stringify(player));
}