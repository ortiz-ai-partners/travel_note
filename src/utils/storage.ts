import { Preferences } from '@capacitor/preferences';

export const storage = {
    get: async <T>(key: string): Promise<T | null> => {
        try {
            const { value } = await Preferences.get({ key });
            return value ? JSON.parse(value) : null;
        } catch (e) {
            console.error('Storage get error', e);
            return null;
        }
    },
    set: async <T>(key: string, value: T): Promise<void> => {
        try {
            await Preferences.set({
                key,
                value: JSON.stringify(value),
            });
        } catch (e) {
            console.error('Storage set error', e);
        }
    },
    delete: async (key: string): Promise<void> => {
        try {
            await Preferences.remove({ key });
        } catch (e) {
            console.error('Storage delete error', e);
        }
    },
    list: async (): Promise<string[]> => {
        try {
            const { keys } = await Preferences.keys();
            return keys;
        } catch (e) {
            console.error('Storage list error', e);
            return [];
        }
    }
};
