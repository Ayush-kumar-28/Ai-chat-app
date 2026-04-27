import React from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { ModelProvider } from './src/context/ModelContext';
import SetupScreen from './src/screens/SetupScreen';
import ChatScreen from './src/screens/ChatScreen';
import { useModelContext } from './src/context/ModelContext';

function AppContent() {
  const { status } = useModelContext();
  return status === 'ready' ? <ChatScreen /> : <SetupScreen />;
}

export default function App() {
  return (
    <ModelProvider>
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor="#0A0A14" />
        <AppContent />
      </View>
    </ModelProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0A0A14' },
});
