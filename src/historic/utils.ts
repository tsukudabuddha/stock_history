import { HistoricResponse } from "../api/fetchHistoricData";
import { AllocationPerformance, PortfolioResults } from "./Historic";
import { HistoricFormValues } from "./HistoricForm";

export const getPortoflioResults = ({ initial_data, yesterday_data}: HistoricResponse, formValues: HistoricFormValues):PortfolioResults | undefined => {
  // guard data is same size
  if (initial_data.length != yesterday_data.length) {
    return
  }

  var i = 0
  var allocationPerformances: AllocationPerformance[] = []
  var profit_all = 0
  while (i < initial_data.length) {
    const price_initial = initial_data[i][1]
    const price_yesterday = yesterday_data[i][1]
    const symbol = initial_data[i][0]

    const profit_share = (price_yesterday - price_initial)
    const profit_total = profit_share * formValues.allocations[symbol]
    profit_all += profit_total

    const allocation: AllocationPerformance = {
      symbol,
      percentageChange: profit_share / price_initial,
      absoluteChange: profit_total,
    }

    allocationPerformances.push(allocation)

    i += 1
  }

  return {
    allocationPerformances,
    currentValue: profit_all + formValues.initialBalance
  }

}

export const formatPercentage = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 2, // Minimum number of digits after the decimal point
    maximumFractionDigits: 2, // Maximum number of digits after the decimal point
  }).format(value)
}

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    // Optional: You can specify additional options as needed
    minimumFractionDigits: 2, // Minimum number of digits after the decimal point
    maximumFractionDigits: 2, // Maximum number of digits after the decimal point
  }).format(value)
}