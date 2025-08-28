import React, { useState, useEffect, useRef } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
  StatusBar,
  Switch,
  Modal,
  Vibration,
} from 'react-native';

const { width, height } = Dimensions.get('window');

// Language translations with fun result variations
const translations = {
  en: {
    title: "Can't Decide?",
    subtitle: "Let us help you choose!",
    decideButton: "DECIDE FOR US!",
    decideAgain: "DECIDE AGAIN",
    settings: "Settings",
    language: "Language",
    sound: "Sound Effects",
    vibration: "Vibration",
    darkMode: "Dark Mode",
    tapHint: "Tap the button to decide!",
    choices2: "2 choices",
    choices3: "3 choices",
    // Fun variations for results
    yesOptions: ["YES!", "Absolutely!", "Go for it!", "Do it!", "YES"],
    noOptions: ["NO", "Nah", "Not today", "Skip it", "NO"],
    dontKnowOptions: ["I DON'T KNOW", "Maybe later?", "Hmm...", "Ask me tomorrow", "¯\\_(ツ)_/¯"],
    choicesDisplay: "Yes • No",
    choicesDisplay3: "Yes • No • I Don't Know",
    languages: {
      en: "English",
      ru: "Русский"
    }
  },
  ru: {
    title: "Не можете решить?",
    subtitle: "Позвольте нам помочь вам выбрать!",
    decideButton: "РЕШИТЕ ЗА НАС!",
    decideAgain: "РЕШИТЬ СНОВА",
    settings: "Настройки",
    language: "Язык",
    sound: "Звуковые эффекты",
    vibration: "Вибрация",
    darkMode: "Темная тема",
    tapHint: "Нажмите кнопку, чтобы решить!",
    choices2: "2 варианта",
    choices3: "3 варианта",
    // Fun variations for Russian
    yesOptions: ["ДА!", "Конечно!", "Давайте!", "Делайте!", "ДА"],
    noOptions: ["НЕТ", "Не-а", "Не сегодня", "Пропустите", "НЕТ"],
    dontKnowOptions: ["НЕ ЗНАЮ", "Может позже?", "Хм...", "Спросите завтра", "¯\\_(ツ)_/¯"],
    choicesDisplay: "Да • Нет",
    choicesDisplay3: "Да • Нет • Не знаю",
    languages: {
      en: "English",
      ru: "Русский"
    }
  }
};

