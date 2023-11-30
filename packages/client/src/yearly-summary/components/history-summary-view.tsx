import * as React from 'react';
import { HistorySummary } from '@service/domain/history/history-summary';

export interface HistorySummaryViewProps {
  historySummary: HistorySummary,
}

export function HistorySummaryView({ historySummary }: HistorySummaryViewProps) {
  return (
    <div className="summary-view">
      <h2>Played {historySummary.totalSongPlayCount} songs</h2>

      <div className="yearly-summary-tables-container">
        <table className="yearly-summary-table">
          <thead>
            <tr>
              <th className="yearly-summary-th">Title</th>
              <th className="yearly-summary-th">Play count</th>
            </tr>
          </thead>

          <tbody>
            {historySummary.mostPopularSongs.slice(0, 10).map((songPopularity) => (
              <tr key={songPopularity.song.youtubeId}>
                <td className="yearly-summary-td">
                  <a href={`https://www.youtube.com/watch?v=${songPopularity.song.youtubeId}`} target="_blank" rel="noreferrer">
                    {songPopularity.song.name}
                  </a>
                </td>

                <td className="yearly-summary-td">{songPopularity.playCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
