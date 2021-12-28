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
  if (savegame) {
    //The lines below implement offline progression
    // const restoredPlayer = JSON.parse(savegame) as Player;
    // return generateNewPlayerState(restoredPlayer, (Date.now() - restoredPlayer.lastUpdateTimeStamp)/1000);
    return JSON.parse(savegame) as Player;
  } else {
    return buildNewPlayer()
  }
}

export const savePlayerToSlot = (player: Player, slot: number) => {
  localStorage.setItem(saveName(slot), JSON.stringify(player));
}