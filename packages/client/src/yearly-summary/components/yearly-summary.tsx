import * as React from 'react';
import { HistorySummary, YearlyHistorySummary } from '@service/domain/history/history-summary';
import '../yearly-summary.css';
import { HistorySummaryResponseDto, HistorySummaryYearsResponseDto } from '@service/api/history/model/history-summary-response-dto';
import { HistorySummaryView } from './history-summary-view';

export function YearlySummary() {
  const [yearOptions, setYearOptions] = React.useState<YearlyHistorySummary[]>([]);
  const [selectedYearOption, setSelectedYearOption] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [historySummary, setHistorySummary] = React.useState<HistorySummary | null>(null);

  const fetchHistorySummary = async (url: string) => {
    setIsLoading(true);

    const response: HistorySummaryResponseDto = await (await fetch(url)).json();

    setIsLoading(false);
    setHistorySummary(response.summary);
  };

  const onYearSelectionChange = async (nextValue: string) => {
    setSelectedYearOption(nextValue);
    const { url } = yearOptions.find((e) => e.label === nextValue)!;
    await fetchHistorySummary(url);
  };

  React.useEffect(() => {
    (async () => {
      const response: HistorySummaryYearsResponseDto = await (await fetch('/api/history/summary/years')).json();
      setYearOptions(response.years);
      setSelectedYearOption(response.years[0].label);
      await fetchHistorySummary(response.years[0].url);
    })();
  }, []);

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

      {isLoading && <div>Loading...</div>}

      {!!historySummary && !!selectedYearOption && (
        <HistorySummaryView year={selectedYearOption} historySummary={historySummary} />
      )}

    </main>
  );
}
