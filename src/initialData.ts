import type { AppData } from './types';

export const initialData: AppData = {
    schedule: [
        {
            day: 1,
            date: '2026-03-25',
            title: 'スパイスの神託',
            items: [
                { id: 's1-1', time: '10:00', name: '羽田空港 到着', location: '羽田空港', memo: '都会の空気を吸い込む（深呼吸）', expense: 0, completed: false, transport: 'plane' },
                { id: 's1-2', time: '12:30', name: '神保町カレー修行', location: '神保町', memo: '行列は修行の一部。お腹を空かせて挑む。', expense: 1500, completed: false },
                { id: 's1-3', time: '18:00', name: '夜の都庁で黄昏れる', location: '東京都庁', memo: '無料の絶景に感謝。カップルを避けつつ夜景を。', expense: 0, completed: false, transport: 'walk' },
                { id: 's1-4', time: '21:00', name: 'チェックイン', location: '未定', memo: '「写真は広そうだった」ホテルに到着。', expense: 8000, completed: false },
            ]
        },
        {
            day: 2,
            date: '2026-03-26',
            title: '新宿迷宮探索',
            items: [
                { id: 's2-1', time: '10:00', name: '新宿駅という名のダンジョン', location: '新宿駅', memo: '西口から東口へ。最短ルートを見つけるまで帰れない。', expense: 0, completed: false, transport: 'train' },
                { id: 's2-2', time: '14:00', name: '高級ケーキで背筋を伸ばす', location: '銀座', memo: 'ランチ代より高いケーキ。背徳感が最高のスパイス。', expense: 2500, completed: false },
                { id: 's2-3', time: '19:00', name: '赤提灯で一杯', location: '思い出横丁', memo: '「これぞ東京」という狭さを楽しむ。', expense: 3000, completed: false },
            ]
        },
        {
            day: 3,
            date: '2026-03-27',
            title: '現実への帰還',
            items: [
                { id: 's3-1', time: '11:00', name: '自分へのお土産購入会', location: '東京駅', memo: '「限定」という言葉に負けない強い意志を持つ。', expense: 5000, completed: false },
                { id: 's3-2', time: '14:00', name: '最後の晩餐（ラーメン）', location: '東京ラーメンストリート', memo: '「明日からダイエット」という誓い（n回目）。', expense: 1200, completed: false },
                { id: 's3-3', time: '18:00', name: 'さらば、魅惑の都', location: '羽田空港', memo: '次に会う日まで、さらば東京。', expense: 0, completed: false, transport: 'plane' },
            ]
        }
    ],
    coordinates: {
        1: { jacket: 'ベージュ', inner: 'ボーダーT', bottoms: 'チノパン', shoes: 'スニーカー', memo: '歩きやすさ重視のスパイス仕様' },
        2: { jacket: '黒（少し良いやつ）', inner: '白シャツ', bottoms: 'スラックス', shoes: '革靴', memo: '銀座に馴染むための擬態' },
        3: { jacket: 'ベージュ', inner: 'カジュアル', bottoms: 'チノパン', shoes: 'スニーカー', memo: '帰りに備えたリラックススタイル' }
    },
    packing: [
        { id: 'p1', category: '必需品', name: 'モバイルバッテリー', checked: false },
        { id: 'p2', category: '必需品', name: '胃薬', checked: false },
        { id: 'p3', category: '必需品', name: '予備のバッグ（お土産用）', checked: false },
        { id: 'p4', category: '必需品', name: '歩き慣れた靴', checked: false },
    ],
    budget: [
        { id: 'b1', name: '航空券', amount: 0, status: '支払い済み' },
        { id: 'b2', name: '宿泊費', amount: 16000, status: '予約済み' },
        { id: 'b3', name: '食い倒れ予算', amount: 10000, status: '欲望の重さ' },
    ],
    bucketList: [
        { id: 'bl1', name: '新宿駅で迷わずに目的地に到達する', checked: false },
        { id: 'bl2', name: 'ランチ代より高いケーキを真顔で食べる', checked: false },
        { id: 'bl3', name: '「明日からダイエット」と3回唱える', checked: false },
    ],
    photos: [],
    emergency: {
        hospital: '東京都立広尾病院 (03-3444-1181)',
        hotel: '未定',
        other: '110 (警察), 119 (消防・救急)',
    },
    passcode: '',
    tripTitle: '東京・食い倒れと迷宮探索の書',
    targetDate: '2026-03-25T05:00:00',
    countdownLabel: '2026/3/25 05:00 鹿屋発 まで'
};
