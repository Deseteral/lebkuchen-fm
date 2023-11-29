import * as React from 'react';
import { YearlyHistorySummary } from '@service/domain/history/history-summary';
import '../yearly-summary.css';

export function YearlySummary() {
  const [yearOptions, setYearOptions] = React.useState<YearlyHistorySummary[]>([]);
  const [selectedYearOption, setSelectedYearOption] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch('/api/history/summary/years').then((data) => data.json()).then(({ years }) => {
      setYearOptions(years);
      setSelectedYearOption(years[0]);
    });
  }, []);

  const onYearSelectionChange = (nextValue: string) => {
    setSelectedYearOption(nextValue);
  };

  return (
    <main className="yearly-summary-container">
      <h1>Yearly summary</h1>
      {(yearOptions.length > 0 && selectedYearOption !== null) && (
        <select value={selectedYearOption} onChange={(e) => onYearSelectionChange(e.target.value)}>
          {yearOptions.map((yearOption) => (
            <option value={yearOption.label} key={yearOption.label}>{yearOption.label}</option>
          ))}
        </select>
      )}
    </main>
  );
}
