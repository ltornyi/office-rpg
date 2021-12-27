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