import './Upgrade.css';
import { UpgradeDefinitions, UpgradeName } from "../../utils/definitions"
import { Player } from "../../utils/player"
import { CalcCanAffordUpgrade, canAffordUpgrade } from "../../utils/upgradeCalculations"

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
      {props.upgradeName}
      <div className='showthat'>
        {UpgradeDefinitions[props.upgradeName].description}
      </div>
    </div>
  )
}