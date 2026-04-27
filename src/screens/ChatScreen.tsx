import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList,
  StyleSheet, KeyboardAvoidingView, Platform, SafeAreaView,
} from 'react-native';
import { useModelContext } from '../context/ModelContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  streaming?: boolean;
}

function MessageBubble({ item }: { item: Message }) {
  const isUser = item.role === 'user';
  return (
    <View style={[styles.row, isUser ? styles.rowRight : styles.rowLeft]}>
      {!isUser && <View style={styles.avatar}><Text style={styles.avatarText}>AI</Text></View>}
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.aiBubble]}>
        <Text style={[styles.bubbleText, isUser ? styles.userText : styles.aiText]}>
          {item.text}
          {item.streaming && <Text style={styles.cursor}> ▊</Text>}
        </Text>
      </View>
      {isUser && <View style={[styles.avatar, styles.userAvatar]}><Text style={styles.avatarText}>You</Text></View>}
    </View>
  );
}

export default function ChatScreen() {
  const { context } = useModelContext();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const listRef = useRef<FlatList>(null);
  const isStreamingRef = useRef(false);
  const assistantIdRef = useRef<string | null>(null);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isStreamingRef.current || !context) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text };
    const assistantId = (Date.now() + 1).toString();
    const assistantMsg: Message = { id: assistantId, role: 'assistant', text: '', streaming: true };

    assistantIdRef.current = assistantId;
    isStreamingRef.current = true;

    setMessages(prev => [...prev, userMsg, assistantMsg]);
    setInput('');
    setIsStreaming(true);

    let accumulated = '';

    try {
      await context.completion(
        {
          messages: [
            { role: 'system', content: 'You are a helpful AI assistant running on-device.' },
            ...messages.map(m => ({ role: m.role, content: m.text })),
            { role: 'user', content: text },
          ],
          n_predict: 512,
          temperature: 0.7,
          stop: ['</s>', '<|end|>', '<|eot_id|>'],
        },
        (data) => {
          if (isStreamingRef.current) {
            accumulated += data.token;
            setMessages(prev =>
              prev.map(m => m.id === assistantId ? { ...m, text: accumulated } : m)
            );
          }
        }
      );
    } catch (e) {
      if (isStreamingRef.current) {
        setMessages(prev =>
          prev.map(m => m.id === assistantId
            ? { ...m, text: 'Something went wrong. Please try again.', streaming: false }
            : m
          )
        );
      }
    } finally {
      isStreamingRef.current = false;
      assistantIdRef.current = null;
      setIsStreaming(false);
      setMessages(prev =>
        prev.map(m => m.id === assistantId ? { ...m, streaming: false } : m)
      );
    }
  }, [input, context, messages]);

  const cancelStream = useCallback(() => {
    if (context && isStreamingRef.current) {
      context.stopCompletion();
    }
    isStreamingRef.current = false;
    const aid = assistantIdRef.current;
    assistantIdRef.current = null;
    setIsStreaming(false);
    if (aid) {
      setMessages(prev =>
        prev.map(m => m.id === aid ? { ...m, streaming: false } : m)
      );
    }
  }, [context]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <View style={styles.headerDot} />
        <Text style={styles.headerTitle}>AI Chat</Text>
        <Text style={styles.headerSub}>Llama 3.2 · On-device</Text>
      </View>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={m => m.id}
          renderItem={({ item }) => <MessageBubble item={item} />}
          contentContainerStyle={styles.list}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>💬</Text>
              <Text style={styles.emptyTitle}>Start chatting</Text>
              <Text style={styles.emptyText}>Your AI runs fully on this device.</Text>
            </View>
          }
        />
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Ask anything..."
            placeholderTextColor="#4A4A6A"
            multiline
            editable={!isStreaming}
          />
          {isStreaming ? (
            <TouchableOpacity style={styles.stopBtn} onPress={cancelStream}>
              <Text style={styles.btnIcon}>⏹</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.sendBtn, !input.trim() && styles.btnDisabled]}
              onPress={sendMessage}
              disabled={!input.trim()}
            >
              <Text style={styles.btnIcon}>↑</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0A0A14' },
  flex: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#1A1A2E', backgroundColor: '#0A0A14', gap: 8 },
  headerDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4ADE80' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#FFFFFF', flex: 1 },
  headerSub: { fontSize: 12, color: '#555577' },
  list: { padding: 16, paddingBottom: 12, flexGrow: 1 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 100, gap: 8 },
  emptyIcon: { fontSize: 40, marginBottom: 8 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#CCCCDD' },
  emptyText: { fontSize: 13, color: '#555577', textAlign: 'center' },
  row: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 14, gap: 8 },
  rowLeft: { justifyContent: 'flex-start' },
  rowRight: { justifyContent: 'flex-end' },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#1E1E3A', justifyContent: 'center', alignItems: 'center' },
  userAvatar: { backgroundColor: '#6C63FF33' },
  avatarText: { fontSize: 9, fontWeight: '700', color: '#8888BB' },
  bubble: { maxWidth: '75%', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 10 },
  userBubble: { backgroundColor: '#6C63FF', borderBottomRightRadius: 5 },
  aiBubble: { backgroundColor: '#16162A', borderBottomLeftRadius: 5, borderWidth: 1, borderColor: '#2A2A45' },
  bubbleText: { fontSize: 15, lineHeight: 23 },
  userText: { color: '#FFFFFF' },
  aiText: { color: '#D0D0E8' },
  cursor: { color: '#6C63FF', fontSize: 14 },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 12, paddingVertical: 10, paddingBottom: Platform.OS === 'ios' ? 24 : 12, borderTopWidth: 1, borderTopColor: '#1A1A2E', backgroundColor: '#0A0A14', gap: 8 },
  input: { flex: 1, backgroundColor: '#16162A', color: '#FFFFFF', borderRadius: 24, paddingHorizontal: 18, paddingVertical: 11, fontSize: 15, maxHeight: 120, borderWidth: 1, borderColor: '#2A2A45', lineHeight: 20 },
  sendBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#6C63FF', justifyContent: 'center', alignItems: 'center' },
  stopBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FF6B6B22', borderWidth: 1, borderColor: '#FF6B6B', justifyContent: 'center', alignItems: 'center' },
  btnDisabled: { backgroundColor: '#1E1E3A' },
  btnIcon: { color: '#FFF', fontSize: 18, fontWeight: '700' },
});