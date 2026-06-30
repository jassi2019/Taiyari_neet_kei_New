import { Header } from '@/components/Header/Header';
import { TTopic } from '@/types/Topic';
import React, { useEffect, useState } from 'react';
import { StatusBar, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { WebView } from 'react-native-webview';

const LOADING_TIPS = [
  '📚 Getting your content ready...',
  '✨ Almost there, preparing your study material...',
  '🎯 Loading detailed explanations...',
  '📖 Fetching the latest content...',
  '💡 Pro tip: Take notes while reading!',
  '🧠 Quality content takes a moment to load...',
];

const LoadingDot = ({ delay }: { delay: number }) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 400, easing: Easing.ease }),
          withTiming(0.3, { duration: 400, easing: Easing.ease })
        ),
        -1,
        false
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={animatedStyle}
      className="w-3 h-3 mx-1 rounded-full bg-amber-400"
    />
  );
};

const AnimatedLoadingIndicator = () => {
  const [tipIndex, setTipIndex] = useState(0);
  const tipOpacity = useSharedValue(1);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1000, easing: Easing.ease }),
        withTiming(1, { duration: 1000, easing: Easing.ease })
      ),
      -1,
      false
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      tipOpacity.value = withSequence(
        withTiming(0, { duration: 300 }),
        withTiming(1, { duration: 300 })
      );
      setTimeout(() => {
        setTipIndex((prev) => (prev + 1) % LOADING_TIPS.length);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const tipAnimatedStyle = useAnimatedStyle(() => ({
    opacity: tipOpacity.value,
  }));

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  return (
    <View className="absolute inset-0 flex items-center justify-center bg-white px-6">
      <Animated.View
        style={pulseAnimatedStyle}
        className="w-20 h-20 rounded-full bg-amber-100 items-center justify-center mb-6"
      >
        <View className="w-14 h-14 rounded-full bg-amber-200 items-center justify-center">
          <Text className="text-3xl">📚</Text>
        </View>
      </Animated.View>

      <View className="flex-row items-center mb-4">
        <LoadingDot delay={0} />
        <LoadingDot delay={200} />
        <LoadingDot delay={400} />
      </View>

      <Animated.Text
        style={tipAnimatedStyle}
        className="text-center text-lg font-semibold text-gray-800 mb-3 min-h-[28px]"
      >
        {LOADING_TIPS[tipIndex]}
      </Animated.Text>

      <View className="bg-gray-100 rounded-lg px-4 py-3 mt-2">
        <Text className="text-center text-sm text-gray-600">
          Please wait while we load your content.
        </Text>
        <Text className="text-center text-xs text-gray-500 mt-1">
          This may take 1-2 minutes.
        </Text>
      </View>
    </View>
  );
};

// ===== CONTENT PROTECTION: copy/select/screenshot disabled + Canva branding removed =====
const CONTENT_PROTECTION_JS = `
(function () {
  try {
    // 1. DISABLE ALL COPY / SELECT / TEXT INTERACTION

    // CSS: disable text selection everywhere
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = '* { user-select: none !important; -webkit-user-select: none !important; -moz-user-select: none !important; -ms-user-select: none !important; -webkit-touch-callout: none !important; -webkit-tap-highlight-color: transparent !important; } img { pointer-events: none !important; -webkit-user-drag: none !important; } @media print { body { display: none !important; } html { display: none !important; } } ::selection { background: transparent !important; color: inherit !important; } ::-moz-selection { background: transparent !important; color: inherit !important; }';
    document.documentElement.appendChild(style);

    // JS: block copy, cut, right-click context menu
    document.addEventListener('copy', function(e) { e.preventDefault(); }, { capture: true });
    document.addEventListener('cut', function(e) { e.preventDefault(); }, { capture: true });
    document.addEventListener('contextmenu', function(e) { e.preventDefault(); }, { capture: true });

    // JS: block paste, drag, select, print events
    ['paste','dragstart','selectstart','beforeprint','beforecopy','beforecut'].forEach(function(evt) {
      document.addEventListener(evt, function(e) { e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); return false; }, { capture: true });
    });

    // JS: disable keyboard shortcuts Ctrl+C, Ctrl+A, Ctrl+X, Ctrl+U
    document.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && ['c','a','x','u'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
    }, { capture: true });

    // Override clipboard API
    if (navigator.clipboard) {
      Object.defineProperty(navigator, 'clipboard', { get: function() { return { writeText: function() { return Promise.reject(); }, readText: function() { return Promise.reject(); }, write: function() { return Promise.reject(); }, read: function() { return Promise.reject(); } }; } });
    }

    // Override document.execCommand
    document.execCommand = function() { return false; };

    // Block long press
    document.addEventListener('touchstart', function(e) {
      if (e.target) { e.target.style.webkitUserSelect = 'none'; e.target.style.userSelect = 'none'; e.target.style.webkitTouchCallout = 'none'; }
    }, { capture: true, passive: false });

    // Aggressively clear text selection
    document.addEventListener('selectionchange', function() {
      try { window.getSelection().removeAllRanges(); } catch(x) {}
    });
    setInterval(function() {
      try { window.getSelection().removeAllRanges(); } catch(x) {}
    }, 100);

    // Disable pinch zoom
    document.addEventListener('touchstart', function(e) { if (e.touches.length > 1) e.preventDefault(); }, { passive: false, capture: true });
    document.addEventListener('touchmove', function(e) { if (e.touches.length > 1) e.preventDefault(); }, { passive: false, capture: true });
    var lastTap = 0;
    document.addEventListener('touchend', function(e) { var now = Date.now(); if (now - lastTap < 300) e.preventDefault(); lastTap = now; }, { passive: false, capture: true });

    // Set viewport to disable zoom
    var meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
    document.getElementsByTagName('head')[0].appendChild(meta);
    var existing = document.querySelectorAll('meta[name="viewport"]');
    for (var i = 0; i < existing.length; i++) { if (existing[i] !== meta) existing[i].parentNode.removeChild(existing[i]); }

    // 2. REMOVE CANVA WATERMARK / LOGO / BRANDING

    // CSS: hide all Canva-related elements
    var canvaCSS = document.createElement('style');
    canvaCSS.type = 'text/css';
    canvaCSS.innerHTML = '[class*="canva"] { display: none !important; } [id*="canva"] { display: none !important; } [data-testid*="canva"] { display: none !important; } .__canva-embed-watermark { display: none !important; } .canva-watermark { display: none !important; } a[href*="canva.com"] { display: none !important; } div[class*="watermark"] { display: none !important; } div[class*="logo"][class*="canva"] { display: none !important; } [class*="branding"] { display: none !important; } [class*="Branding"] { display: none !important; } [aria-label*="Canva"] { display: none !important; } [class*="overflow-menu"] { display: none !important; } [class*="kebab"] { display: none !important; } [aria-label="More options"] { display: none !important; } [aria-label="More"] { display: none !important; } [class*="toolbar"] { display: none !important; } [class*="Toolbar"] { display: none !important; } header { display: none !important; } footer { display: none !important; } [aria-label*="fullscreen"] { display: none !important; } button[class*="fullscreen"] { display: none !important; }';
    document.documentElement.appendChild(canvaCSS);

    // JS: repeatedly scan and remove Canva branding + "Create with Canva" text
    setInterval(function() {
      try {
        document.querySelectorAll('*').forEach(function(el) {
          if (el.childElementCount === 0 && el.innerText && (el.innerText.includes('Create with Canva') || el.innerText.includes('Created with Canva') || el.innerText.includes('Made with Canva'))) {
            el.style.display = 'none';
          }
        });
        var selectors = [
          '[class*="canva"]','[id*="canva"]','[data-testid*="canva"]',
          '.__canva-embed-watermark','.canva-watermark',
          'a[href*="canva.com"]','div[class*="watermark"]',
          '[class*="branding"]','[class*="Branding"]',
          '[aria-label*="Canva"]','[class*="kebab"]',
          '[aria-label="More options"]','[aria-label="More"]',
          'header','footer',
          '[class*="toolbar"]','[class*="Toolbar"]',
          '[aria-label*="fullscreen"]','button[class*="fullscreen"]',
        ];
        var els = document.querySelectorAll(selectors.join(','));
        els.forEach(function(el) { el.style.display = 'none'; el.style.visibility = 'hidden'; el.style.height = '0'; el.style.overflow = 'hidden'; });
      } catch(x) {}
    }, 500);

    // Remove header/footer on initial load too
    var h = document.querySelector('header'); if (h) h.remove();
    var f = document.querySelector('footer'); if (f) f.remove();
  } catch (e) {}
  true;
})();`;

type TopicContentProps = {
  navigation: any;
  route: {
    params: {
      topic: TTopic;
    };
  };
};

export const TopicContent = ({ navigation, route }: TopicContentProps) => {
  const { topic } = route.params;

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: StatusBar.currentHeight }}>
      <Header title={topic.name} onBack={() => navigation.goBack()} />

      <WebView
        source={{
          uri: topic.contentURL,
        }}
        className="flex-1"
        javaScriptEnabled={true}
        domStorageEnabled={true}
        scalesPageToFit={false}
        textZoom={100}
        setSupportMultipleWindows={false}
        allowsLinkPreview={false}
        textInteractionEnabled={false}
        injectedJavaScriptBeforeContentLoaded={CONTENT_PROTECTION_JS}
        injectedJavaScript={CONTENT_PROTECTION_JS}
        renderLoading={() => <AnimatedLoadingIndicator />}
        startInLoadingState={true}
      />
    </View>
  );
};

export default TopicContent;
