import { useEffect, useRef, useState } from "react";
import { Audio } from "expo-av";
import axios from "axios";
import {
  ActivityIndicator,
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Colors } from "@/src/theme/colors";
import { saveDreamEntry } from "@/src/storage/dreamEntries";
import { SavedRecording, saveRecordingUri } from "@/src/storage/recordings";
import { DreamTags } from "@/src/types/dream";

const EMPTY_TAGS: DreamTags = {
  symbols: [],
  emotions: [],
  figures: [],
  setting: "",
};

export default function RecordScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [latestRecording, setLatestRecording] = useState<SavedRecording | null>(null);
  const [transcript, setTranscript] = useState("");
  const [tags, setTags] = useState<DreamTags>(EMPTY_TAGS);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isRecording) {
      pulse.stopAnimation();
      pulse.setValue(0);
      return;
    }

    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 1200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 1200,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    loop.start();
    return () => {
      loop.stop();
    };
  }, [isRecording, pulse]);

  useEffect(() => {
    return () => {
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync().catch(() => {
          // Swallow cleanup errors when leaving the screen.
        });
      }
    };
  }, []);

  const extractTags = async (nextTranscript: string): Promise<DreamTags> => {
    const response = await axios.post<{ tags: DreamTags }>("/api/tag", {
      transcript: nextTranscript,
    });
    return response.data.tags ?? EMPTY_TAGS;
  };

  const transcribeAudio = async (uri: string): Promise<string> => {
    const formData = new FormData();
    formData.append("file", {
      uri,
      type: "audio/m4a",
      name: "dream-recording.m4a",
    } as never);
    const response = await axios.post<{ transcript: string }>("/api/transcribe", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.transcript ?? "";
  };

  const processRecording = async (uri: string) => {
    setIsProcessing(true);
    try {
      const nextTranscript = await transcribeAudio(uri);
      setTranscript(nextTranscript);
      const nextTags = await extractTags(nextTranscript);
      setTags(nextTags);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleRecording = async () => {
    if (isProcessing || isSaving) return;

    if (isRecording) {
      const activeRecording = recordingRef.current;
      if (!activeRecording) return;

      await activeRecording.stopAndUnloadAsync();
      const uri = activeRecording.getURI();
      recordingRef.current = null;
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      setIsRecording(false);
      if (uri) {
        try {
          const saved = await saveRecordingUri(uri);
          setLatestRecording(saved);
          await processRecording(uri);
        } catch {
          // Keep recording UX responsive even if local persistence fails.
        }
      }
      return;
    }

    const permission = await Audio.requestPermissionsAsync();
    if (!permission.granted) return;

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    recordingRef.current = recording;
    setIsRecording(true);
  };

  const removeTag = (key: "symbols" | "emotions" | "figures", value: string) => {
    setTags((current) => ({
      ...current,
      [key]: current[key].filter((item) => item !== value),
    }));
  };

  const removeSetting = () => {
    setTags((current) => ({ ...current, setting: "" }));
  };

  const handleSave = async () => {
    if (!latestRecording || !transcript.trim() || isSaving) return;
    setIsSaving(true);
    try {
      await saveDreamEntry({
        transcript: transcript.trim(),
        tags,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const hasResult = transcript.trim().length > 0;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.wordmark}>DREAM THREAD</Text>
      <Pressable
        onPress={toggleRecording}
        style={styles.buttonWrap}
        accessibilityRole="button"
        accessibilityLabel="Record dream"
        accessibilityHint={
          latestRecording
            ? `Latest saved recording at ${latestRecording.createdAt}`
            : "Double tap to start or stop recording"
        }
      >
        {isRecording ? (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.pulseRing,
              {
                opacity: pulse.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.12, 0.36],
                }),
                transform: [
                  {
                    scale: pulse.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.14],
                    }),
                  },
                ],
              },
            ]}
          />
        ) : null}
        <View style={styles.recordButton} />
      </Pressable>

      {isProcessing ? (
        <View style={styles.processingWrap}>
          <ActivityIndicator color={Colors.accent} />
        </View>
      ) : null}

      {hasResult ? (
        <>
          <View style={styles.card}>
            <TextInput
              value={transcript}
              onChangeText={setTranscript}
              multiline
              placeholder="Transcript will appear here"
              placeholderTextColor={Colors.text}
              style={styles.transcriptInput}
            />
          </View>

          <View style={styles.chipsSection}>
            <View style={styles.chipsRow}>
              {tags.symbols.map((item) => (
                <Pressable key={`symbol-${item}`} onPress={() => removeTag("symbols", item)} style={[styles.chip, styles.symbolChip]}>
                  <Text style={styles.chipText}>{item}</Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.chipsRow}>
              {tags.emotions.map((item) => (
                <Pressable key={`emotion-${item}`} onPress={() => removeTag("emotions", item)} style={[styles.chip, styles.emotionChip]}>
                  <Text style={styles.chipText}>{item}</Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.chipsRow}>
              {tags.figures.map((item) => (
                <Pressable key={`figure-${item}`} onPress={() => removeTag("figures", item)} style={[styles.chip, styles.figureChip]}>
                  <Text style={styles.chipText}>{item}</Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.chipsRow}>
              {tags.setting ? (
                <Pressable onPress={removeSetting} style={[styles.chip, styles.settingChip]}>
                  <Text style={styles.chipText}>{tags.setting}</Text>
                </Pressable>
              ) : null}
            </View>
          </View>

          <Pressable onPress={handleSave} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>{isSaving ? "Saving..." : "Save"}</Text>
          </Pressable>
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: "100%",
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingTop: 120,
    paddingBottom: 40,
    alignItems: "center",
  },
  wordmark: {
    position: "absolute",
    top: 64,
    color: Colors.accent,
    fontSize: 12,
    letterSpacing: 3.2,
    fontWeight: "600",
  },
  buttonWrap: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
  },
  pulseRing: {
    position: "absolute",
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 2,
    borderColor: Colors.accent,
  },
  recordButton: {
    width: 80,
    height: 80,
    backgroundColor: Colors.accent,
    borderRadius: 40,
  },
  processingWrap: {
    marginTop: 20,
    height: 28,
    justifyContent: "center",
  },
  card: {
    width: "100%",
    marginTop: 24,
    borderRadius: 14,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
  },
  transcriptInput: {
    minHeight: 120,
    color: Colors.text,
    fontSize: 15,
    textAlignVertical: "top",
  },
  chipsSection: {
    width: "100%",
    marginTop: 14,
    gap: 10,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipText: {
    color: Colors.background,
    fontWeight: "600",
    fontSize: 13,
  },
  symbolChip: {
    backgroundColor: Colors.accent,
  },
  emotionChip: {
    backgroundColor: "#2DD4BF",
  },
  figureChip: {
    backgroundColor: "#FB7185",
  },
  settingChip: {
    backgroundColor: "#AFA9EC",
  },
  saveButton: {
    marginTop: 18,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: Colors.accent,
  },
  saveButtonText: {
    color: Colors.background,
    fontWeight: "700",
    fontSize: 16,
  },
});
