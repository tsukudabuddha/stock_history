import { AllocationPerformance } from './Historic'
import { Fragment } from "react/jsx-runtime"
import { PortfolioResults } from "./Historic"
import { formatCurrency, formatPercentage } from "./utils"
import { AgGridReact } from 'ag-grid-react'; // AG Grid Component
import { ColDef } from 'ag-grid-community'
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the grid
import "ag-grid-community/styles/ag-theme-quartz.css"; // Optional Theme applied to the grid
import { ValueFormatterParams } from 'ag-grid-community';

type Params = {
  portfolioResults: PortfolioResults
}

export const HistoricResults = ({ portfolioResults : { allocationPerformances, currentValue } }: Params) => {
  const colDefs: ColDef<AllocationPerformance>[] = [
    {
       field: 'symbol',
       valueFormatter: (params: ValueFormatterParams<AllocationPerformance, string>) => {
           return params.value ?? "Unknown"
       }
   },
   {
        field: 'percentageChange',
        headerName: 'Total Percentage Change',
        valueFormatter: (params: ValueFormatterParams<AllocationPerformance, number>) => {
            return params.value ? formatPercentage(params.value) : "Unknown"
        }
    },
    {
      field: 'absoluteChange',
      headerName: 'Total Dollar Change',
      valueFormatter: (params: ValueFormatterParams<AllocationPerformance, number>) => {
          return params.value ? formatCurrency(params.value) : "Unknown"
      }
  },
]

  return (
  <div style={{marginTop: 40}}>
    <Fragment>{`Current Portfolio Value: ${formatCurrency(currentValue)}`}</Fragment>
      <div
        className="ag-theme-quartz" // applying the grid theme
        style={{ height: 500 }} // the grid will fill the size of the parent container
      >
        <AgGridReact<AllocationPerformance>
          rowData={allocationPerformances}
          columnDefs={colDefs}
        />
      </div>
  </div>
  )
}