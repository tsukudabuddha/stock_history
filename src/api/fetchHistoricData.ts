import { HistoricFormValues } from "../historic/HistoricForm"

type SymbolValuePair = [string, number]

export type HistoricResponse = {
  initial_data: SymbolValuePair[]
  yesterday_data: SymbolValuePair[]
}


export const fetchHistoricData = async (formValues: HistoricFormValues): Promise<HistoricResponse | null> => {
  const symbols = Object.keys(formValues.allocations).join(',')
  const dateInitial = formValues.date;
  const url = `http://localhost:4000/api/fetch-data?symbols=${symbols}&date_initial=${dateInitial}`;

  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`)
    }

    const data: HistoricResponse = await response.json()
    console.log(data)
    return data;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    return null;
  }
};
