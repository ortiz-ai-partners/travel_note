import React from 'react';
import type { AppData, BucketItem } from '../types';
import { Star, CheckCircle2, Circle, Plus, Trash2 } from 'lucide-react';

interface Props {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
}

const BucketListTab: React.FC<Props> = ({ data, setData }) => {
  const toggleItem = (id: string) => {
    const newData = { ...data };
    const item = newData.bucketList.find(i => i.id === id);
    if (item) item.checked = !item.checked;
    setData(newData);
  };

  const updateItem = (id: string, newName: string) => {
    const newData = { ...data };
    const item = newData.bucketList.find(i => i.id === id);
    if (item) item.name = newName;
    setData(newData);
  };

  const addItem = () => {
    const name = window.prompt('旅でやりたいことを書き留めてください:');
    if (!name) return;
    const newItem: BucketItem = {
      id: `bl-${Date.now()}`,
      name,
      checked: false
    };
    setData({ ...data, bucketList: [...data.bucketList, newItem] });
  };

  const removeItem = (id: string) => {
    if (window.confirm('この項目を削除しますか？')) {
      setData({ ...data, bucketList: data.bucketList.filter(i => i.id !== id) });
    }
  };

  return (
    <div className="bucket-list-tab">
      <div className="tab-intro card">
        <Star color="var(--antique-gold)" size={24} fill="var(--antique-gold)" />
        <div>
          <h3 className="intro-title">やりたいことリスト</h3>
          <p className="intro-text">この旅で叶えたいことや、行きたい場所を自由に書き留めましょう。</p>
        </div>
      </div>

      <div className="bucket-items">
        {data.bucketList.map(item => (
          <div key={item.id} className={`bucket-item card ${item.checked ? 'checked' : ''}`}>
            <button className="check-btn" onClick={() => toggleItem(item.id)}>
              {item.checked ? <CheckCircle2 size={24} color="var(--antique-green)" /> : <Circle size={24} color="var(--parchment-dark)" />}
            </button>
            <input
              type="text"
              className="item-name-input"
              value={item.name}
              onChange={(e) => updateItem(item.id, e.target.value)}
            />
            <button className="delete-btn" onClick={() => removeItem(item.id)}><Trash2 size={16} /></button>
          </div>
        ))}

        <button className="add-item-btn antique-btn" onClick={addItem}>
          <Plus size={20} /> やりたいことを追記する
        </button>
      </div>

      <style>{`
        .bucket-list-tab {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .tab-intro {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          background: linear-gradient(135deg, var(--parchment), #fff);
          border: 1px solid var(--antique-gold);
        }
        .intro-title {
          font-size: 1.1rem;
          color: var(--antique-red);
          margin-bottom: 0.2rem;
          font-family: var(--font-serif);
        }
        .intro-text {
          font-size: 0.85rem;
          color: var(--text-muted);
          font-family: var(--font-serif);
          font-style: italic;
        }
        .bucket-items {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .bucket-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.2rem;
          border: 1px solid var(--parchment-dark);
          transition: all 0.3s;
        }
        .bucket-item.checked {
          background: rgba(62, 90, 62, 0.05); /* antique-green tint */
          opacity: 0.8;
        }
        .bucket-item.checked .item-name-input {
          text-decoration: line-through;
          color: var(--text-muted);
          font-style: italic;
        }
        .item-name-input {
          flex: 1;
          font-family: var(--font-serif);
          font-weight: 700;
          font-size: 1.05rem;
          color: var(--antique-ink);
          background: transparent;
          border: none;
          padding: 0;
        }
        .item-name-input:focus {
          outline: none;
          background: rgba(197, 160, 89, 0.05);
        }
        .delete-btn {
          color: var(--parchment-dark);
          transition: color 0.2s;
        }
        .delete-btn:hover {
          color: var(--antique-red);
        }
        .add-item-btn {
          margin-top: 1rem;
          justify-content: center;
          padding: 1.2rem;
          font-family: var(--font-serif);
          box-shadow: 2px 4px 10px rgba(0,0,0,0.1);
        }
        .check-btn {
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
};

export default BucketListTab;
