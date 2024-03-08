import { useState } from "react"
import { HistoricForm, HistoricFormValues } from "./HistoricForm"
import { fetchHistoricData } from "../api/fetchHistoricData"
import { getPortoflioResults } from "./utils"
import { HistoricResults } from "./HistoricResults"

export type AllocationPerformance = {
  symbol: string
  percentageChange: number
  absoluteChange: number
}

export type PortfolioResults = {
  currentValue: number
  allocationPerformances: AllocationPerformance[]
}

export const Historic = () => {
  // TODO: Add state -- error, loading, loaded. React Query?
  const [results, setResults] = useState<PortfolioResults|undefined>()

  const onSubmit = async (values: HistoricFormValues) => {
    // TODO: Better validation -- ReactHookForm?

    if(!values.date || !values.initialBalance || !values.allocations.length) {
      // TODO: Show error state
      console.log("Missing")
      return 
    }

    const historicData = await fetchHistoricData(values)
    if (historicData) {
     setResults(getPortoflioResults(historicData, values))
    } else {
      console.log("Error")
    }
    
  }

  return <div>
    <HistoricForm onSubmit={onSubmit}/>
    { results ? <HistoricResults portfolioResults={results}/> : <> </>}
    <></>
  </div>
}

