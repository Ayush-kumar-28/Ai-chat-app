import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, SafeAreaView } from 'react-native';
import { useModelContext } from '../context/ModelContext';

export default function SetupScreen() {
  const { status, progress, error } = useModelContext();
  const isError = status === 'error';

  const STATUS_STEPS: { key: string; label: string }[] = [
    { key: 'idle', label: 'Initializing SDK' },
    { key: 'downloading', label: 'Downloading model' },
    { key: 'loading', label: 'Loading into memory' },
  ];

  const stepIndex = STATUS_STEPS.findIndex(s => s.key === status);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>🤖</Text>
        </View>

        <Text style={styles.title}>AI Chat</Text>
        <Text style={styles.subtitle}>On-device · Private · Offline</Text>

        <View style={styles.card}>
          {isError ? (
            <Text style={styles.errorText}>⚠️ {error}</Text>
          ) : (
            <>
              {STATUS_STEPS.map((step, i) => {
                const done = i < stepIndex;
                const active = i === stepIndex;
                return (
                  <View key={step.key} style={styles.stepRow}>
                    <View style={[styles.stepDot, done && styles.stepDone, active && styles.stepActive]}>
                      {done && <Text style={styles.checkmark}>✓</Text>}
                      {active && <ActivityIndicator size={10} color="#FFF" />}
                    </View>
                    <Text style={[styles.stepLabel, active && styles.stepLabelActive]}>
                      {step.label}
                    </Text>
                  </View>
                );
              })}

              {status === 'downloading' && (
                <View style={styles.progressWrap}>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
                  </View>
                  <Text style={styles.progressText}>{(progress * 100).toFixed(0)}%</Text>
                </View>
              )}
            </>
          )}
        </View>

        <Text style={styles.hint}>
          {isError ? 'Please restart the app.' : 'First launch downloads ~700MB'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0A0A14' },
  container: {
    flex: 1,
    backgroundColor: '#0A0A14',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#16162A',
    borderWidth: 1,
    borderColor: '#2A2A45',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: { fontSize: 36 },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#555577',
    marginBottom: 36,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  card: {
    width: '100%',
    backgroundColor: '#16162A',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2A2A45',
    padding: 20,
    gap: 14,
    marginBottom: 20,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#2A2A45',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepDone: { backgroundColor: '#4ADE80' },
  stepActive: { backgroundColor: '#6C63FF' },
  checkmark: { fontSize: 11, color: '#FFF', fontWeight: '700' },
  stepLabel: { fontSize: 14, color: '#555577' },
  stepLabelActive: { color: '#CCCCDD', fontWeight: '600' },
  progressWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 4,
  },
  progressTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#2A2A45',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6C63FF',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#6C63FF',
    fontWeight: '600',
    width: 36,
    textAlign: 'right',
  },
  errorText: {
    fontSize: 14,
    color: '#FF6B6B',
    lineHeight: 22,
  },
  hint: {
    fontSize: 12,
    color: '#333355',
    textAlign: 'center',
  },
});