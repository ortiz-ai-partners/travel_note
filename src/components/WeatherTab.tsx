import React from 'react';
import { Cloud, Sun, CloudRain, ThermometerSun, Leaf } from 'lucide-react';

const WeatherTab: React.FC = () => {
    const forecast = [
        { date: '3/25', icon: <Sun color="#ffb347" />, temp: '16°C / 8°C', desc: '晴れときどき曇り', advice: '日中は薄手のジャケットで快適です。' },
        { date: '3/26', icon: <Cloud color="#a0ced9" />, temp: '14°C / 9°C', desc: '曇り', advice: '少し肌寒くなるかも。ジャケットの下にインナーを。' },
        { date: '3/27', icon: <CloudRain color="#89cff0" />, temp: '15°C / 10°C', desc: '雨のち晴れ', advice: '折りたたみ傘を忘れずに。夕方は冷えます。' },
    ];

    return (
        <div className="weather-tab">
            <div className="weather-overview card">
                <h2 className="weather-city">東京の天気予報</h2>
                <p className="weather-period">2026年3月25日 — 3月27日</p>
            </div>

            <div className="forecast-grid">
                {forecast.map(f => (
                    <div key={f.date} className="forecast-card card">
                        <div className="forecast-date">{f.date}</div>
                        <div className="forecast-icon">{f.icon}</div>
                        <div className="forecast-temp">{f.temp}</div>
                        <div className="forecast-desc">{f.desc}</div>
                    </div>
                ))}
            </div>

            <div className="advice-card card">
                <h3 className="advice-title"><ThermometerSun size={18} /> 服装のアドバイス</h3>
                <p className="advice-text">
                    3月末の東京は春の陽気ですが、朝晩は10℃を下回ることもあります。
                    <br /><br />
                    <Leaf size={14} /> <strong>おすすめ:</strong> 脱ぎ着しやすい薄手のジャケット、ストールなど。安田講堂前での写真はグレーピンストライプが映えそうです。
                </p>
            </div>

            <style>{`
        .weather-overview {
          text-align: center;
          background: linear-gradient(135deg, #e0f7fa, #fff);
          margin-bottom: 1.5rem;
        }
        .weather-city {
          font-size: 1.2rem;
          color: #00838f;
        }
        .weather-period {
          font-size: 0.8rem;
          color: var(--text-muted);
        }
        .forecast-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.8rem;
          margin-bottom: 1.5rem;
        }
        .forecast-card {
          padding: 1rem 0.5rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        .forecast-date {
          font-weight: 700;
          font-size: 0.9rem;
        }
        .forecast-icon {
          padding: 0.5rem;
        }
        .forecast-temp {
          font-size: 0.75rem;
          font-weight: 600;
          color: #e67e22;
        }
        .forecast-desc {
          font-size: 0.7rem;
          color: var(--text-muted);
        }
        .advice-card {
          border-left: 5px solid var(--sakura-pink);
        }
        .advice-title {
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.8rem;
          color: #d85d8d;
        }
        .advice-text {
          font-size: 0.85rem;
          line-height: 1.5;
        }
      `}</style>
        </div>
    );
};

export default WeatherTab;
