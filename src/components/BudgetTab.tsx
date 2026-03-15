import React from 'react';
import type { AppData, BudgetItem } from '../types';
import { TrendingUp, Info, CreditCard, Plus, Trash2 } from 'lucide-react';

interface Props {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
}

const BudgetTab: React.FC<Props> = ({ data, setData }) => {
  const scheduleExpenses = data.schedule.map(day => {
    const planned = day.items.reduce((sum, item) => sum + (item.expense || 0), 0);
    const actual = day.items.reduce((sum, item) => sum + (item.actualExpense || 0), 0);
    return { day: day.day, planned, actual };
  });

  const travelPlannedTotal = scheduleExpenses.reduce((sum, d) => sum + d.planned, 0);
  const travelActualTotal = scheduleExpenses.reduce((sum, d) => sum + d.actual, 0);

  const prepTotal = data.budget.reduce((sum, item) => sum + item.amount, 0);
  const grandPlannedTotal = travelPlannedTotal + prepTotal;
  const grandActualTotal = travelActualTotal + prepTotal;

  const updateManualBudget = (id: string, field: keyof BudgetItem, value: string) => {
    const newData = { ...data };
    const item = newData.budget.find(i => i.id === id);
    if (item) {
      if (field === 'amount') item.amount = parseInt(value) || 0;
      else if (field === 'status') (item as any).status = value;
      else if (field === 'name') (item as any).name = value;
    }
    setData(newData);
  };

  const addBudgetItem = () => {
    const newData = { ...data };
    newData.budget.push({
      id: `b-${Date.now()}`,
      name: '新しい項目',
      amount: 0,
      status: '未定'
    });
    setData(newData);
  };

  const removeBudgetItem = (id: string) => {
    if (window.confirm('この予算項目を削除しますか？')) {
      const newData = { ...data };
      newData.budget = newData.budget.filter(i => i.id !== id);
      setData(newData);
    }
  };

  return (
    <div className="budget-tab">
      <div className="total-card card">
        <div className="total-label">冒険の総費用</div>
        <div className="total-amount">
          <span className="actual-grand">¥ {grandActualTotal.toLocaleString()}</span>
          {grandActualTotal !== grandPlannedTotal && (
            <span className="planned-grand"> (予定: ¥ {grandPlannedTotal.toLocaleString()})</span>
          )}
        </div>
        <div className="total-breakdown">
          <span>事前準備: ¥ {prepTotal.toLocaleString()}</span>
          <span>現地出費: ¥ {travelActualTotal.toLocaleString()}</span>
        </div>
      </div>

      <div className="section-title"><TrendingUp size={16} /> 現地での出費状況</div>
      <div className="schedule-summary-container">
        {scheduleExpenses.map(d => (
          <div key={d.day} className="summary-card card">
            <div className="summary-day">Day {d.day}</div>
            <div className="summary-details">
              <div className="summary-row">
                <span className="row-label">予定額</span>
                <span className="row-value planned">¥ {d.planned.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span className="row-label">実績（実費）</span>
                <span className="row-value actual">¥ {d.actual.toLocaleString()}</span>
              </div>
              <div className="summary-progress-bar">
                <div
                  className={`progress-fill ${d.actual > d.planned ? 'over' : ''}`}
                  style={{ width: `${Math.min(100, d.planned === 0 ? 0 : (d.actual / d.planned) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="section-title"><CreditCard size={16} /> 事前準備の費用</div>
      <div className="manual-budget card">
        {data.budget.map(item => (
          <div key={item.id} className="budget-item">
            <div className="budget-item-main">
              <input
                type="text"
                className="budget-item-name-input"
                value={item.name}
                onChange={(e) => updateManualBudget(item.id, 'name', e.target.value)}
                placeholder="項目名..."
              />
              <div className="budget-item-inputs">
                <span className="currency-symbol">¥</span>
                <input
                  type="number"
                  className="amount-input"
                  value={item.amount === 0 ? '' : item.amount}
                  onChange={(e) => updateManualBudget(item.id, 'amount', e.target.value)}
                  placeholder="0"
                />
                <button className="budget-delete-btn" onClick={() => removeBudgetItem(item.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <div className="budget-item-status">
              <Info size={12} />
              <input
                type="text"
                className="status-input"
                value={item.status}
                onChange={(e) => updateManualBudget(item.id, 'status', e.target.value)}
                placeholder="備考（支払い済み等）..."
              />
            </div>
          </div>
        ))}
        <button className="add-budget-btn" onClick={addBudgetItem}>
          <Plus size={16} /> 予算項目を追加
        </button>
      </div>

      <style>{`
        .budget-tab {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .total-card {
          background: linear-gradient(135deg, var(--parchment), #fff);
          border: 2px solid var(--antique-gold);
          text-align: center;
          padding: 2rem;
        }
        .total-label {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--antique-ink);
          font-family: var(--font-serif);
          margin-bottom: 0.5rem;
        }
        .total-amount {
          margin-bottom: 1rem;
        }
        .actual-grand {
          font-family: var(--font-serif);
          font-size: 2.5rem;
          font-weight: 800;
          color: var(--antique-red);
        }
        .planned-grand {
          font-size: 1rem;
          color: var(--text-muted);
          font-weight: 600;
        }
        .total-breakdown {
          display: flex;
          justify-content: center;
          gap: 2rem;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--antique-ink);
        }
        .section-title {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-family: var(--font-serif);
          font-size: 1.1rem;
          color: var(--antique-ink);
          margin-top: 1rem;
          border-bottom: 1px solid var(--parchment-dark);
          padding-bottom: 0.5rem;
        }
        .schedule-summary-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }
        .summary-card {
          padding: 1rem;
          background: var(--parchment);
        }
        .summary-day {
          font-family: var(--font-serif);
          font-weight: 800;
          color: var(--antique-ink);
          margin-bottom: 0.8rem;
          border-bottom: 1px dotted var(--parchment-dark);
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.8rem;
          margin-bottom: 0.3rem;
        }
        .row-label {
          color: var(--text-muted);
        }
        .row-value.planned {
          color: var(--antique-ink);
        }
        .row-value.actual {
          color: var(--antique-red);
          font-weight: 700;
        }
        .summary-progress-bar {
          height: 6px;
          background: rgba(0,0,0,0.05);
          border-radius: 3px;
          overflow: hidden;
          margin-top: 0.5rem;
        }
        .progress-fill {
          height: 100%;
          background: var(--antique-gold);
          transition: width 0.3s ease;
        }
        .progress-fill.over {
          background: var(--antique-red);
        }
        .manual-budget {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .budget-item {
          padding-bottom: 1rem;
          border-bottom: 1px dotted var(--parchment-dark);
        }
        .budget-item-main {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
          gap: 1rem;
        }
        .budget-item-name-input {
          font-weight: 700;
          font-size: 1rem;
          font-family: var(--font-serif);
          border: none;
          background: transparent;
          color: var(--antique-ink);
          flex: 1;
          padding: 2px 0;
          border-bottom: 1px solid transparent;
        }
        .budget-item-name-input:focus {
          outline: none;
          border-bottom: 1px dotted var(--antique-gold);
          background: rgba(197, 160, 89, 0.05);
        }
        .budget-item-inputs {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .budget-delete-btn {
          color: var(--parchment-dark);
          transition: color 0.2s;
          padding: 0.2rem;
        }
        .budget-delete-btn:hover {
          color: var(--antique-red);
        }
        .add-budget-btn {
          margin-top: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.8rem;
          background: transparent;
          border: 1px dashed var(--antique-gold);
          border-radius: 4px;
          color: var(--antique-gold);
          font-family: var(--font-serif);
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .add-budget-btn:hover {
          background: rgba(197, 160, 89, 0.1);
        }
        .amount-input {
          width: 100px;
          border: none;
          border-bottom: 1px solid var(--antique-gold);
          text-align: right;
          font-weight: 700;
          color: var(--antique-red);
          font-size: 1.1rem;
          background: transparent;
        }
        .budget-item-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          color: var(--text-muted);
          font-style: italic;
        }
        .status-input {
          flex: 1;
          border: none;
          background: transparent;
          color: inherit;
          font-family: inherit;
        }
      `}</style>
    </div>
  );
};

export default BudgetTab;
