export interface ExpenseDetail {
    id: string;
    name: string;
    amount: number;
}

export interface TripItem {
    id: string;
    time: string;
    name: string;
    location: string;
    memo: string;
    privateMemo?: string; // 自分だけの裏メモ
    expense: number;
    actualExpense?: number;
    expenseDetails?: ExpenseDetail[];
    mapLink?: string;
    bookingLink?: string;
    completed: boolean;
    transport?: 'plane' | 'train' | 'bus' | 'car' | 'walk' | 'bike' | 'ship' | 'robot' | 'tram';
}

export interface DaySchedule {
    day: number;
    date: string;
    title: string;
    items: TripItem[];
}

export interface CoordinateItem {
    jacket: string;
    inner: string;
    bottoms: string;
    shoes: string;
    memo: string;
}

export interface PackingItem {
    id: string;
    category: string;
    name: string;
    checked: boolean;
}

export interface CustomPackingTemplate {
    id: string;
    name: string;
    items: { category: string; name: string }[];
}

export interface BudgetItem {
    id: string;
    name: string;
    amount: number;
    status: string;
}

export interface BucketItem {
    id: string;
    name: string;
    checked: boolean;
}

export interface PhotoItem {
    id: string;
    day: number;
    url: string;
    caption: string;
    date: string;
}

export interface EmergencyInfo {
    hospital: string;
    hotel: string;
    other: string;
}

export interface AppData {
    schedule: DaySchedule[];
    coordinates: Record<number, CoordinateItem>;
    packing: PackingItem[];
    budget: BudgetItem[];
    bucketList: BucketItem[];
    photos: PhotoItem[];
    emergency: EmergencyInfo;
    passcode?: string; // 裏メモ用パスコード
    tripTitle?: string;
    targetDate?: string;
    countdownLabel?: string;
}

export interface Trip {
    id: string;
    title: string;
    description: string;
    createdAt: string;
    data: AppData;
}

export interface GlobalState {
    trips: Trip[];
    isPremium: boolean;
    customPackingTemplates?: CustomPackingTemplate[];
}
