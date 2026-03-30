import { Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Responsive values based on screen width
export const RESPONSIVE = {
  width: SCREEN_WIDTH,
  height: SCREEN_HEIGHT,
  isSmallDevice: SCREEN_WIDTH < 375,
  isMediumDevice: SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 768,
  isLargeDevice: SCREEN_WIDTH >= 768,
};

// Responsive spacing - scales based on device size
export const getResponsiveSpacing = (baseValue) => {
  if (RESPONSIVE.isSmallDevice) return baseValue * 0.85;
  if (RESPONSIVE.isLargeDevice) return baseValue * 1.2;
  return baseValue;
};

// Responsive font sizes
export const getResponsiveFontSize = (baseSize) => {
  if (RESPONSIVE.isSmallDevice) return baseSize * 0.9;
  if (RESPONSIVE.isLargeDevice) return baseSize * 1.1;
  return baseSize;
};

// Responsive padding
export const responsivePadding = (horizontal = 20, vertical = 16) => ({
  paddingHorizontal: getResponsiveSpacing(horizontal),
  paddingVertical: getResponsiveSpacing(vertical),
});

// Responsive margins
export const responsiveMargin = (horizontal = 0, vertical = 0) => ({
  marginHorizontal: getResponsiveSpacing(horizontal),
  marginVertical: getResponsiveSpacing(vertical),
});

// Safe area padding (bottom navigation consideration)
export const SAFE_BOTTOM_PADDING = Platform.OS === 'android' ? 20 : 40;

// Get percentage width
export const percentWidth = (percentage) => (SCREEN_WIDTH * percentage) / 100;

// Get percentage height
export const percentHeight = (percentage) => (SCREEN_HEIGHT * percentage) / 100;

// Standard button height that works on all devices
export const BUTTON_HEIGHT = getResponsiveFontSize(56);

// Standard input height
export const INPUT_HEIGHT = getResponsiveFontSize(56);

// Border radius values
export const BORDER_RADIUS = {
  small: 8,
  medium: 12,
  large: 16,
  xl: 24,
  xxl: 32,
};

// Standard margins and padding
export const SPACING = {
  xs: getResponsiveSpacing(4),
  sm: getResponsiveSpacing(8),
  md: getResponsiveSpacing(12),
  lg: getResponsiveSpacing(16),
  xl: getResponsiveSpacing(20),
  xxl: getResponsiveSpacing(24),
  xxxl: getResponsiveSpacing(32),
};
