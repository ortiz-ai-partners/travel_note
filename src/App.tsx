import React, { useState, useEffect } from 'react';
import { initialData } from './initialData';
import { storage } from './utils/storage';
import type { AppData } from './types';
import {
  Calendar,
  Shirt,
  CheckSquare,
  Wallet,
  Timer,
  Download,
  Trash2,
  Star,
  Camera,
  Shield,
  Share,
  Upload,
  Plus,
  ArrowLeft,
  Lock,
  ChevronRight,
  Settings
} from 'lucide-react';
import { differenceInDays, differenceInHours, differenceInMinutes, parseISO } from 'date-fns';
import type { Trip, GlobalState, CustomPackingTemplate } from './types';

// Components for Tabs
import ScheduleTab from './components/ScheduleTab';
import CoordinatesTab from './components/CoordinatesTab';
import PackingTab from './components/PackingTab';
import BudgetTab from './components/BudgetTab';
import WeatherTab from './components/WeatherTab';
import BucketListTab from './components/BucketListTab';
import PhotoLogTab from './components/PhotoLogTab';
import { generatePDF } from './utils/pdfExport';


const App: React.FC = () => {
  const [state, setState] = useState<GlobalState>(() => {
    const saved = storage.get<GlobalState>('trip_planner_global_v2');
    if (saved) return saved;

    // 旧データからの移行
    const oldData = storage.get<AppData>('trip_planner_data');
    if (oldData) {
      const migratedTrip: Trip = {
        id: '1',
        title: oldData.tripTitle || '最初の冒険',
        description: '移行された旅の記録',
        createdAt: new Date().toISOString(),
        data: oldData
      };
      return { trips: [migratedTrip], isPremium: false };
    }

    return { trips: [], isPremium: false };
  });

  const [activeTripId, setActiveTripId] = useState<string | null>(null);
  const activeTrip = state.trips.find(t => t.id === activeTripId);
  const data = activeTrip?.data;

  const setData: React.Dispatch<React.SetStateAction<AppData>> = (value) => {
    if (!activeTripId) return;
    setState(prev => {
      const targetTrip = prev.trips.find(t => t.id === activeTripId);
      if (!targetTrip) return prev;
      const newData = typeof value === 'function' ? (value as any)(targetTrip.data) : value;
      return {
        ...prev,
        trips: prev.trips.map(t => t.id === activeTripId ? { ...t, data: newData } : t)
      };
    });
  };
  const [activeTab, setActiveTab] = useState('schedule');
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  const targetDateInput = data?.targetDate || '2026-03-25T05:00:00';
  const targetDate = parseISO(targetDateInput);

  useEffect(() => {
    if (!data) return;
    const timer = setInterval(() => {
      const now = new Date();
      const days = differenceInDays(targetDate, now);
      const hours = differenceInHours(targetDate, now) % 24;
      const minutes = differenceInMinutes(targetDate, now) % 60;
      setTimeLeft({ days, hours: Math.max(0, hours), minutes: Math.max(0, minutes) });
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate, data]);

  useEffect(() => {
    storage.set('trip_planner_global_v2', state);
  }, [state]);

  const createNewTrip = () => {
    if (!state.isPremium && state.trips.length >= 1) {
      alert('無料版では「旅の書」は1つまでです。さらに作成するにはプレミアム版へのアップグレードが必要です。');
      return;
    }

    const newTrip: Trip = {
      id: Date.now().toString(),
      title: '新しい冒険の書',
      description: '旅の準備を始めよう',
      createdAt: new Date().toISOString(),
      data: {
        ...initialData,
        tripTitle: '新しい冒険の書',
        targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        countdownLabel: '出発まで'
      }
    };

    setState(prev => ({ ...prev, trips: [...prev.trips, newTrip] }));
    setActiveTripId(newTrip.id);
  };

  const deleteTrip = (id: string) => {
    if (window.confirm('この冒険の書を完全に削除しますか？')) {
      setState(prev => ({ ...prev, trips: prev.trips.filter(t => t.id !== id) }));
      if (activeTripId === id) setActiveTripId(null);
    }
  };

  const togglePremium = () => {
    setState(prev => ({ ...prev, isPremium: !prev.isPremium }));
    alert(state.isPremium ? '無料版に戻しました。' : 'プレミアム版（モック）を有効にしました！');
  };

  const savePackingTemplate = (name: string, items: { category: string; name: string }[]) => {
    const newTemplate: CustomPackingTemplate = {
      id: Date.now().toString(),
      name,
      items
    };
    setState(prev => ({
      ...prev,
      customPackingTemplates: [...(prev.customPackingTemplates || []), newTemplate]
    }));
  };

  const deletePackingTemplate = (id: string) => {
    setState(prev => ({
      ...prev,
      customPackingTemplates: (prev.customPackingTemplates || []).filter(t => t.id !== id)
    }));
  };

  const resetData = () => {
    if (window.confirm('データを初期化しますか？')) {
      setData(initialData);
      storage.delete('trip_planner_data');
    }
  };

  const updateTripTitle = (id: string, newTitle: string) => {
    setState(prev => ({
      ...prev,
      trips: prev.trips.map(t => t.id === id ? { ...t, title: newTitle, data: { ...t.data, tripTitle: newTitle } } : t)
    }));
  };

  const handleDownloadPDF = async () => {
    if (!data) return;
    setActiveTab('all');
    setTimeout(async () => {
      await generatePDF('printable-content', `冒険の書_${new Date().toISOString().split('T')[0]}.pdf`);
      setActiveTab('schedule');
    }, 100);
  };

  const exportData = () => {
    if (!data) return;
    const dataStr = JSON.stringify(data);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `trip_data_${new Date().toISOString().split('T')[0]}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const addDay = () => {
    if (!data) return;
    const nextDayNum = data.schedule.length + 1;
    const lastDate = data.schedule[data.schedule.length - 1]?.date || '2026-03-24';
    // 日付を1日進めるロジック（簡易版）
    const nextDateObj = new Date(lastDate);
    nextDateObj.setDate(nextDateObj.getDate() + 1);
    const nextDateStr = nextDateObj.toISOString().split('T')[0];

    const newDay = {
      day: nextDayNum,
      date: nextDateStr,
      title: `Day ${nextDayNum} の冒険`,
      items: []
    };

    const newCoord = { jacket: '', inner: '', bottoms: '', shoes: '', memo: '' };

    setData({
      ...data,
      schedule: [...data.schedule, newDay],
      coordinates: { ...data.coordinates, [nextDayNum]: newCoord }
    });
  };

  const removeDay = (dayNum: number) => {
    if (!data) return;
    if (data.schedule.length <= 1) {
      alert('これ以上日は減らせません。');
      return;
    }
    if (window.confirm(`Day ${dayNum} を削除しますか？スケジュールもすべて消去されます。`)) {
      const newSchedule = data.schedule.filter(d => d.day !== dayNum)
        .map((d, i) => ({ ...d, day: i + 1 })); // 日付番号を振り直す

      // 正確なマッピングロジック
      const oldCoords = { ...data.coordinates };
      const updatedCoords: Record<number, any> = {};
      newSchedule.forEach((d, idx) => {
        // 元々何日目だったかを探す
        const originalDay = data.schedule.find(oldD => oldD.date === d.date)?.day;
        if (originalDay && oldCoords[originalDay]) {
          updatedCoords[idx + 1] = oldCoords[originalDay];
        } else {
          updatedCoords[idx + 1] = { jacket: '', inner: '', bottoms: '', shoes: '', memo: '' };
        }
      });

      setData({
        ...data,
        schedule: newSchedule,
        coordinates: updatedCoords
      });
    }
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    fileReader.onload = event => {
      try {
        const importedData = JSON.parse(event.target?.result as string);
        setData(importedData);
        alert('データをインポートしました！');
      } catch (err) {
        alert('データのインポートに失敗しました。');
      }
    };
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0]);
    }
  };

  const renderDashboard = () => (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2 className="dashboard-title">冒険の書一覧</h2>
        {!state.isPremium && state.trips.length >= 1 && (
          <div className="premium-banner" onClick={togglePremium} style={{ cursor: 'pointer' }}>
            <Lock size={14} /> プレミアム版で無制限に作成可能
          </div>
        )}
      </div>

      <div className="trip-grid">
        {state.trips.map(trip => (
          <div key={trip.id} className="trip-card card" onClick={() => setActiveTripId(trip.id)}>
            <div className="trip-card-body">
              <input
                className="trip-title-input-dash"
                value={trip.title}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => updateTripTitle(trip.id, e.target.value)}
              />
              <p className="trip-date">{new Date(trip.createdAt).toLocaleDateString()} 作成</p>
            </div>
            <button
              className="settings-trip-btn"
              onClick={(e) => { e.stopPropagation(); setActiveTripId(trip.id); setActiveTab('info'); }}
              title="設定"
            >
              <Settings size={16} />
            </button>
            <button
              className="delete-trip-btn"
              onClick={(e) => { e.stopPropagation(); deleteTrip(trip.id); }}
              title="削除"
            >
              <Trash2 size={16} />
            </button>
            <ChevronRight className="trip-arrow" />
          </div>
        ))}

        <button className="add-trip-card" onClick={createNewTrip}>
          <Plus size={32} />
          <span>新しい冒険を始める</span>
        </button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    if (!data) return renderDashboard();
    if (activeTab === 'all') {
      return (
        <div id="printable-content" className="printable-view">
          <section><h2>スケジュール</h2><ScheduleTab data={data} setData={setData} /></section>
          <section><h2>やりたいことリスト</h2><BucketListTab data={data} setData={setData} /></section>
          <section><h2>服装</h2><CoordinatesTab data={data} setData={setData} /></section>
          <section><h2>持ち物</h2><PackingTab data={data} setData={setData} /></section>
          <section><h2>予算</h2><BudgetTab data={data} setData={setData} /></section>
        </div>
      );
    }
    switch (activeTab) {
      case 'schedule': return <ScheduleTab data={data} setData={setData} addDay={addDay} removeDay={removeDay} />;
      case 'bucket': return <BucketListTab data={data} setData={setData} />;
      case 'coordinates': return <CoordinatesTab data={data} setData={setData} />;
      case 'packing': return (
        <PackingTab
          data={data}
          setData={setData}
          isPremium={state.isPremium}
          customTemplates={state.customPackingTemplates || []}
          saveTemplate={savePackingTemplate}
          deleteTemplate={deletePackingTemplate}
        />
      );
      case 'budget': return <BudgetTab data={data} setData={setData} />;
      case 'photos': return <PhotoLogTab data={data} setData={setData} />;
      case 'weather': return <WeatherTab />;
      case 'info': return (
        <div className="info-section card">
          <h2 className="info-title"><Shield size={18} /> 緊急連絡先</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>病院</label>
              <input value={data.emergency.hospital} onChange={e => setData({ ...data, emergency: { ...data.emergency, hospital: e.target.value } })} />
            </div>
            <div className="info-item">
              <label>宿泊先</label>
              <input value={data.emergency.hotel} onChange={e => setData({ ...data, emergency: { ...data.emergency, hotel: e.target.value } })} />
            </div>
            <div className="info-item">
              <label>その他</label>
              <input value={data.emergency.other} onChange={e => setData({ ...data, emergency: { ...data.emergency, other: e.target.value } })} />
            </div>
          </div>
          <div className="data-actions">
            <h3>旅の設定</h3>
            <div className="info-grid" style={{ marginBottom: '1.5rem' }}>
              <div className="info-item">
                <label>冒険の題名</label>
                <input value={data.tripTitle} onChange={e => setData({ ...data, tripTitle: e.target.value })} placeholder="冒険の書" />
              </div>
              <div className="info-item">
                <label>出発日時</label>
                <input type="datetime-local" value={data.targetDate?.slice(0, 16)} onChange={e => setData({ ...data, targetDate: e.target.value })} />
              </div>
              <div className="info-item">
                <label>カウントダウンのラベル</label>
                <input value={data.countdownLabel} onChange={e => setData({ ...data, countdownLabel: e.target.value })} placeholder="鹿屋発 まで" />
              </div>
            </div>
            <h3>アプリ設定（デモ用）</h3>
            <div className="action-row" style={{ marginBottom: '1.5rem' }}>
              <button onClick={togglePremium} className={`action-btn ${state.isPremium ? 'active-premium' : ''}`}>
                {state.isPremium ? 'プレミアム版 有効中' : 'プレミアム版を購入する（モック）'}
              </button>
            </div>
            <h3>バックアップ</h3>
            <div className="action-row">
              <button onClick={exportData} className="action-btn"><Share size={16} /> 書き出し</button>
              <label className="action-btn">
                <Upload size={16} /> インポート
                <input type="file" onChange={importData} style={{ display: 'none' }} />
              </label>
            </div>
          </div>
        </div>
      );
      default: return <ScheduleTab data={data} setData={setData} />;
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-top">
          {activeTripId ? (
            <button className="back-btn" onClick={() => setActiveTripId(null)}>
              <ArrowLeft size={20} />
            </button>
          ) : null}
          <h1 className="title">
            {activeTripId ? (
              <input
                className="header-title-input"
                value={data?.tripTitle}
                onChange={(e) => {
                  if (data) setData({ ...data, tripTitle: e.target.value });
                }}
                onBlur={() => {
                  if (activeTripId && data) {
                    setState(prev => ({
                      ...prev,
                      trips: prev.trips.map(t => t.id === activeTripId ? { ...t, title: data.tripTitle || '' } : t)
                    }));
                  }
                }}
              />
            ) : '冒険の書'}
            <span className="subtitle">. chronicles of trip</span>
          </h1>
          <div className="header-actions">
            {activeTripId && (
              <>
                <button onClick={handleDownloadPDF} className="action-btn" title="書を保存"><Download size={20} /></button>
                <button onClick={() => setActiveTab('info')} className="action-btn" title="設定"><Settings size={20} /></button>
                <button onClick={resetData} className="action-btn danger" title="書を破棄"><Trash2 size={20} /></button>
              </>
            )}
          </div>
        </div>

        {activeTripId && (
          <div className="countdown-card">
            <div className="countdown-label"><Timer size={14} /> {data?.countdownLabel || '出発まで'}</div>
            <div className="countdown-timer">
              <span className="timer-unit">{timeLeft.days}</span><span className="timer-label">日</span>
              <span className="timer-unit">{timeLeft.hours}</span><span className="timer-label">時</span>
              <span className="timer-unit">{timeLeft.minutes}</span><span className="timer-label">分</span>
            </div>
            <div className="countdown-decoration"></div>
          </div>
        )}

        {activeTripId && (
          <nav className="tab-nav">
            <button className={`tab-btn ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => setActiveTab('schedule')}>
              <Calendar size={20} />
              <span>旅程</span>
            </button>
            <button className={`tab-btn ${activeTab === 'bucket' ? 'active' : ''}`} onClick={() => setActiveTab('bucket')}>
              <Star size={20} />
              <span>やりたい</span>
            </button>
            <button className={`tab-btn ${activeTab === 'coordinates' ? 'active' : ''}`} onClick={() => setActiveTab('coordinates')}>
              <Shirt size={20} />
              <span>服装</span>
            </button>
            <button className={`tab-btn ${activeTab === 'packing' ? 'active' : ''}`} onClick={() => setActiveTab('packing')}>
              <CheckSquare size={20} />
              <span>荷物</span>
            </button>
            <button className={`tab-btn ${activeTab === 'budget' ? 'active' : ''}`} onClick={() => setActiveTab('budget')}>
              <Wallet size={20} />
              <span>軍資金</span>
            </button>
            <button className={`tab-btn ${activeTab === 'photos' ? 'active' : ''}`} onClick={() => setActiveTab('photos')}>
              <Camera size={20} />
              <span>記憶</span>
            </button>
            <button className={`tab-btn ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>
              <Shield size={20} />
              <span>設定</span>
            </button>
          </nav>
        )}
      </header>

      <main className="main-content fade-up" key={activeTripId ? `${activeTripId}-${activeTab}` : 'dashboard'}>
        {activeTripId ? renderTabContent() : renderDashboard()}
      </main>

      <footer className="footer">
        © 2026 Chronicles of Adventure — Ortiz AI Partners
      </footer>

      <style>{`
        .app-container {
          max-width: 600px;
          margin: 0 auto;
          padding: 1.5rem 1rem;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .header {
          margin-bottom: 2rem;
        }
        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .title {
          font-size: 2.2rem;
          color: var(--antique-ink);
          text-shadow: 1px 1px 0px rgba(255,255,255,0.5);
        }
        .subtitle {
          font-family: var(--font-serif);
          font-size: 0.8rem;
          font-weight: 400;
          color: var(--antique-red);
          margin-left: 0.8rem;
          font-style: italic;
          opacity: 0.7;
        }
        .header-actions {
          display: flex;
          gap: 0.8rem;
        }
        .action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 4px;
          background: var(--parchment);
          border: 1px solid var(--parchment-dark);
          color: var(--antique-ink);
          box-shadow: 1px 2px 5px rgba(0,0,0,0.1);
          cursor: pointer;
          transition: all 0.2s;
        }
        .action-btn:hover {
          transform: translateY(-1px);
          background: var(--antique-gold);
          color: white;
        }
        .action-btn.danger:hover {
          background: var(--antique-red);
        }
        .countdown-card {
          background: var(--parchment);
          border: 1px solid var(--antique-gold);
          border-radius: 4px;
          padding: 1rem;
          text-align: center;
          box-shadow: var(--shadow-soft);
          margin-bottom: 2rem;
          position: relative;
        }
        .countdown-decoration {
          position: absolute;
          bottom: -5px;
          left: 10%;
          right: 10%;
          height: 2px;
          background: var(--antique-gold);
          opacity: 0.5;
        }
        .countdown-label {
          font-size: 0.75rem;
          color: var(--antique-green);
          font-family: var(--font-serif);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }
        .countdown-timer {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 0.3rem;
        }
        .timer-unit {
          font-size: 2rem;
          font-weight: 700;
          color: var(--antique-red);
          font-family: var(--font-serif);
          text-shadow: 1px 1px 0px white;
        }
        .timer-label {
          font-size: 0.8rem;
          margin-right: 0.6rem;
          color: var(--antique-ink);
          font-family: var(--font-serif);
        }
        .tab-nav {
          display: flex;
          background: var(--parchment-dark);
          border-radius: 4px;
          padding: 0.2rem;
          box-shadow: inset 0 2px 10px rgba(0,0,0,0.1);
          justify-content: space-between;
          overflow-x: auto;
          gap: 0.2rem;
        }
        .tab-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0.8rem 0.2rem;
          min-width: 65px;
          flex: 1;
          border-radius: 2px;
          color: rgba(60, 47, 47, 0.6);
          gap: 0.3rem;
          transition: all 0.3s;
          background: transparent;
          border: none;
          cursor: pointer;
        }
        .tab-btn span {
          font-size: 0.65rem;
          font-weight: 700;
          font-family: var(--font-serif);
          white-space: nowrap;
        }
        .tab-btn.active {
          background: var(--parchment);
          color: var(--antique-red);
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        .main-content {
          flex: 1;
        }
        .footer {
          text-align: center;
          padding: 2.5rem 0;
          font-size: 0.75rem;
          color: var(--text-muted);
          font-family: var(--font-serif);
          font-style: italic;
          opacity: 0.6;
        }
        .dashboard {
          padding-top: 1rem;
        }
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          border-bottom: 1px double var(--antique-gold);
          padding-bottom: 1rem;
        }
        .dashboard-title {
          font-size: 1.4rem;
          color: var(--antique-ink);
          font-family: var(--font-serif);
        }
        .premium-banner {
          font-size: 0.7rem;
          background: var(--antique-gold);
          color: white;
          padding: 0.3rem 0.6rem;
          border-radius: 4px;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .premium-banner:hover {
          background: var(--antique-red);
          transform: scale(1.05);
        }
        .trip-grid {
          display: grid;
          gap: 1.2rem;
        }
        .trip-card {
          display: flex;
          align-items: center;
          padding: 1.5rem !important;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
          background: var(--parchment);
          border: 1px solid var(--parchment-dark);
        }
        .trip-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-soft);
          border-color: var(--antique-gold);
        }
        .trip-card-body {
          flex: 1;
        }
        .trip-title-input-dash {
          font-size: 1.2rem;
          color: var(--antique-red);
          margin-bottom: 0.3rem;
          font-family: var(--font-serif);
          background: transparent;
          border: none;
          border-bottom: 1px solid transparent;
          width: 100%;
          font-weight: 700;
          cursor: text;
        }
        .trip-title-input-dash:focus {
          outline: none;
          border-color: var(--antique-gold);
          background: rgba(197, 160, 89, 0.05);
        }
        .header-title-input {
          font-size: 2.2rem;
          color: var(--antique-ink);
          background: transparent;
          border: none;
          border-bottom: 1px dotted transparent;
          font-family: inherit;
          font-weight: inherit;
          width: 250px;
          text-shadow: 1px 1px 0px rgba(255,255,255,0.5);
        }
        .header-title-input:focus {
          outline: none;
          border-color: var(--antique-gold);
        }
        .trip-date {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .trip-arrow {
          color: var(--antique-gold);
          opacity: 0.5;
        }
        .delete-trip-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.5rem;
          margin-right: 0.5rem;
          transition: color 0.2s;
        }
        .delete-trip-btn:hover {
          color: var(--antique-red);
        }
        .settings-trip-btn {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.5rem;
          transition: color 0.2s;
        }
        .settings-trip-btn:hover {
          color: var(--antique-gold);
        }
        .add-trip-card {
          border: 2px dashed var(--antique-gold);
          background: rgba(212, 175, 55, 0.05);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          gap: 1rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
          color: var(--antique-gold);
        }
        .add-trip-card:hover {
          background: rgba(212, 175, 55, 0.1);
          transform: scale(0.99);
        }
        .add-trip-card span {
          font-family: var(--font-serif);
          font-weight: 700;
        }
        .back-btn {
          background: transparent;
          border: none;
          color: var(--antique-ink);
          cursor: pointer;
          padding: 0.5rem;
          margin-right: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
        }
        .back-btn:hover {
          background: var(--parchment-dark);
        }
        .active-premium {
          background: var(--antique-gold) !important;
          color: white !important;
          border-color: var(--antique-gold) !important;
        }
        .info-section {
          background: var(--parchment);
          border: 1px solid var(--parchment-dark);
        }
        .info-title {
          font-size: 1.3rem;
          color: var(--antique-red);
          border-bottom: 1px double var(--antique-gold);
          padding-bottom: 0.8rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }
        .info-grid {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          margin-bottom: 2.5rem;
        }
        .info-item {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .info-item label {
          font-size: 0.8rem;
          font-weight: 700;
          font-family: var(--font-serif);
          color: var(--antique-ink);
        }
        .info-item input {
          border: 1px solid var(--parchment-dark);
          padding: 0.8rem;
          border-radius: 4px;
          background: rgba(255,255,255,0.3);
          font-size: 0.95rem;
          color: var(--antique-ink);
          font-family: var(--font-serif);
        }
        .data-actions {
          border-top: 1px dashed var(--antique-gold);
          padding-top: 2rem;
        }
        .data-actions h3 {
          font-size: 1.1rem;
          margin-bottom: 1.2rem;
          color: var(--antique-ink);
        }
        .action-row {
          display: flex;
          gap: 1.2rem;
        }
        .action-row .action-btn {
          width: auto;
          flex: 1;
          padding: 0.8rem;
          font-family: var(--font-serif);
          font-weight: 700;
        }
        @media print {
          body { background: white !important; }
          .app-container { max-width: 100%; padding: 0; }
          .tab-nav, .header-actions, .action-btn, .footer, .countdown-card {
            display: none !important;
          }
          .printable-view {
            display: flex;
            flex-direction: column;
            gap: 3rem;
          }
          .printable-view h2 {
            font-size: 1.8rem;
            border-bottom: 2px solid #000;
            padding-bottom: 0.5rem;
            margin-bottom: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default App;
