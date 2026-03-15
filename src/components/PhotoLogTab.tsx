import React, { useState, useRef } from 'react';
import type { AppData, PhotoItem } from '../types';
import { Camera, Plus, Trash2, MessageSquare } from 'lucide-react';

interface Props {
  data: AppData;
  setData: React.Dispatch<React.SetStateAction<AppData>>;
}

const PhotoLogTab: React.FC<Props> = ({ data, setData }) => {
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDimension = 1000;

          if (width > height) {
            if (width > maxDimension) {
              height *= maxDimension / width;
              width = maxDimension;
            }
          } else {
            if (height > maxDimension) {
              width *= maxDimension / height;
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.6));
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressedBase64 = await compressImage(file);
      const caption = window.prompt('この時の思い出をひとこと！') || '';
      const day = data.schedule[selectedDayIdx]?.day || 1;

      const newPhoto: PhotoItem = {
        id: `ph-${Date.now()}`,
        day,
        url: compressedBase64,
        caption,
        date: new Date().toISOString().split('T')[0]
      };

      setData({ ...data, photos: [...data.photos, newPhoto] });
    } catch (err) {
      console.error('Image processing failed:', err);
      alert('画像の処理に失敗しました。');
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const addPhotoChoice = () => {
    const choice = window.confirm('カメラ・写真ライブラリから追加しますか？\n（キャンセルでURL入力を続行）');
    if (choice) {
      fileInputRef.current?.click();
    } else {
      const url = window.prompt('写真のURLを入力してください:');
      if (!url) return;
      const caption = window.prompt('この時の思い出をひとこと！') || '';
      const day = data.schedule[selectedDayIdx]?.day || 1;

      const newPhoto: PhotoItem = {
        id: `ph-${Date.now()}`,
        day,
        url,
        caption,
        date: new Date().toISOString().split('T')[0]
      };
      setData({ ...data, photos: [...data.photos, newPhoto] });
    }
  };

  const removePhoto = (id: string) => {
    if (window.confirm('この記憶を抹消しますか？')) {
      setData({ ...data, photos: data.photos.filter(p => p.id !== id) });
    }
  };

  const filteredPhotos = data.photos.filter(p => p.day === data.schedule[selectedDayIdx]?.day);

  return (
    <div className="photo-log-tab">
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

      <div className="photo-grid">
        {filteredPhotos.length === 0 && (
          <div className="empty-state card">
            <Camera size={48} color="var(--antique-gold)" />
            <p>まだこの日の記憶がありません。<br />旅先での景色をここに刻みましょう。</p>
          </div>
        )}
        {filteredPhotos.map(photo => (
          <div key={photo.id} className="photo-card card">
            <img
              src={photo.url}
              alt="Memory"
              className="photo-img"
              onClick={() => setPreviewPhoto(photo.url)}
              style={{ cursor: 'zoom-in' }}
            />
            <div className="photo-info">
              <p className="photo-comment"><MessageSquare size={12} /> {photo.caption}</p>
              <button className="delete-btn" onClick={() => removePhoto(photo.id)}><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>

      {previewPhoto && (
        <div className="photo-modal-overlay" onClick={() => setPreviewPhoto(null)}>
          <div className="photo-modal-content">
            <img src={previewPhoto} alt="Full Memory" className="photo-modal-img" />
            <button className="modal-close-btn">×</button>
          </div>
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: 'none' }}
        ref={fileInputRef}
        onChange={handleFileUpload}
      />
      <button className="add-photo-btn antique-btn" onClick={addPhotoChoice}>
        <Plus size={20} /> 新たな記憶を刻む
      </button>

      <style>{`
        .photo-log-tab {
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
        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 4rem 1rem;
          color: var(--text-muted);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          font-family: var(--font-serif);
          font-style: italic;
        }
        .photo-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
        }
        .photo-card {
          padding: 0.8rem;
          overflow: hidden;
          background: var(--parchment);
          border: 1px solid var(--parchment-dark);
          box-shadow: 3px 3px 15px rgba(0,0,0,0.15);
          transition: transform 0.3s;
        }
        .photo-card:hover {
          transform: scale(1.02);
        }
        .photo-img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border: 1px solid rgba(0,0,0,0.1);
        }
        .photo-info {
          padding: 1rem 0.5rem 0.5rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 0.5rem;
        }
        .photo-comment {
          font-size: 0.9rem;
          color: var(--antique-ink);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-serif);
          font-style: italic;
          line-height: 1.4;
        }
        .delete-btn {
          color: var(--parchment-dark);
          transition: all 0.2s;
        }
        .delete-btn:hover {
          color: var(--antique-red);
        }
        .add-photo-btn {
          margin-top: 1rem;
          align-self: center;
          padding: 1rem 2rem;
          font-family: var(--font-serif);
          font-size: 1rem;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
        }
        .photo-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1500;
          padding: 1rem;
          cursor: zoom-out;
        }
        .photo-modal-content {
          position: relative;
          max-width: 95%;
          max-height: 95%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .photo-modal-img {
          max-width: 100%;
          max-height: 90vh;
          object-fit: contain;
          box-shadow: 0 5px 30px rgba(0,0,0,0.5);
          border: 4px solid var(--parchment);
        }
        .modal-close-btn {
          position: absolute;
          top: -20px;
          right: -20px;
          width: 40px;
          height: 40px;
          background: var(--antique-red);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          border: 2px solid var(--parchment);
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  );
};

export default PhotoLogTab;
