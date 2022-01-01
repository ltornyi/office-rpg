import React from 'react';
import { Player } from '../definitions/player';
import { upgradeVisible } from '../calculations/upgradeCalculations';
import { Upgrade } from './Upgrade';
import './Upgrades.css';
import { UpgradeEnumFromString, UpgradeName } from '../definitions/upgradeDefinitions';

type UpgradesPropType = {
  player: Player,
  buy: (u: UpgradeName) => void
}

export const Upgrades = (props: UpgradesPropType) => {

  return (
    <div className='gamepanel upgradescontainer'>
      <div className='upgradesheader'>Upgrades</div>
      <div className='upgradeslist'>
      {Object.keys(props.player.upgrades).map(upgradename => {
        const upgradenameEnum = UpgradeEnumFromString(upgradename);
        if (upgradenameEnum && upgradeVisible(props.player, upgradenameEnum))
          return <Upgrade key={upgradename} player={props.player} upgradeName={upgradenameEnum} buy={() => props.buy(upgradenameEnum)}/>
        else
          return null;
      })}
      </div>
    </div>
  )
}
