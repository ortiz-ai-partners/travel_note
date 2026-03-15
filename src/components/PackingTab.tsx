import React, { useState } from 'react';
import type { AppData, PackingItem } from '../types';
import { Plus, Trash2, CheckSquare, Square, Package, Globe, Tent, Briefcase, Lock } from 'lucide-react';

interface Props {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
  isPremium?: boolean;
  customTemplates?: { id: string; name: string; items: { category: string; name: string }[] }[];
  saveTemplate?: (name: string, items: { category: string; name: string }[]) => void;
  deleteTemplate?: (id: string) => void;
}

const PackingTab: React.FC<Props> = ({
  data,
  setData,
  isPremium = false,
  customTemplates = [],
  saveTemplate,
  deleteTemplate
}) => {
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null);
  const categories = Array.from(new Set(data.packing.map(i => i.category)));
  const [selectedCat, setSelectedCat] = useState(categories[0] || '必需品');

  const toggleCheck = (id: string) => {
    const newData = { ...data };
    const item = newData.packing.find(i => i.id === id);
    if (item) item.checked = !item.checked;
    setData(newData);
  };

  const addItem = (category: string, nameInput?: string) => {
    const name = nameInput || window.prompt(`${category} に新しいアイテムを追加:`);
    if (name) {
      const newItem: PackingItem = {
        id: `p-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        category,
        name,
        checked: false
      };
      setData(prev => ({ ...prev, packing: [...prev.packing, newItem] }));
    }
  };

  const addTemplate = (type: 'onsen' | 'standard' | 'overseas' | 'camping' | 'business') => {
    const templates = {
      onsen: [
        { cat: '衣類', name: 'タオルセット' },
        { cat: '衣類', name: '着替え（下着・靴下）' },
        { cat: '必需品', name: '濡れたもの用袋' },
        { cat: '必需品', name: '歯ブラシ・スキンケア' },
      ],
      standard: [
        { cat: '必需品', name: 'スマホ充電器' },
        { cat: '必需品', name: 'モバイルバッテリー' },
        { cat: '必需品', name: '常備薬' },
        { cat: '必需品', name: 'ティッシュ・ハンカチ' },
      ],
      overseas: [
        { cat: '必需品', name: 'パスポート' },
        { cat: '必需品', name: '航空券（Eチケット）' },
        { cat: '必需品', name: '変圧器・変換プラグ' },
        { cat: '必需品', name: '外貨' },
        { cat: '衣類', name: '日数分の下着' },
      ],
      camping: [
        { cat: 'ギア', name: 'テント・シュラフ' },
        { cat: 'ギア', name: 'ランタン' },
        { cat: '必需品', name: '虫除けスプレー' },
        { cat: '必需品', name: 'ライター・火起こし' },
      ],
      business: [
        { cat: '衣類', name: 'ネクタイ・ワイシャツ' },
        { cat: '必需品', name: '名刺入れ' },
        { cat: '必需品', name: 'PC・充電アダプタ' },
        { cat: '必需品', name: '筆記用具' },
      ]
    };

    const itemsToAdd = templates[type];
    const newItems: PackingItem[] = itemsToAdd.map(item => ({
      id: `p-temp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      category: item.cat,
      name: item.name,
      checked: false
    }));

    setData(prev => ({ ...prev, packing: [...prev.packing, ...newItems] }));
    setPreviewTemplate(null);
  };

  const getTemplateItems = (type: string) => {
    const templates: any = {
      onsen: [
        { cat: '衣類', name: 'タオルセット' },
        { cat: '衣類', name: '着替え（下着・靴下）' },
        { cat: '必需品', name: '濡れたもの用袋' },
        { cat: '必需品', name: '歯ブラシ・スキンケア' },
      ],
      standard: [
        { cat: '必需品', name: 'スマホ充電器' },
        { cat: '必需品', name: 'モバイルバッテリー' },
        { cat: '必需品', name: '常備薬' },
        { cat: '必需品', name: 'ティッシュ・ハンカチ' },
      ],
      overseas: [
        { cat: '必需品', name: 'パスポート' },
        { cat: '必需品', name: '航空券（Eチケット）' },
        { cat: '必需品', name: '変圧器・変換プラグ' },
        { cat: '必需品', name: '外貨' },
        { cat: '衣類', name: '日数分の下着' },
      ],
      camping: [
        { cat: 'ギア', name: 'テント・シュラフ' },
        { cat: 'ギア', name: 'ランタン' },
        { cat: '必需品', name: '虫除けスプレー' },
        { cat: '必需品', name: 'ライター・火起こし' },
      ],
      business: [
        { cat: '衣類', name: 'ネクタイ・ワイシャツ' },
        { cat: '必需品', name: '名刺入れ' },
        { cat: '必需品', name: 'PC・充電アダプタ' },
        { cat: '必需品', name: '筆記用具' },
      ]
    };
    return templates[type] || [];
  };

  const applyCustomTemplate = (items: { category: string; name: string }[]) => {
    const newItems: PackingItem[] = items.map(item => ({
      id: `p-custom-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      category: item.category,
      name: item.name,
      checked: false
    }));
    setData(prev => ({ ...prev, packing: [...prev.packing, ...newItems] }));
  };

  const handleSaveAsTemplate = () => {
    if (!isPremium) {
      alert('「マイ・テンプレート」の保存はプレミアム版専用機能です。');
      return;
    }
    if (data.packing.length === 0) {
      alert('保存するアイテムがありません。');
      return;
    }
    const name = window.prompt('テンプレート名を入力してください:', 'お気に入りセット');
    if (name && saveTemplate) {
      const items = data.packing.map(i => ({ category: i.category, name: i.name }));
      saveTemplate(name, items);
      alert('「' + name + '」をマイ・テンプレートに保存しました！');
    }
  };

  const removeItem = (id: string) => {
    setData(prev => ({ ...prev, packing: prev.packing.filter(i => i.id !== id) }));
  };

  const total = data.packing.length;
  const checked = data.packing.filter(i => i.checked).length;
  const progress = total > 0 ? Math.round((checked / total) * 100) : 0;

  return (
    <div className="packing-tab">
      <div className="progress-card card">
        <div className="progress-info">
          <span className="progress-label">準備の進捗</span>
          <span className="progress-values">{checked} / {total} ({progress}%)</span>
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className="template-section">
        <p className="template-label">テンプレートから追加</p>
        <div className="template-btns">
          <button className={`template-btn ${previewTemplate === 'standard' ? 'active' : ''}`} onClick={() => setPreviewTemplate(previewTemplate === 'standard' ? null : 'standard')}>
            <Package size={16} /> 標準セット
          </button>
          <button className={`template-btn ${previewTemplate === 'overseas' ? 'active' : ''}`} onClick={() => setPreviewTemplate(previewTemplate === 'overseas' ? null : 'overseas')}>
            <Globe size={16} /> 海外旅行
          </button>
          <button className={`template-btn ${previewTemplate === 'camping' ? 'active' : ''}`} onClick={() => setPreviewTemplate(previewTemplate === 'camping' ? null : 'camping')}>
            <Tent size={16} /> キャンプ
          </button>
          <button className={`template-btn ${previewTemplate === 'business' ? 'active' : ''}`} onClick={() => setPreviewTemplate(previewTemplate === 'business' ? null : 'business')}>
            <Briefcase size={16} /> ビジネス
          </button>
        </div>

        {previewTemplate && (
          <div className="template-preview-box fade-down">
            <div className="preview-header">
              <span className="preview-title">
                {previewTemplate === 'standard' ? '標準セット' :
                  previewTemplate === 'overseas' ? '海外旅行' :
                    previewTemplate === 'camping' ? 'キャンプ' : 'ビジネス'} の中身
              </span>
              <button className="add-template-confirm-btn" onClick={() => addTemplate(previewTemplate as any)}>
                <Plus size={14} /> 全て追加する
              </button>
            </div>
            <div className="preview-items">
              {getTemplateItems(previewTemplate).map((item: any, i: number) => (
                <span key={i} className="preview-item-tag">{item.name}</span>
              ))}
            </div>
          </div>
        )}

        <p className="template-label" style={{ marginTop: '1.2rem' }}>
          マイ・テンプレート {(!isPremium) && <Lock size={12} style={{ verticalAlign: 'middle' }} />}
        </p>
        <div className="template-btns" style={{ flexWrap: 'wrap' }}>
          {customTemplates.map(tmp => (
            <div key={tmp.id} className="custom-template-wrapper">
              <button className="template-btn custom-tmp-btn" onClick={() => applyCustomTemplate(tmp.items)}>
                {tmp.name}
              </button>
              <button className="tmp-delete-btn" onClick={() => deleteTemplate?.(tmp.id)} title="削除">
                <Trash2 size={12} />
              </button>
            </div>
          ))}
          <button className={`template-btn save-tmp-btn ${!isPremium ? 'premium-locked' : ''}`} onClick={handleSaveAsTemplate}>
            <Plus size={16} /> {isPremium ? '現在のリストを保存' : '保存（プレミアム限定）'}
          </button>
        </div>
      </div>

      <div className="category-tabs">
        {(categories.length > 0 ? categories : ['必需品']).map(cat => (
          <button
            key={cat}
            className={`cat-tab-btn ${selectedCat === cat ? 'active' : ''}`}
            onClick={() => setSelectedCat(cat)}
          >
            {cat}
          </button>
        ))}
        <button className="cat-add-tab-btn" onClick={() => {
          const newCat = window.prompt('新しいカテゴリ名を入力してください:');
          if (newCat) setSelectedCat(newCat);
        }}>
          <Plus size={14} />
        </button>
      </div>

      <div className="category-section card">
        <div className="category-header">
          <h3 className="category-name">{selectedCat}</h3>
          <button className="add-btn" onClick={() => addItem(selectedCat)}><Plus size={16} /></button>
        </div>
        <div className="items-list">
          {data.packing.filter(i => i.category === selectedCat).map(item => (
            <div key={item.id} className={`packing-item ${item.checked ? 'checked' : ''}`}>
              <div className="item-left" onClick={() => toggleCheck(item.id)}>
                {item.checked ? <CheckSquare size={20} color="var(--antique-red)" /> : <Square size={20} color="var(--parchment-dark)" />}
                <span className="item-name">{item.name}</span>
              </div>
              <button className="delete-btn" onClick={() => removeItem(item.id)}><Trash2 size={14} /></button>
            </div>
          ))}
          {data.packing.filter(i => i.category === selectedCat).length === 0 && (
            <p className="empty-text">このカテゴリにはまだアイテムがありません。</p>
          )}
        </div>
      </div>

      <style>{`
        .packing-tab {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .progress-card {
           background: linear-gradient(135deg, var(--parchment), #fff);
           border: 1px solid var(--antique-gold);
        }
        .progress-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.8rem;
        }
        .progress-label {
          font-weight: 700;
          font-size: 0.9rem;
          color: var(--antique-ink);
          font-family: var(--font-serif);
        }
        .progress-values {
          font-size: 0.85rem;
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
          transition: width 0.4s ease-out;
        }
        .template-section {
          background: rgba(0,0,0,0.02);
          padding: 1rem;
          border-radius: 4px;
          border: 1px dashed var(--parchment-dark);
        }
        .template-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          margin-bottom: 0.8rem;
          font-family: var(--font-serif);
        }
        .template-btns {
          display: flex;
          gap: 1rem;
        }
        .template-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1rem;
          background: white;
          border: 1px solid var(--antique-gold);
          border-radius: 4px;
          font-size: 0.85rem;
          color: var(--antique-ink);
          font-family: var(--font-serif);
          font-weight: 700;
          box-shadow: 2px 2px 5px rgba(0,0,0,0.05);
          white-space: nowrap;
          transition: all 0.2s;
        }
        .template-btn.premium-locked {
          opacity: 0.6;
          border-style: dotted;
          background: var(--parchment-dark);
          color: var(--text-muted);
        }
        .template-btn:hover {
          transform: translateY(-1px);
          border-color: var(--antique-red);
        }
        .custom-template-wrapper {
          display: flex;
          align-items: center;
          position: relative;
        }
        .custom-tmp-btn {
          border-color: var(--antique-red);
          background: rgba(186, 45, 33, 0.05);
        }
        .tmp-delete-btn {
          position: absolute;
          top: -5px;
          right: -5px;
          background: var(--antique-red);
          color: white;
          border: none;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .custom-template-wrapper:hover .tmp-delete-btn {
          opacity: 1;
        }
        .save-tmp-btn {
          border-style: dashed;
          border-color: var(--antique-gold);
          color: var(--antique-gold);
        }
        .template-btn.active {
          border-color: var(--antique-red);
          background: rgba(186, 45, 33, 0.05);
        }
        .template-preview-box {
          margin-top: 1rem;
          background: white;
          border: 1px solid var(--antique-gold);
          border-radius: 4px;
          padding: 1rem;
          box-shadow: var(--shadow-soft);
        }
        .preview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.8rem;
          border-bottom: 1px dotted var(--parchment-dark);
          padding-bottom: 0.5rem;
        }
        .preview-title {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--antique-ink);
          font-family: var(--font-serif);
        }
        .add-template-confirm-btn {
          font-size: 0.75rem;
          background: var(--antique-red);
          color: white;
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-weight: 700;
        }
        .preview-items {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .preview-item-tag {
          font-size: 0.7rem;
          background: var(--parchment-dark);
          padding: 0.2rem 0.5rem;
          border-radius: 4px;
          color: var(--antique-ink);
        }
        .category-tabs {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
        }
        .cat-tab-btn {
          padding: 0.5rem 1rem;
          background: var(--parchment-dark);
          border: 1px solid rgba(0,0,0,0.1);
          border-radius: 4px;
          color: var(--antique-ink);
          font-family: var(--font-serif);
          font-size: 0.85rem;
          font-weight: 700;
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s;
        }
        .cat-tab-btn.active {
          background: var(--antique-gold);
          color: white;
          border-color: var(--antique-gold);
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        .cat-add-tab-btn {
          padding: 0.5rem 0.8rem;
          background: transparent;
          border: 1px dashed var(--antique-gold);
          border-radius: 4px;
          color: var(--antique-gold);
          cursor: pointer;
        }
        .category-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid var(--parchment-dark);
          padding-bottom: 0.5rem;
        }
        .category-name {
          font-size: 1.1rem;
          color: var(--antique-red);
          font-family: var(--font-serif);
        }
        .add-btn {
          color: var(--antique-gold);
        }
        .items-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .packing-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          border-bottom: 1px dotted rgba(0,0,0,0.05);
        }
        .item-left {
          display: flex;
          align-items: center;
          gap: 1rem;
          cursor: pointer;
          flex: 1;
        }
        .item-name {
          font-size: 0.95rem;
          font-family: var(--font-serif);
          color: var(--antique-ink);
        }
        .checked .item-name {
          color: var(--text-muted);
          text-decoration: line-through;
          font-style: italic;
        }
        .delete-btn {
          color: var(--parchment-dark);
        }
        .delete-btn:hover {
          color: var(--antique-red);
        }
        .empty-text {
          font-size: 0.85rem;
          color: var(--text-muted);
          font-style: italic;
          text-align: center;
          padding: 1rem;
        }
      `}</style>
    </div>
  );
};

export default PackingTab;
