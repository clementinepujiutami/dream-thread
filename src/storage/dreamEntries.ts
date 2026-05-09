import AsyncStorage from "@react-native-async-storage/async-storage";
import { DreamEntry } from "@/src/types/dream";

const ENTRIES_KEY = "dream-thread:entries";

const SEED_ENTRIES: DreamEntry[] = [
  {
    id: "3de87ba1-58d4-4d09-9443-3f2fe4c7d101",
    timestamp: "2026-02-03T03:14:00.000Z",
    transcript:
      "I was crossing a wooden bridge over black water while carrying a lantern and hearing distant birds.",
    tags: {
      symbols: ["bridge", "lantern"],
      emotions: ["curious", "uneasy"],
      figures: ["stranger"],
      setting: "river at night",
    },
  },
  {
    id: "f64d5a39-7948-4ff9-b45a-2b8ceeb70c43",
    timestamp: "2026-02-02T23:41:00.000Z",
    transcript:
      "My old school hallway stretched forever and every classroom had a different moon in the window.",
    tags: {
      symbols: ["hallway", "moon"],
      emotions: ["nostalgic", "confused"],
      figures: ["classmates"],
      setting: "school",
    },
  },
  {
    id: "75d88e9f-f44e-4b8e-a0a2-4bd621f779e9",
    timestamp: "2026-02-01T06:50:00.000Z",
    transcript:
      "I was sorting postcards in a train station while rain echoed on the roof and clocks moved backward.",
    tags: {
      symbols: ["postcards", "clock", "train"],
      emotions: ["focused", "anxious"],
      figures: ["ticket clerk"],
      setting: "train station",
    },
  },
  {
    id: "1fd74316-3988-48d0-90ea-f26faed74f80",
    timestamp: "2026-01-31T01:22:00.000Z",
    transcript:
      "A fox followed me through a quiet market where fruit stalls glowed blue and everyone whispered.",
    tags: {
      symbols: ["fox", "market", "fruit"],
      emotions: ["calm", "alert"],
      figures: ["vendors"],
      setting: "night market",
    },
  },
  {
    id: "bda3a774-1d03-44db-aeaf-28eb1af30b03",
    timestamp: "2026-01-29T18:05:00.000Z",
    transcript:
      "I kept planting paper boats in wet sand while my sister drew circles around each wave.",
    tags: {
      symbols: ["paper boats", "circles", "waves"],
      emotions: ["hopeful", "gentle"],
      figures: ["sister"],
      setting: "beach",
    },
  },
];

function createUuidV4(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = Math.floor(Math.random() * 16);
    const value = char === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

export async function getDreamEntries(): Promise<DreamEntry[]> {
  const raw = await AsyncStorage.getItem(ENTRIES_KEY);
  const current: DreamEntry[] = raw ? JSON.parse(raw) : [];

  if (current.length > 0) {
    return current.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(SEED_ENTRIES));
  return SEED_ENTRIES;
}

export async function saveDreamEntry(
  entry: Omit<DreamEntry, "id" | "timestamp">
): Promise<DreamEntry> {
  const nextEntry: DreamEntry = {
    id: createUuidV4(),
    timestamp: new Date().toISOString(),
    ...entry,
  };

  const raw = await AsyncStorage.getItem(ENTRIES_KEY);
  const current: DreamEntry[] = raw ? JSON.parse(raw) : [];
  const next = [nextEntry, ...current];
  await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(next));
  return nextEntry;
}
