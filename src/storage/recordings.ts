import AsyncStorage from "@react-native-async-storage/async-storage";

export type SavedRecording = {
  id: string;
  createdAt: string;
  uri: string;
};

const RECORDINGS_KEY = "dream-thread:recordings";

export async function saveRecordingUri(uri: string): Promise<SavedRecording> {
  const nextItem: SavedRecording = {
    id: `${Date.now()}`,
    createdAt: new Date().toISOString(),
    uri,
  };

  const raw = await AsyncStorage.getItem(RECORDINGS_KEY);
  const items: SavedRecording[] = raw ? JSON.parse(raw) : [];
  const next = [nextItem, ...items];

  await AsyncStorage.setItem(RECORDINGS_KEY, JSON.stringify(next));
  return nextItem;
}
