import React, { useState } from 'react';

export type HistoricFormValues = {
  date: string
  initialBalance: number
  allocations: Record<string, number>
}

type Params = {
  onSubmit: (values: HistoricFormValues) => void
}

export const HistoricForm = ({ onSubmit }: Params) => {
  const [values, setValues] = useState<HistoricFormValues>({ date: '', initialBalance: 0, allocations: {} })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setValues({
      ...values,
      [name]: name === 'initialBalance' ? Number(value) : value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log(values)
    
    onSubmit(values)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="date">Date (YYYY-MM-DD):</label>
        <input type="date" id="date" name="date" value={values.date} onChange={handleInputChange} />
      </div>
      <div>
        <label htmlFor="initialBalance">Initial Balance:</label>
        <input type="number" id="initialBalance" name="initialBalance" value={values.initialBalance} onChange={handleInputChange} />
      </div>
      <div>
        <label htmlFor="allocations">Allocations (format: "AAPL:50,MSFT:50"):</label>
        <input type="text" id="allocations" name="allocations" onChange={(e) => {
          const allocationString = e.target.value;
          const allocationArray = allocationString.split(',');
          const allocations = allocationArray.reduce((acc, curr) => {
            const [key, value] = curr.split(':');
            return { ...acc, [key.trim()]: Number(value) }
          }, {})
          setValues({ ...values, allocations });
        }} />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};
