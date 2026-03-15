import type { AppData } from './types';

export const initialData: AppData = {
    schedule: [
        {
            day: 1,
            date: '2026-03-25',
            title: '浅草・下町情緒を巡る',
            items: [
                { id: 's1-1', time: '10:00', name: '羽田空港 到着', location: '羽田空港', memo: '京急線またはモノレールで都内へ移動', expense: 0, completed: false, transport: 'plane' },
                { id: 's1-2', time: '12:30', name: '浅草 仲見世通り', location: '浅草', memo: '雷門から浅草寺へ。名物の人形焼をチェック。', expense: 2000, completed: false },
                { id: 's1-3', time: '15:30', name: '東京スカイツリー', location: '押上', memo: '展望デッキからの景色を一望。', expense: 3100, completed: false, transport: 'walk' },
                { id: 's1-4', time: '18:30', name: 'ホテル チェックイン', location: '浅草周辺', memo: '預けた荷物を受け取り、夜の浅草散策へ。', expense: 12000, completed: false },
            ]
        },
        {
            day: 2,
            date: '2026-03-26',
            title: '近代建築と都会のオアシス',
            items: [
                { id: 's2-1', time: '10:00', name: '明治神宮 参拝', location: '原宿', memo: '都心の豊かな森でリフレッシュ。', expense: 0, completed: false, transport: 'train' },
                { id: 's2-2', time: '13:00', name: '表参道でランチ', location: '表参道', memo: '話題のおしゃれなカフェで休憩。', expense: 2500, completed: false },
                { id: 's2-3', time: '16:00', name: '東京都庁 展望室', location: '新宿', memo: '夕暮れの都会の景色を楽しむ。', expense: 0, completed: false, transport: 'train' },
                { id: 's2-4', time: '19:00', name: '新宿で夕食', location: '新宿', memo: '予約したレストランで和食を。', expense: 5000, completed: false },
            ]
        },
        {
            day: 3,
            date: '2026-03-27',
            title: 'アートと最後のショッピング',
            items: [
                { id: 's3-1', time: '11:00', name: '国立新美術館', location: '六本木', memo: '企画展を鑑賞し、建築美を楽しむ。', expense: 2000, completed: false },
                { id: 's3-2', time: '14:30', name: '東京駅でお土産探し', location: '東京駅', memo: '東京ギフトパレットで限定品を購入。', expense: 5000, completed: false, transport: 'train' },
                { id: 's3-3', time: '17:30', name: '羽田空港へ移動', location: '羽田空港', memo: 'ラウンジで一息ついてから搭乗。', expense: 0, completed: false, transport: 'plane' },
            ]
        }
    ],
    coordinates: {
        1: { jacket: 'トレンチコート', inner: 'セットアップ', bottoms: 'スラックス', shoes: 'ローファー', memo: '上品な浅草散策スタイル' },
        2: { jacket: 'テーラードジャケット', inner: 'ニット', bottoms: 'デニム', shoes: 'スニーカー', memo: '歩きやすさ重視の都会派コーデ' },
        3: { jacket: 'トレンチコート', inner: 'ブラウス', bottoms: 'スラックス', shoes: 'スニーカー', memo: '帰りに備えたリラックススタイル' }
    },
    packing: [
        { id: 'p1', category: '必需品', name: 'スマートフォン・充電器', checked: false },
        { id: 'p2', category: '必需品', name: 'モバイルバッテリー', checked: false },
        { id: 'p3', category: '必需品', name: '折りたたみ傘', checked: false },
        { id: 'p4', category: '必需品', name: '常備薬', checked: false },
    ],
    budget: [
        { id: 'b1', name: '航空券', amount: 30000, status: '支払い済み' },
        { id: 'b2', name: '宿泊費', amount: 24000, status: '予約済み' },
        { id: 'b3', name: '食費・観光', amount: 20000, status: '概算' },
    ],
    bucketList: [
        { id: 'bl1', name: 'スカイツリーから富士山を見る', checked: false },
        { id: 'bl2', name: '明治神宮で御朱印をいただく', checked: false },
        { id: 'bl3', name: '話題のスイーツを堪能する', checked: false },
    ],
    photos: [],
    emergency: {
        hospital: '東京都立広尾病院 (03-3444-1181)',
        hotel: '未定',
        other: '110 (警察), 119 (消防・救急)',
    },
    passcode: '',
    tripTitle: '東京観光ガイド（サンプル）',
    targetDate: '2026-03-25T05:00:00',
    countdownLabel: '2026/3/25 05:00 鹿屋発 まで'
};
