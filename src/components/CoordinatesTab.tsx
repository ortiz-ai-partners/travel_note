import React, { useState } from 'react';
import type { AppData, CoordinateItem } from '../types';
import { Info, Shirt as ShirtIcon } from 'lucide-react';

interface Props {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
}

const CoordinatesTab: React.FC<Props> = ({ data, setData }) => {
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);

  const updateCoord = (day: number, field: keyof CoordinateItem, value: string) => {
    const newData = { ...data };
    if (!newData.coordinates[day]) {
      newData.coordinates[day] = { jacket: '', inner: '', bottoms: '', shoes: '', memo: '' };
    }
    newData.coordinates[day][field] = value;
    setData(newData);
  };

  const updateDayDate = (dayIdx: number, newDate: string) => {
    const newData = { ...data };
    newData.schedule[dayIdx].date = newDate;
    setData(newData);
  };

  const currentDay = data.schedule[selectedDayIdx];
  const coord = data.coordinates[currentDay?.day] || { jacket: '', inner: '', bottoms: '', shoes: '', memo: '' };

  if (!currentDay) return <div>旅程がありません。</div>;

  return (
    <div className="coordinates-tab">
      <div className="day-tabs">
        {data.schedule.map((day, idx) => (
          <button
            key={day.day}
            className={`day-tab-btn ${selectedDayIdx === idx ? 'active' : ''}`}
            onClick={() => setSelectedDayIdx(idx)}
          >
            Day {day.day}
          </button>
        ))}
      </div>

      <div className="coord-card card">
        <div className="coord-header">
          <ShirtIcon size={24} color="var(--antique-gold)" />
          <div style={{ flex: 1 }}>
            <input
              type="text"
              className="coord-date-input"
              value={currentDay.date}
              onChange={(e) => updateDayDate(selectedDayIdx, e.target.value)}
            />
            <div className="coord-day-theme">探索の題名: 「{currentDay.title}」</div>
          </div>
        </div>

        <div className="coord-grid">
          <div className="coord-item">
            <label>上着 / 羽織</label>
            <input
              type="text"
              value={coord.jacket}
              onChange={(e) => updateCoord(currentDay.day, 'jacket', e.target.value)}
              placeholder="例: ベージュのジャケット"
            />
          </div>
          <div className="coord-item">
            <label>インナー / 衣</label>
            <input
              type="text"
              value={coord.inner}
              onChange={(e) => updateCoord(currentDay.day, 'inner', e.target.value)}
              placeholder="例: 白シャツ"
            />
          </div>
          <div className="coord-item">
            <label>下衣 / ボトムス</label>
            <input
              type="text"
              value={coord.bottoms}
              onChange={(e) => updateCoord(currentDay.day, 'bottoms', e.target.value)}
              placeholder="例: 無地のデニム"
            />
          </div>
          <div className="coord-item">
            <label>足元 / 履物</label>
            <input
              type="text"
              value={coord.shoes}
              onChange={(e) => updateCoord(currentDay.day, 'shoes', e.target.value)}
              placeholder="例: 歩きやすいスニーカー"
            />
          </div>
        </div>

        <div className="coord-memo">
          <label><Info size={14} /> 備忘録</label>
          <textarea
            value={coord.memo}
            onChange={(e) => updateCoord(currentDay.day, 'memo', e.target.value)}
            placeholder="小物の合わせ方や、気候への備えなど..."
          />
        </div>
      </div>

      <style>{`
        .coordinates-tab {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .day-tabs {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
        }
        .day-tab-btn {
          padding: 0.5rem 1rem;
          background: var(--parchment-dark);
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 4px;
          color: var(--antique-ink);
          font-family: var(--font-serif);
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
        }
        .day-tab-btn.active {
          background: var(--antique-gold);
          color: white;
          border-color: var(--antique-gold);
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        .coord-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          border-bottom: 1px dashed var(--antique-gold);
          padding-bottom: 1rem;
        }
        .coord-day-title {
          font-size: 1.1rem;
          color: var(--antique-red);
          margin-bottom: 0.2rem;
        }
        .coord-date-input {
          font-size: 1.1rem;
          color: var(--antique-red);
          background: transparent;
          border: none;
          font-family: var(--font-serif);
          font-weight: 700;
          width: 100%;
          padding: 0;
        }
        .coord-date-input:focus {
          outline: none;
          background: rgba(142, 33, 33, 0.05);
        }
        .coord-day-theme {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-style: italic;
          font-family: var(--font-serif);
        }
        .coord-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }
        .coord-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .coord-item label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--antique-ink);
          font-family: var(--font-serif);
        }
        .coord-item input {
          border: none;
          border-bottom: 1px solid var(--parchment-dark);
          padding: 0.5rem 0;
          font-size: 0.9rem;
          color: var(--text-main);
          background: transparent;
          font-family: var(--font-serif);
        }
        .coord-item input:focus {
          outline: none;
          border-bottom-color: var(--antique-gold);
        }
        .coord-memo {
          margin-top: 1rem;
          background: rgba(0,0,0,0.03);
          padding: 1rem;
          border-radius: 4px;
          border-left: 2px solid var(--antique-gold);
        }
        .coord-memo label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--antique-ink);
          margin-bottom: 0.5rem;
          font-family: var(--font-serif);
        }
        .coord-memo textarea {
          width: 100%;
          border: none;
          background: transparent;
          font-size: 0.85rem;
          color: var(--text-main);
          resize: none;
          height: 80px;
          font-family: inherit;
        }
        .coord-memo textarea:focus {
          outline: none;
        }
      `}</style>
    </div>
  );
};

export default CoordinatesTab;