const App = () => {
  const [language, setLanguage] = useState('en');
  const [useThreeChoices, setUseThreeChoices] = useState(true);
  const [result, setResult] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  
  // Animation values
  const buttonScale = useRef(new Animated.Value(1)).current;
  const resultOpacity = useRef(new Animated.Value(0)).current;
  const resultScale = useRef(new Animated.Value(0.5)).current;
  const shakeAnimation = useRef(new Animated.Value(0)).current;
  const backgroundAnimation = useRef(new Animated.Value(0)).current;

  const t = translations[language];

  // ALL FUNCTIONS USING FUNCTION DECLARATIONS (HOISTED)
  function savePreferences() {
    // In a real app, save to AsyncStorage
    console.log('Preferences saved');
  }

  function playSound(type) {
    if (!soundEnabled) return;
    
    // Enhanced haptic feedback
    if (vibrationEnabled) {
      switch (type) {
        case 'yes':
          Vibration.vibrate([50, 30, 50]); // Success pattern
          break;
        case 'no':
          Vibration.vibrate([100, 50, 100]); // Negative pattern
          break;
        default:
          Vibration.vibrate(100); // Default
      }
    }
    
    // Placeholder for actual sound - you'd add react-native-sound here
    console.log(`Playing ${type} sound with enhanced haptics`);
  }

  function triggerVibration() {
    if (vibrationEnabled) {
      Vibration.vibrate(50);
    }
  }

  function getRandomResult() {
    const yesOptions = t.yesOptions;
    const noOptions = t.noOptions;
    const dontKnowOptions = t.dontKnowOptions;
    
    if (useThreeChoices) {
      const allOptions = [...yesOptions, ...noOptions, ...dontKnowOptions];
      return allOptions[Math.floor(Math.random() * allOptions.length)];
    } else {
      const allOptions = [...yesOptions, ...noOptions];
      return allOptions[Math.floor(Math.random() * allOptions.length)];
    }
  }

  function getResultColor() {
    if (!result) return '#2196F3';
    
    // Check if result is a "yes" type
    if (t.yesOptions.some(option => result.includes(option.split('!')[0]) || result.includes('YES') || result.includes('ДА'))) {
      return '#4CAF50';
    }
    // Check if result is a "no" type
    if (t.noOptions.some(option => result.includes(option.split(' ')[0]) || result.includes('NO') || result.includes('НЕТ'))) {
      return '#F44336';
    }
    // Must be "don't know" type
    return '#FF9800';
  }

  function getTheme() {
    if (darkMode) {
      return {
        background: '#121212',
        surface: '#1E1E1E',
        text: '#FFFFFF',
        textSecondary: '#AAAAAA',
        accent: '#BB86FC',
      };
    }
    return {
      background: '#F5F5F5',
      surface: '#FFFFFF',
      text: '#333333',
      textSecondary: '#666666',
      accent: '#2196F3',
    };
  }

  function updateLanguage(newLang) {
    setLanguage(newLang);
    savePreferences();
  }

  function updateDarkMode(value) {
    setDarkMode(value);
    savePreferences();
  }

  function updateSound(value) {
    setSoundEnabled(value);
    savePreferences();
  }

  function updateVibration(value) {
    setVibrationEnabled(value);
    savePreferences();
  }

  function toggleChoices() {
    playSound('toggle');
    setUseThreeChoices(!useThreeChoices);
    savePreferences();
  }

  function makeDecision() {
    if (showResult) return;

    // Button shake animation
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();

    // Button press animation
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.9,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Background pulse animation
    Animated.sequence([
      Animated.timing(backgroundAnimation, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(backgroundAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();

    // Get random result with fun variations
    const randomChoice = getRandomResult();
    
    setTimeout(() => {
      setResult(randomChoice);
      setShowResult(true);
      playSound(randomChoice.toLowerCase());

      // Result animation with rotation
      Animated.parallel([
        Animated.timing(resultOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(resultScale, {
          toValue: 1,
          tension: 50,
          friction: 4,
          useNativeDriver: true,
        }),
      ]).start();
    }, 800);
  }

  function resetDecision() {
    // Reset current result with quick animation
    Animated.timing(resultScale, {
      toValue: 0.8,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      // Get new random result with variations
      const randomChoice = getRandomResult();
      
      setResult(randomChoice);
      playSound(randomChoice.toLowerCase());

      // Animate new result
      Animated.spring(resultScale, {
        toValue: 1,
        tension: 50,
        friction: 4,
        useNativeDriver: true,
      }).start();
    });
  }

  // Load saved preferences
  useEffect(() => {
    // In a real app, you'd load from AsyncStorage here
    // For now, we'll just use the defaults
    const loadPreferences = () => {
      // Simulated loading - in real app use AsyncStorage
      console.log('Preferences loaded');
    };
    loadPreferences();
  }, []);

  // Language selection modal on first launch
  useEffect(() => {
    if (isFirstLaunch) {
      setTimeout(() => setShowSettings(true), 1000);
    }
  }, [isFirstLaunch]);

  const theme = getTheme();

  const backgroundColorInterpolated = backgroundAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [theme.background, getResultColor() + '20'],
  });

  return (
    <Animated.View style={[styles.container, { backgroundColor: backgroundColorInterpolated }]}>
      <StatusBar
        barStyle={darkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      
      <SafeAreaView style={styles.safeArea}>
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={[styles.settingsButton, { backgroundColor: theme.surface }]}
            onPress={() => setShowSettings(true)}
          >
            <Text style={[styles.settingsText, { color: theme.text }]}>⚙️</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.toggleButton, { backgroundColor: useThreeChoices ? '#4CAF50' : theme.accent }]}
            onPress={toggleChoices}
          >
            <Text style={styles.toggleText}>
              {useThreeChoices ? t.choices3 : t.choices2}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <Text style={[styles.title, { color: theme.text }]}>{t.title}</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>{t.subtitle}</Text>
          
          {!showResult && (
            <Text style={[styles.shakeHint, { color: theme.textSecondary }]}>
              {t.tapHint}
            </Text>
          )}

          {/* Decision Button */}
          {!showResult && (
            <Animated.View style={{
              transform: [
                { scale: buttonScale },
                { translateX: shakeAnimation }
              ]
            }}>
              <TouchableOpacity
                style={[styles.decisionButton, { backgroundColor: theme.accent }]}
                onPress={makeDecision}
                activeOpacity={0.8}
              >
                <Text style={styles.decisionButtonText}>{t.decideButton}</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Result */}
          {showResult && (
            <Animated.View
              style={[
                styles.resultContainer,
                {
                  opacity: resultOpacity,
                  transform: [{ scale: resultScale }],
                  backgroundColor: getResultColor(),
                }
              ]}
            >
              <Text style={styles.resultText}>{result}</Text>
            </Animated.View>
          )}

          {/* Reset Button */}
          {showResult && (
            <TouchableOpacity
              style={[styles.resetButton, { borderColor: theme.accent }]}
              onPress={resetDecision}
            >
              <Text style={[styles.resetButtonText, { color: theme.accent }]}>{t.decideAgain}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            {t.choices} {useThreeChoices ? t.choicesDisplay3 : t.choicesDisplay}
          </Text>
        </View>
      </SafeAreaView>

      {/* Settings Modal */}
      <Modal
        visible={showSettings}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {
          setShowSettings(false);
          if (isFirstLaunch) setIsFirstLaunch(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>{t.settings}</Text>
            
            {/* Language Selection */}
            <View style={styles.settingItem}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>{t.language}</Text>
              <View style={styles.languageButtons}>
                <TouchableOpacity
                  style={[
                    styles.languageButton,
                    language === 'en' && { backgroundColor: theme.accent },
                    { borderColor: theme.accent }
                  ]}
                  onPress={() => updateLanguage('en')}
                >
                  <Text style={[
                    styles.languageButtonText,
                    { color: language === 'en' ? 'white' : theme.text }
                  ]}>
                    {t.languages.en}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.languageButton,
                    language === 'ru' && { backgroundColor: theme.accent },
                    { borderColor: theme.accent }
                  ]}
                  onPress={() => updateLanguage('ru')}
                >
                  <Text style={[
                    styles.languageButtonText,
                    { color: language === 'ru' ? 'white' : theme.text }
                  ]}>
                    {t.languages.ru}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Settings Switches */}
            <View style={styles.settingItem}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>{t.sound}</Text>
              <Switch value={soundEnabled} onValueChange={updateSound} />
            </View>

            <View style={styles.settingItem}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>{t.vibration}</Text>
              <Switch value={vibrationEnabled} onValueChange={updateVibration} />
            </View>

            <View style={styles.settingItem}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>{t.darkMode}</Text>
              <Switch value={darkMode} onValueChange={updateDarkMode} />
            </View>

            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: theme.accent }]}
              onPress={() => {
                setShowSettings(false);
                if (isFirstLaunch) setIsFirstLaunch(false);
              }}
            >
              <Text style={styles.closeButtonText}>✓</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  settingsText: {
    fontSize: 18,
  },
  toggleButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  toggleText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  shakeHint: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 40,
    textAlign: 'center',
  },
  decisionButton: {
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 50,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    minWidth: width * 0.7,
  },
  decisionButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resultContainer: {
    paddingHorizontal: 40,
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    minWidth: width * 0.7,
    marginBottom: 30,
  },
  resultText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resetButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  resetButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width * 0.85,
    padding: 30,
    borderRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 18,
    flex: 1,
  },
  languageButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  languageButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    borderWidth: 1,
  },
  languageButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  closeButton: {
    alignSelf: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default App;
