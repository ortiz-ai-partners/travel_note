export const storage = {
    get: <T>(key: string): T | null => {
        try {
            // simulate window.storage or use localStorage
            const item = typeof window !== 'undefined' && (window as any).storage
                ? (window as any).storage.get(key)
                : localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('Storage get error', e);
            return null;
        }
    },
    set: <T>(key: string, value: T): void => {
        try {
            const stringValue = JSON.stringify(value);
            if (typeof window !== 'undefined' && (window as any).storage) {
                (window as any).storage.set(key, stringValue);
            } else {
                localStorage.setItem(key, stringValue);
            }
        } catch (e) {
            console.error('Storage set error', e);
        }
    },
    delete: (key: string): void => {
        try {
            if (typeof window !== 'undefined' && (window as any).storage) {
                (window as any).storage.delete(key);
            } else {
                localStorage.removeItem(key);
            }
        } catch (e) {
            console.error('Storage delete error', e);
        }
    },
    list: (): string[] => {
        try {
            if (typeof window !== 'undefined' && (window as any).storage) {
                return (window as any).storage.list();
            } else {
                return Object.keys(localStorage);
            }
        } catch (e) {
            console.error('Storage list error', e);
            return [];
        }
    }
};
