import { useState, useEffect, useRef } from 'react';
import { initLlama, LlamaContext } from 'llama.rn';
import RNFS from 'react-native-fs';

const MODEL_URL =
  'https://huggingface.co/bartowski/Llama-3.2-1B-Instruct-GGUF/resolve/main/Llama-3.2-1B-Instruct-Q4_K_M.gguf';
const MODEL_FILENAME = 'Llama-3.2-1B-Instruct-Q4_K_M.gguf';

export type ModelStatus = 'idle' | 'downloading' | 'loading' | 'ready' | 'error';

export function useModel() {
  const [status, setStatus] = useState<ModelStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const contextRef = useRef<LlamaContext | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        const modelPath = `${RNFS.DocumentDirectoryPath}/${MODEL_FILENAME}`;
        const fileExists = await RNFS.exists(modelPath);

        if (!fileExists) {
          setStatus('downloading');
          await RNFS.downloadFile({
            fromUrl: MODEL_URL,
            toFile: modelPath,
            progress: (res) => {
              if (!cancelled) {
                setProgress(res.bytesWritten / res.contentLength);
              }
            },
            progressDivider: 1,
          }).promise;
        }

        if (cancelled) return;
        setStatus('loading');

        const ctx = await initLlama({
          model: modelPath,
          use_mlock: false,
          n_ctx: 2048,
          n_threads: 4,
        });

        contextRef.current = ctx;
        if (!cancelled) setStatus('ready');
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load model');
          setStatus('error');
        }
      }
    }

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  return { status, progress, error, context: contextRef.current };
}
