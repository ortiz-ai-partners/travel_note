import React from 'react';
import { HelpCircle, BookOpen, Map, Luggage, Wallet, Camera } from 'lucide-react';

const ManualTab: React.FC = () => {
  return (
    <div className="manual-tab">
      <div className="manual-header card">
        <h1><HelpCircle size={28} style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} /> 冒険の進め方</h1>
        <p>この「冒険の書」を使いこなし、最高の旅を記録するためのガイドです。</p>

        <nav className="manual-toc">
          <a href="#section-dashboard" className="toc-link">ダッシュボード</a>
          <a href="#section-schedule" className="toc-link">旅程・軍資金</a>
          <a href="#section-packing" className="toc-link">持ち物</a>
          <a href="#section-memories" className="toc-link">思い出</a>
          <a href="#section-prep" className="toc-link">準備費用</a>
        </nav>
      </div>

      <div className="manual-grid">
        <section id="section-dashboard" className="manual-section card">
          <h2><BookOpen size={20} /> 冒険の管理（ダッシュボード）</h2>
          <p>最初の画面では、複数の旅（冒険の書）を作成・管理できます。タイトルの鉛筆マークをタップして、好きな名前を付けましょう。</p>
        </section>

        <section id="section-schedule" className="manual-section card">
          <h2><Map size={20} /> 旅程と予算（軍資金）</h2>
          <p>「旅程」で日ごとのスケジュールを入力できます。予定名の横にある**乗り物アイコンをタップ**すると、飛行機、電車、自転車、ロボットなどの移動手段を自由に切り替えられます！設定した「予定額」は「軍資金」に反映されます。</p>
        </section>

        <section id="section-packing" className="manual-section card">
          <h2><Luggage size={20} /> 装備の準備（持ち物）</h2>
          <p>「荷物」タブでは、便利なテンプレートが使えます。タップしてプレビューし、一括で追加できます。自分だけのカスタムテンプレートを保存することも可能です（プレミアム機能）。</p>
        </section>

        <section id="section-memories" className="manual-section card">
          <h2><Camera size={20} /> 思い出の記録（記憶）</h2>
          <p>旅先で撮った写真は「記憶」タブへ。スマホのカメラ store その場ですぐに保存できます。画像をクリックすると大きく表示され、当時の感動を詳しく振り返れます。</p>
        </section>

        <section id="section-prep" className="manual-section card">
          <h2><Wallet size={20} /> 準備費用</h2>
          <p>「軍資金」タブの下部では、航空券や宿泊費など、旅行前にかかる費用を管理できます。すべての項目名と金額は自由に編集・追加可能です。</p>
        </section>
      </div>

      <style>{`
        .manual-tab {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding-bottom: 2rem;
        }
        .manual-header {
          text-align: center;
          background: linear-gradient(135deg, var(--parchment), #fff);
          border: 2px solid var(--antique-gold);
          padding: 2rem;
        }
        .manual-header h1 {
          font-family: var(--font-serif);
          color: var(--antique-ink);
          margin-bottom: 0.5rem;
        }
        .manual-toc {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.8rem;
          margin-top: 1.2rem;
          padding-top: 1rem;
          border-top: 1px dotted var(--parchment-dark);
        }
        .toc-link {
          font-size: 0.85rem;
          color: var(--antique-red);
          text-decoration: none;
          font-family: var(--font-serif);
          background: rgba(142, 33, 33, 0.05);
          padding: 0.3rem 0.6rem;
          border-radius: 4px;
          border: 1px solid transparent;
          transition: all 0.2s;
        }
        .toc-link:hover {
          background: var(--antique-red);
          color: white;
          border-color: var(--parchment);
        }
        .manual-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        .manual-section {
          padding: 1.5rem;
          background: var(--parchment);
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }
        .manual-section h2 {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 1.1rem;
          font-family: var(--font-serif);
          color: var(--antique-red);
          border-bottom: 1px dotted var(--parchment-dark);
          padding-bottom: 0.5rem;
        }
        .manual-section p {
          font-size: 0.9rem;
          line-height: 1.6;
          color: var(--antique-ink);
        }
      `}</style>
    </div>
  );
};

export default ManualTab;
