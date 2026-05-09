import { useEffect, useRef, useState } from "react";
import { Audio } from "expo-av";
import { Animated, Easing, Pressable, StyleSheet, Text, View } from "react-native";
import { Colors } from "@/src/theme/colors";
import { SavedRecording, saveRecordingUri } from "@/src/storage/recordings";

export default function RecordScreen() {
  const [isRecording, setIsRecording] = useState(false);
  const [latestRecording, setLatestRecording] = useState<SavedRecording | null>(null);
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
          duration: 900,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 900,
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

  const toggleRecording = async () => {
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

  return (
    <View style={styles.container}>
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
                  outputRange: [0.22, 0.72],
                }),
                transform: [
                  {
                    scale: pulse.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.25],
                    }),
                  },
                ],
              },
            ]}
          />
        ) : null}
        <View style={styles.recordButton} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    justifyContent: "center",
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
});
