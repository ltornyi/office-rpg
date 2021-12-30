import './Upgrade.css';
import { UpgradeDefinitions, UpgradeName } from "../../utils/definitions"
import { Player } from "../../utils/player"
import { CalcCanAffordUpgrade, canAffordUpgrade, canAffordUpgradeResourceArr } from "../../utils/upgradeCalculations"
import { oneDecimal } from '../../utils/formatters';

type UpgradePropType = {
  player: Player,
  upgradeName: UpgradeName,
  buy: () => void

}
export const Upgrade = (props: UpgradePropType) => {
  const canAffordArr = CalcCanAffordUpgrade(props.player, props.upgradeName);
  const canAfford = canAffordUpgrade(props.player, props.upgradeName, canAffordArr);
  return (
    <div
      className={'upgradecell forthis ' + (canAfford ? 'clickable' : '')}
      onClick={() => {if (canAfford) props.buy()}}
    >
      <div>{props.upgradeName}</div>
      <UpgradeCosts canAffordArr={canAffordArr} upgradeName={props.upgradeName}/>
      <div className='showthat'>
        {UpgradeDefinitions[props.upgradeName].description}
      </div>
    </div>
  )
}

const UpgradeCosts = (props: {canAffordArr: canAffordUpgradeResourceArr, upgradeName: UpgradeName}) => {
  return (
    <div className='upgradecost'>
      {UpgradeDefinitions[props.upgradeName].cost.map( c => {
        const canAffordItem = props.canAffordArr.find((item) => item.resourceName === c.resourceName);
        const canAfford = canAffordItem && canAffordItem.hasEnough;
        const resText = c.resourceName.substring(0,1) + ' : ' + oneDecimal(c.amount)
        return <span key={props.upgradeName + '-' + c.resourceName} className={canAfford ? '' : 'notenoughresource'}>{resText}</span>
      })}
    </div>
  );
}