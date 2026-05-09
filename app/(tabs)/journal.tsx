import { useCallback, useMemo, useState } from "react";
import { useFocusEffect } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { getDreamEntries } from "@/src/storage/dreamEntries";
import { Colors } from "@/src/theme/colors";
import { DreamEntry } from "@/src/types/dream";

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const day = new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date);
  const dayOfMonth = new Intl.DateTimeFormat("en-US", { day: "numeric" }).format(date);
  const month = new Intl.DateTimeFormat("en-US", { month: "short" }).format(date);
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })
    .format(date)
    .replace(" ", "")
    .toLowerCase();

  return `${day} ${dayOfMonth} ${month} · ${time}`;
}

function truncateTranscript(value: string): string {
  if (value.length <= 80) return value;
  return `${value.slice(0, 80)}...`;
}

function tagsForCard(entry: DreamEntry): string[] {
  return [
    ...entry.tags.symbols,
    ...entry.tags.emotions,
    ...entry.tags.figures,
    ...(entry.tags.setting ? [entry.tags.setting] : []),
  ].slice(0, 4);
}

function containsTag(entry: DreamEntry, tag: string): boolean {
  return (
    entry.tags.symbols.includes(tag) ||
    entry.tags.emotions.includes(tag) ||
    entry.tags.figures.includes(tag) ||
    entry.tags.setting === tag
  );
}

export default function JournalScreen() {
  const [entries, setEntries] = useState<DreamEntry[]>([]);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const loadEntries = useCallback(async () => {
    const stored = await getDreamEntries();
    setEntries(stored);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [loadEntries])
  );

  const visibleEntries = useMemo(() => {
    if (!activeTag) return entries;
    return entries.filter((entry) => containsTag(entry, activeTag));
  }, [activeTag, entries]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Journal</Text>
      {visibleEntries.map((entry) => (
        <View key={entry.id} style={styles.card}>
          <Text style={styles.dateText}>{formatTimestamp(entry.timestamp)}</Text>
          <Text style={styles.transcriptText}>{truncateTranscript(entry.transcript)}</Text>
          <View style={styles.chipsRow}>
            {tagsForCard(entry).map((tag) => {
              const selected = activeTag === tag;
              return (
                <Pressable
                  key={`${entry.id}-${tag}`}
                  onPress={() => setActiveTag(selected ? null : tag)}
                  style={[styles.chip, selected && styles.chipActive]}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextActive]}>{tag}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: "100%",
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 24,
    gap: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text,
    marginBottom: 2,
  },
  card: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 14,
    gap: 10,
  },
  dateText: {
    color: Colors.accent,
    fontSize: 13,
    fontWeight: "600",
  },
  transcriptText: {
    color: Colors.text,
    fontSize: 15,
    lineHeight: 21,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    backgroundColor: Colors.border,
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  chipActive: {
    backgroundColor: Colors.accent,
  },
  chipText: {
    color: Colors.mutedText,
    fontSize: 12,
    fontWeight: "600",
  },
  chipTextActive: {
    color: Colors.background,
  },
});
