import { Fragment } from "react/jsx-runtime"
import { PortfolioResults } from "./Historic"
import { formatCurrency, formatPercentage } from "./utils"

type Params = {
  portfolioResults: PortfolioResults
}
export const HistoricResults = ({ portfolioResults }: Params) => {
  return <>
    <Fragment>{`Current Portfolio Value: ${portfolioResults.currentValue}`}</Fragment>
    <div style={{flexDirection: "column"}}>
    {
      portfolioResults.allocationPerformances.map(allocation => 
        <Fragment>{`${allocation.symbol} - ${formatPercentage(allocation.percentageChange)} ${formatCurrency(allocation.absoluteChange)}`}</Fragment>
        )
    }
    </div>
  </>
}