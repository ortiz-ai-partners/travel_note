import React, { useState } from 'react';
import type { AppData, TripItem } from '../types';
import { MapPin, Notebook, Plus, CheckCircle2, Circle, Trash2, Plane, Train, Bus, Car, Footprints, ExternalLink, Link, Lock, Unlock, Bike, Ship, Bot, TramFront } from 'lucide-react';

interface Props {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  addDay?: () => void;
  removeDay?: (dayNum: number) => void;
}

const ScheduleTab: React.FC<Props> = ({ data, setData, addDay, removeDay }) => {
  const [unlockedItems, setUnlockedItems] = useState<Record<string, boolean>>({});
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);

  const toggleComplete = (dayIndex: number, itemId: string) => {
    const newData = { ...data };
    const item = newData.schedule[dayIndex].items.find(i => i.id === itemId);
    if (item) item.completed = !item.completed;
    setData(newData);
  };

  const updateItem = (dayIndex: number, itemId: string, field: keyof TripItem, value: any) => {
    const newData = { ...data };
    const item = newData.schedule[dayIndex].items.find(i => i.id === itemId);
    if (item) {
      (item as any)[field] = value;
    }
    setData(newData);
  };

  const updateDayTitle = (dayIdx: number, newTitle: string) => {
    const newData = { ...data };
    newData.schedule[dayIdx].title = newTitle;
    setData(newData);
  };

  const updateDayDate = (dayIdx: number, newDate: string) => {
    const newData = { ...data };
    newData.schedule[dayIdx].date = newDate;
    setData(newData);
  };

  const addExpenseDetail = (dayIdx: number, itemId: string) => {
    const newData = { ...data };
    const item = newData.schedule[dayIdx].items.find(i => i.id === itemId);
    if (item) {
      if (!item.expenseDetails) item.expenseDetails = [];
      item.expenseDetails.push({
        id: `ed-${Date.now()}`,
        name: '新しい項目',
        amount: 0
      });
      // 実費合計を更新
      item.actualExpense = item.expenseDetails.reduce((sum, d) => sum + d.amount, 0);
    }
    setData(newData);
  };

  const removeExpenseDetail = (dayIdx: number, itemId: string, detailId: string) => {
    const newData = { ...data };
    const item = newData.schedule[dayIdx].items.find(i => i.id === itemId);
    if (item && item.expenseDetails) {
      item.expenseDetails = item.expenseDetails.filter(d => d.id !== detailId);
      item.actualExpense = item.expenseDetails.reduce((sum, d) => sum + d.amount, 0);
    }
    setData(newData);
  };

  const updateExpenseDetail = (dayIdx: number, itemId: string, detailId: string, field: 'name' | 'amount', value: any) => {
    const newData = { ...data };
    const item = newData.schedule[dayIdx].items.find(i => i.id === itemId);
    if (item && item.expenseDetails) {
      const detail = item.expenseDetails.find(d => d.id === detailId);
      if (detail) {
        if (field === 'amount') detail.amount = parseInt(value) || 0;
        else detail.name = value;
        // 実費合計を更新
        item.actualExpense = item.expenseDetails.reduce((sum, d) => sum + d.amount, 0);
      }
    }
    setData(newData);
  };

  const addItem = (dayIndex: number) => {
    const newData = { ...data };
    const newItem: TripItem = {
      id: `s-${Date.now()}`,
      time: '12:00',
      name: '新しい予定',
      location: '',
      memo: '',
      privateMemo: '',
      expense: 0,
      completed: false
    };
    newData.schedule[dayIndex].items.push(newItem);
    setData(newData);
  };

  const removeItem = (dayIndex: number, itemId: string) => {
    if (window.confirm('この予定を削除しますか？')) {
      const newData = { ...data };
      newData.schedule[dayIndex].items = newData.schedule[dayIndex].items.filter(i => i.id !== itemId);
      setData(newData);
    }
  };

  const handleUnlock = (itemId: string) => {
    if (unlockedItems[itemId]) {
      setUnlockedItems({ ...unlockedItems, [itemId]: false });
      return;
    }

    const currentPasscode = data.passcode || '';
    if (!currentPasscode) {
      const newPass = window.prompt('裏メモ用のパスコードを新しく設定してください:');
      if (newPass) {
        setData({ ...data, passcode: newPass });
        setUnlockedItems({ ...unlockedItems, [itemId]: true });
      }
    } else {
      const input = window.prompt('パスコードを入力してください:');
      if (input === currentPasscode) {
        setUnlockedItems({ ...unlockedItems, [itemId]: true });
      } else if (input !== null) {
        alert('パスコードが違います。');
      }
    }
  };

  const handleDragStart = (e: React.DragEvent, dayIdx: number, itemIdx: number) => {
    e.dataTransfer.setData('dayIdx', dayIdx.toString());
    e.dataTransfer.setData('itemIdx', itemIdx.toString());
    e.currentTarget.classList.add('dragging');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetDayIdx: number, targetItemIdx: number) => {
    e.preventDefault();
    const sourceDayIdx = parseInt(e.dataTransfer.getData('dayIdx'));
    const sourceItemIdx = parseInt(e.dataTransfer.getData('itemIdx'));

    if (sourceDayIdx !== targetDayIdx) return; // 現状は同日内のみサポート

    const newData = { ...data };
    const items = [...newData.schedule[targetDayIdx].items];
    const [reorderedItem] = items.splice(sourceItemIdx, 1);
    items.splice(targetItemIdx, 0, reorderedItem);
    newData.schedule[targetDayIdx].items = items;
    setData(newData);

    // ドラッグ中のスタイルを解除
    const draggingElements = document.querySelectorAll('.dragging');
    draggingElements.forEach(el => el.classList.remove('dragging'));
  };

  const getTransportIcon = (type?: string) => {
    switch (type) {
      case 'plane': return <Plane size={14} />;
      case 'train': return <Train size={14} />;
      case 'bus': return <Bus size={14} />;
      case 'car': return <Car size={14} />;
      case 'walk': return <Footprints size={14} />;
      case 'bike': return <Bike size={14} />;
      case 'ship': return <Ship size={14} />;
      case 'robot': return <Bot size={14} />;
      case 'tram': return <TramFront size={14} />;
      default: return null;
    }
  };

  const cycleTransport = (dayIdx: number, itemId: string, current?: string) => {
    const types: (string | undefined)[] = [undefined, 'plane', 'train', 'bus', 'car', 'walk', 'bike', 'ship', 'robot', 'tram'];
    const currentIndex = types.indexOf(current);
    const nextIndex = (currentIndex + 1) % types.length;
    updateItem(dayIdx, itemId, 'transport', types[nextIndex]);
  };

  const totalItems = data.schedule.reduce((acc, day) => acc + day.items.length, 0);
  const completedItems = data.schedule.reduce((acc, day) => acc + day.items.filter(i => i.completed).length, 0);
  const progress = totalItems === 0 ? 0 : Math.round((completedItems / totalItems) * 100);

  return (
    <div className="schedule-tab">
      <div className="overall-progress card">
        <div className="progress-info">
          <span className="progress-label">冒険の達成度</span>
          <span className="progress-percent">{progress}%</span>
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

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
        {addDay && (
          <button className="day-add-tab-btn" onClick={addDay} title="日数を増やす">
            <Plus size={14} />
          </button>
        )}
      </div>

      {data.schedule[selectedDayIdx] && (
        <div className="day-section card">
          <div className="day-header">
            <div className="day-number">{data.schedule[selectedDayIdx].day}</div>
            <div className="day-info">
              <input
                type="text"
                className="day-date-input"
                value={data.schedule[selectedDayIdx].date}
                onChange={(e) => updateDayDate(selectedDayIdx, e.target.value)}
              />
              <input
                type="text"
                className="day-title-input"
                value={data.schedule[selectedDayIdx].title}
                onChange={(e) => updateDayTitle(selectedDayIdx, e.target.value)}
              />
            </div>
            {removeDay && (
              <button
                className="remove-day-btn"
                onClick={() => {
                  removeDay(data.schedule[selectedDayIdx].day);
                  if (selectedDayIdx > 0) setSelectedDayIdx(selectedDayIdx - 1);
                }}
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          <div className="timeline">
            {data.schedule[selectedDayIdx].items.map((item, itemIdx) => (
              <div
                key={item.id}
                className={`timeline-item ${item.completed ? 'completed' : ''}`}
                draggable={true}
                onDragStart={(e) => handleDragStart(e, selectedDayIdx, itemIdx)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, selectedDayIdx, itemIdx)}
                onDragEnd={(e) => e.currentTarget.classList.remove('dragging')}
              >
                <div className="timeline-left">
                  <input
                    type="text"
                    className="time-input"
                    value={item.time}
                    onChange={(e) => updateItem(selectedDayIdx, item.id, 'time', e.target.value)}
                  />
                  <div className="connector"></div>
                </div>

                <div className="timeline-content">
                  <div className="item-main">
                    <button className="complete-btn" onClick={() => toggleComplete(selectedDayIdx, item.id)}>
                      {item.completed ? <CheckCircle2 size={20} color="var(--antique-green)" /> : <Circle size={20} color="#ccc" />}
                    </button>
                    <div className="item-body">
                      <div className="item-name-row">
                        <input
                          type="text"
                          className="item-name-input"
                          value={item.name}
                          onChange={(e) => updateItem(selectedDayIdx, item.id, 'name', e.target.value)}
                        />
                        <button
                          className="transport-toggle-btn"
                          onClick={() => cycleTransport(selectedDayIdx, item.id, item.transport)}
                          title="移動手段を切り替え"
                        >
                          {getTransportIcon(item.transport) || <Circle size={14} className="transport-empty" />}
                        </button>
                      </div>
                      <div className="item-location">
                        <MapPin size={12} />
                        <input
                          type="text"
                          className="location-input"
                          placeholder="場所"
                          value={item.location}
                          onChange={(e) => updateItem(selectedDayIdx, item.id, 'location', e.target.value)}
                        />
                      </div>
                    </div>
                    <button className="item-delete-btn" onClick={() => removeItem(selectedDayIdx, item.id)}><Trash2 size={14} /></button>
                  </div>

                  <div className="item-details">
                    <div className="detail-row">
                      <ExternalLink size={12} />
                      <input
                        type="text"
                        className="memo-input"
                        placeholder="Googleマップリンク"
                        value={item.mapLink || ''}
                        onChange={(e) => updateItem(selectedDayIdx, item.id, 'mapLink', e.target.value)}
                      />
                      {item.mapLink && <a href={item.mapLink} target="_blank" rel="noreferrer" className="link-icon-btn"><ExternalLink size={14} /></a>}
                    </div>
                    <div className="detail-row">
                      <Link size={12} />
                      <input
                        type="text"
                        className="memo-input"
                        placeholder="予約・HPリンク"
                        value={item.bookingLink || ''}
                        onChange={(e) => updateItem(selectedDayIdx, item.id, 'bookingLink', e.target.value)}
                      />
                      {item.bookingLink && <a href={item.bookingLink} target="_blank" rel="noreferrer" className="link-icon-btn"><Link size={14} /></a>}
                    </div>
                    <div className="detail-row">
                      <Notebook size={12} />
                      <textarea
                        className="memo-textarea"
                        placeholder="みんなのメモ..."
                        value={item.memo}
                        onChange={(e) => updateItem(selectedDayIdx, item.id, 'memo', e.target.value)}
                      />
                    </div>

                    {/* 裏メモセクション */}
                    <div className={`private-memo-container ${unlockedItems[item.id] ? 'unlocked' : 'locked'}`}>
                      <div className="private-header" onClick={() => handleUnlock(item.id)}>
                        {unlockedItems[item.id] ? <Unlock size={12} /> : <Lock size={12} />}
                        <span>自分だけの裏メモ</span>
                      </div>
                      {unlockedItems[item.id] && (
                        <textarea
                          className="private-textarea"
                          placeholder="ここだけの内緒話..."
                          value={item.privateMemo || ''}
                          onChange={(e) => updateItem(selectedDayIdx, item.id, 'privateMemo', e.target.value)}
                        />
                      )}
                    </div>

                    <div className="item-expenses-edit">
                      <div className="expense-field">
                        <span className="expense-label">予定額:</span>
                        <div className="expense-input-wrapper">
                          <span>¥</span>
                          <input
                            type="number"
                            className="expense-mini-input"
                            value={item.expense === 0 ? '' : item.expense}
                            onChange={(e) => updateItem(selectedDayIdx, item.id, 'expense', parseInt(e.target.value) || 0)}
                            placeholder="0"
                          />
                        </div>
                      </div>
                      <div className="expense-field">
                        <span className="expense-label">実費:</span>
                        <div className="expense-input-wrapper actual">
                          <span>¥</span>
                          <input
                            type="number"
                            className="expense-mini-input"
                            value={item.actualExpense === undefined || item.actualExpense === 0 ? '' : item.actualExpense}
                            onChange={(e) => updateItem(selectedDayIdx, item.id, 'actualExpense', parseInt(e.target.value) || 0)}
                            placeholder="0"
                            readOnly={item.expenseDetails && item.expenseDetails.length > 0}
                          />
                        </div>
                      </div>
                      <button className="add-expense-detail-btn" onClick={() => addExpenseDetail(selectedDayIdx, item.id)}>
                        <Plus size={12} /> 内訳を入力
                      </button>
                    </div>

                    {item.expenseDetails && item.expenseDetails.length > 0 && (
                      <div className="expense-details-list">
                        {item.expenseDetails.map((detail) => (
                          <div key={detail.id} className="expense-detail-item">
                            <input
                              type="text"
                              className="detail-name-input"
                              value={detail.name}
                              onChange={(e) => updateExpenseDetail(selectedDayIdx, item.id, detail.id, 'name', e.target.value)}
                            />
                            <div className="detail-amount-wrapper">
                              <span>¥</span>
                              <input
                                type="number"
                                className="detail-amount-input"
                                value={detail.amount === 0 ? '' : detail.amount}
                                onChange={(e) => updateExpenseDetail(selectedDayIdx, item.id, detail.id, 'amount', e.target.value)}
                              />
                            </div>
                            <button className="detail-remove-btn" onClick={() => removeExpenseDetail(selectedDayIdx, item.id, detail.id)}>
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <button className="add-item-btn" onClick={() => addItem(selectedDayIdx)}>
              <Plus size={16} /> 新しい旅程を書き加える
            </button>
          </div>
        </div>
      )}

      <style>{`
        .schedule-tab {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .day-tabs {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          padding: 0.2rem 0.5rem 1rem;
          margin-bottom: 0.5rem;
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
        .day-add-tab-btn {
          padding: 0.5rem 0.8rem;
          background: transparent;
          border: 1px dashed var(--antique-gold);
          border-radius: 4px;
          color: var(--antique-gold);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .day-add-tab-btn:hover {
          background: rgba(197, 160, 89, 0.1);
        }
        .overall-progress {
          background: linear-gradient(135deg, var(--parchment) 0%, var(--parchment-dark) 100%);
          border: 1px solid var(--antique-gold);
        }
        .progress-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }
        .progress-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--antique-ink);
          font-family: var(--font-serif);
        }
        .progress-percent {
          font-family: var(--font-sans);
          font-size: 0.9rem;
          font-weight: 800;
          color: var(--antique-red);
        }
        .progress-bar-container {
          height: 10px;
          background: rgba(0,0,0,0.1);
          border-radius: 5px;
          overflow: hidden;
          box-shadow: inset 0 1px 3px rgba(0,0,0,0.2);
        }
        .progress-bar {
          height: 100%;
          background: linear-gradient(to right, var(--antique-gold), var(--antique-red));
          transition: width 0.3s ease;
        }
        .day-section {
          padding: 1.5rem;
          border: 1px solid var(--parchment-dark);
        }
        .day-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          border-bottom: 2px double var(--parchment-dark);
          padding-bottom: 1rem;
          position: relative;
        }
        .remove-day-btn {
          margin-left: auto;
          color: var(--parchment-dark);
          transition: color 0.2s;
        }
        .remove-day-btn:hover {
          color: var(--antique-red);
        }
        .day-number {
          background: var(--antique-ink);
          color: var(--parchment);
          font-weight: 800;
          width: 40px;
          height: 40px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-serif);
          font-size: 1.2rem;
          flex-shrink: 0;
          box-shadow: 2px 2px 5px rgba(0,0,0,0.2);
        }
        .day-date-input {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-family: var(--font-sans);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          background: transparent;
          border: none;
          width: 100%;
          padding: 0;
        }
        .day-date-input:focus {
          outline: none;
          background: rgba(0,0,0,0.05);
        }
        .day-title-input {
          font-size: 1.2rem;
          color: var(--antique-red);
          margin-top: 0.1rem;
          background: transparent;
          border: none;
          width: 100%;
          font-family: var(--font-serif);
          font-weight: 700;
        }
        .day-title-input:focus {
          outline: none;
          background: rgba(142, 33, 33, 0.05);
        }
        .timeline {
          display: flex;
          flex-direction: column;
          gap: 0;
          padding-left: 0.5rem;
        }
        .timeline-item {
          display: flex;
          gap: 1.2rem;
          cursor: grab;
        }
        .timeline-item:active {
          cursor: grabbing;
        }
        .timeline-item.dragging {
          opacity: 0.4;
          background: rgba(197, 160, 89, 0.1);
        }
        .timeline-left {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 50px;
          flex-shrink: 0;
        }
        .time-input {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--antique-ink);
          margin-bottom: 0.5rem;
          font-family: var(--font-sans);
          border: none;
          background: transparent;
          width: 100%;
          text-align: center;
        }
        .time-input:focus {
          outline: none;
          background: rgba(197, 160, 89, 0.1);
        }
        .connector {
          width: 1px;
          flex: 1;
          border-left: 1px dashed var(--antique-ink);
          opacity: 0.3;
          margin-bottom: 0.5rem;
        }
        .timeline-item:last-child .connector {
          display: none;
        }
        .timeline-content {
          flex: 1;
          padding-bottom: 2rem;
        }
        .item-main {
          display: flex;
          align-items: flex-start;
          gap: 0.8rem;
          margin-bottom: 0.8rem;
        }
        .complete-btn {
          margin-top: 0.2rem;
        }
        .item-body {
          flex: 1;
        }
        .item-name-input {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--antique-ink);
          width: 100%;
          background: transparent;
          border: none;
          padding: 2px 0;
          font-family: var(--font-serif);
        }
        .item-name-input:focus {
          outline: none;
          background: rgba(197, 160, 89, 0.1);
        }
        .item-location {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          color: var(--text-muted);
          margin-top: 0.2rem;
        }
        .location-input {
          font-size: 0.8rem;
          color: var(--text-muted);
          width: 100%;
          background: transparent;
          border: none;
        }
        .location-input:focus {
          outline: none;
        }
        .item-details {
          background: rgba(0,0,0,0.03);
          border-left: 2px solid var(--antique-gold);
          padding: 1rem;
          border-radius: 4px;
          margin-left: 2rem;
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }
        .detail-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-muted);
        }
        .memo-input {
          font-size: 0.75rem;
          border: none;
          background: transparent;
          width: 100%;
          color: var(--antique-green);
        }
        .memo-textarea {
          font-size: 0.85rem;
          border: none;
          background: transparent;
          width: 100%;
          resize: none;
          min-height: 40px;
          color: var(--text-main);
          font-family: inherit;
        }
        .memo-textarea:focus {
          outline: none;
        }
        .private-memo-container {
          margin-top: 0.5rem;
          border: 1px dashed var(--parchment-dark);
          border-radius: 4px;
          transition: all 0.3s;
        }
        .private-memo-container.unlocked {
          background: #fffdf8;
          border-style: solid;
          border-color: var(--antique-red);
        }
        .private-header {
          padding: 0.4rem 0.6rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--text-muted);
          cursor: pointer;
          background: rgba(0,0,0,0.02);
          text-transform: uppercase;
        }
        .unlocked .private-header {
          color: var(--antique-red);
          background: rgba(142, 33, 33, 0.05);
        }
        .private-textarea {
          width: 100%;
          border: none;
          background: transparent;
          padding: 0.6rem;
          font-size: 0.85rem;
          color: var(--antique-red);
          font-family: var(--font-serif);
          font-style: italic;
          min-height: 60px;
          resize: none;
        }
        .private-textarea:focus {
          outline: none;
        }
        .link-icon-btn {
          color: var(--antique-gold);
        }
        .item-expenses-edit {
          margin-top: 0.5rem;
          display: flex;
          gap: 1rem;
          align-items: center;
          font-size: 0.75rem;
          border-top: 1px solid rgba(0,0,0,0.05);
          padding-top: 0.8rem;
        }
        .expense-field {
          display: flex;
          align-items: center;
          gap: 0.3rem;
        }
        .expense-label {
          color: var(--text-muted);
          font-weight: 700;
          white-space: nowrap;
        }
        .expense-input-wrapper {
          display: flex;
          align-items: center;
          gap: 0.2rem;
          border-bottom: 1px solid var(--parchment-dark);
          color: var(--antique-ink);
        }
        .expense-input-wrapper.actual {
          color: var(--antique-red);
          border-color: var(--antique-red);
          opacity: 0.8;
        }
        .expense-mini-input {
          width: 50px;
          border: none;
          background: transparent;
          font-family: var(--font-sans);
          font-weight: 700;
          font-size: 0.8rem;
          text-align: right;
          color: inherit;
        }
        .expense-mini-input:focus {
          outline: none;
        }
        .add-expense-detail-btn {
          font-size: 0.65rem;
          color: var(--antique-gold);
          display: flex;
          align-items: center;
          gap: 0.2rem;
          padding: 2px 5px;
          border: 1px dashed var(--antique-gold);
          border-radius: 2px;
          margin-left: auto;
        }
        .expense-details-list {
          margin-top: 0.5rem;
          margin-left: 2rem;
          border-left: 1px solid var(--parchment-dark);
          padding-left: 0.8rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .expense-detail-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .detail-name-input {
          font-size: 0.7rem;
          flex: 1;
          border: none;
          background: transparent;
          color: var(--text-muted);
          font-family: inherit;
        }
        .detail-name-input:focus {
          outline: none;
          background: rgba(0,0,0,0.03);
        }
        .detail-amount-wrapper {
          display: flex;
          align-items: center;
          gap: 0.1rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--antique-red);
        }
        .detail-amount-input {
          width: 50px;
          border: none;
          background: transparent;
          text-align: right;
          color: inherit;
        }
        .detail-amount-input:focus {
          outline: none;
        }
        .detail-remove-btn {
          color: #ccc;
          opacity: 0.5;
        }
        .detail-remove-btn:hover {
          color: var(--antique-red);
          opacity: 1;
        }
        .item-delete-btn {
          color: #ccc;
          transition: color 0.2s;
        }
        .item-delete-btn:hover {
          color: var(--antique-red);
        }
        .timeline-item.completed .item-name-input {
          text-decoration: line-through;
          color: var(--text-muted);
          opacity: 0.6;
        }
        .item-name-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .transport-toggle-btn {
          background: var(--parchment-dark);
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 50%;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--antique-ink);
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .transport-toggle-btn:hover {
          background: var(--antique-gold);
          color: white;
          border-color: var(--antique-gold);
        }
        .transport-empty {
          opacity: 0.3;
        }
        .add-item-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem;
          background: rgba(0,0,0,0.02);
          border: 1px dashed var(--antique-gold);
          border-radius: 4px;
          color: var(--antique-gold);
          font-size: 0.9rem;
          font-weight: 700;
          font-family: var(--font-serif);
          margin-top: 1rem;
          width: 100%;
          transition: all 0.2s;
        }
        .add-item-btn:hover {
          background: rgba(197, 160, 89, 0.1);
        }
        .add-day-btn {
          margin: 1rem 0 3rem;
          padding: 1.2rem;
          width: 100%;
          justify-content: center;
          font-family: var(--font-serif);
          font-size: 1rem;
          border: 2px solid var(--antique-gold);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
};

export default ScheduleTab;
