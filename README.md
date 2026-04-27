# AI Chat — On-Device LLM for Android

A fully offline AI chat app for Android built with React Native. All AI inference runs directly on your phone — no internet connection required after the first launch, no server, no cloud, complete privacy.

---

## Screenshots

The app has two screens:
- **Setup Screen** — shown on first launch while downloading and loading the model
- **Chat Screen** — the main chat interface once the model is ready

---

## How It Works

1. On first launch the app downloads the AI model (~700MB) over WiFi
2. The model is saved to the phone's local storage
3. On every subsequent launch the model loads from local storage — no internet needed
4. All AI responses are generated entirely on your device CPU

---

## AI Model

**Model:** Llama 3.2 1B Instruct (Q4_K_M quantization)

| Property | Value |
|---|---|
| Model family | Llama 3.2 by Meta |
| Parameters | 1 Billion |
| Quantization | Q4_K_M (4-bit, medium quality) |
| File size | ~700MB |
| Format | GGUF |
| Source | [HuggingFace — bartowski/Llama-3.2-1B-Instruct-GGUF](https://huggingface.co/bartowski/Llama-3.2-1B-Instruct-GGUF) |

**Why this model?**
- Small enough to run on a phone (1B parameters)
- Instruction-tuned — follows chat instructions well
- Q4_K_M quantization gives a good balance of quality vs file size
- GGUF format is optimized for CPU inference on mobile

---

## Technology Stack

| Layer | Technology |
|---|---|
| Framework | React Native 0.76 |
| Language | TypeScript |
| LLM Runtime | [llama.rn](https://github.com/mybigday/llama.rn) |
| File System | [@dr.pogodin/react-native-fs](https://github.com/birdofpreyru/react-native-fs) |
| JS Engine | Hermes |
| Build System | Gradle 8.10.2 |
| Min Android | API 24 (Android 7.0) |
| Target Android | API 34 (Android 14) |

### llama.rn
The core library that runs the LLM on-device. It wraps [llama.cpp](https://github.com/ggerganov/llama.cpp) — a highly optimized C++ inference engine for running large language models on CPU. It supports:
- Streaming token generation
- Chat completion with system prompts
- Context management
- Stop sequences

---

## Project Structure

```
AIChatApp/
├── App.tsx                          # Root component
├── index.js                         # Entry point
├── src/
│   ├── hooks/
│   │   └── useModel.ts              # Model download, init and state
│   └── screens/
│       ├── SetupScreen.tsx          # Loading/download UI
│       └── ChatScreen.tsx           # Chat interface
├── android/                         # Android native project
│   ├── app/
│   │   ├── build.gradle             # App-level build config
│   │   └── src/main/
│   │       ├── AndroidManifest.xml
│   │       └── java/com/aichatapp2/
│   │           ├── MainActivity.kt
│   │           └── MainApplication.kt
│   ├── build.gradle                 # Project-level build config
│   ├── gradle.properties            # Gradle settings
│   └── settings.gradle
├── package.json
└── README.md
```

---

## Prerequisites

Before building, make sure you have:

- **Node.js** 18 or higher
- **JDK 17** — set `JAVA_HOME` to JDK 17 path
- **Android Studio** with:
  - Android SDK (API 34)
  - NDK 27.1.12297006
  - CMake 3.22.1
- **Android device** or emulator (API 24+)

---

## Build & Run

### Development (USB debug)

**Terminal 1 — Start Metro bundler:**
```bash
npm start
```

**Terminal 2 — Build and install on device:**
```bash
npm run android
```

Make sure USB Debugging is enabled on your phone.

### Release APK

```bash
cd android
./gradlew assembleRelease
```

APK location:
```
android/app/build/outputs/apk/release/app-release.apk
```

Install on phone:
```bash
adb install -r android/app/build/outputs/apk/release/app-release.apk
```

---

## Environment Setup (Windows)

### JAVA_HOME
Set `JAVA_HOME` to JDK 17 in User Environment Variables:
```
JAVA_HOME = C:\Program Files\Java\jdk-17
```

### Gradle JDK (android/gradle.properties)
```properties
org.gradle.java.home=C:\\Program Files\\Java\\jdk-17
```

### Android SDK
Set `ANDROID_HOME`:
```
ANDROID_HOME = C:\Users\<username>\AppData\Local\Android\Sdk
```

Add to PATH:
```
%ANDROID_HOME%\platform-tools
```

---

## Key Configuration

### gradle.properties
```properties
newArchEnabled=false
hermesEnabled=true
reactNativeArchitectures=arm64-v8a,x86_64
```

### Supported Architectures
- `arm64-v8a` — modern Android phones (64-bit ARM)
- `x86_64` — Android emulators

---

## First Launch Flow

```
App opens
    ↓
Check if model file exists on device
    ↓ (first time only)
Download Llama-3.2-1B-Instruct-Q4_K_M.gguf (~700MB)
    ↓
Load model into memory via llama.rn
    ↓
Chat screen appears — fully offline from here
```

---

## Privacy

- No data leaves your device
- No API keys required
- No analytics or telemetry
- Model runs entirely on device CPU
- Chat history is only in memory (cleared on app close)

---

## Troubleshooting

**App crashes on launch**
- Make sure you built with `npm run android` not just installed the APK manually during development
- Check `adb logcat -s AndroidRuntime` for the error

**Metro bundler error**
- Run `npm start` from the project root, not from the `android/` folder

**Build fails with Gradle error**
- Verify `JAVA_HOME` points to JDK 17: `java -version`
- Run `cd android && ./gradlew --stop` then retry

**Model download fails**
- Make sure the phone has internet access on first launch
- The download is ~700MB — use WiFi

---

## License

MIT
