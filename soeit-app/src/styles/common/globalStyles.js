import { StyleSheet } from 'react-native';
import { SPACING } from '../../constants/spacing';
import { getResponsiveFontSize } from '../../utils/responsive';

/**
 * Global Styles - Shared across all screens
 * Contains base styles, colors, and common patterns
 */

export const COLORS = {
  primary: '#002147',        // Deep navy
  primaryLight: '#003366',
  primary900: '#000c1a',
  secondary: '#8b0000',      // Dark red
  success: '#15803d',
  warning: '#b45309',
  error: '#b91c1c',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
  white: '#ffffff',
  textPrimary: '#1a1a1a',
  textSecondary: '#4a4a4a',
  textMuted: '#717171',
};

export const globalStyles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  
  // Typography
  h1: {
    fontSize: getResponsiveFontSize(28),
    fontWeight: '900',
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: getResponsiveFontSize(24),
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: getResponsiveFontSize(20),
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  h4: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  h5: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  body: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  bodySmall: {
    fontSize: getResponsiveFontSize(12),
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  caption: {
    fontSize: getResponsiveFontSize(11),
    fontWeight: '400',
    color: COLORS.textMuted,
  },

  // Button Styles
  buttonPrimary: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  buttonSecondary: {
    backgroundColor: COLORS.gray100,
    paddingVertical: SPACING.lg,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: getResponsiveFontSize(16),
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Card Styles
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },

  // Form Styles
  formGroup: {
    marginBottom: SPACING.lg,
  },
  fieldGroup: {
    marginBottom: SPACING.lg,
  },
  fieldLabel: {
    color: COLORS.gray700,
    fontSize: getResponsiveFontSize(12),
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: SPACING.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.gray200,
    borderRadius: 8,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.gray50,
    minHeight: 52,
    elevation: 0,
  },
  inputText: {
    flex: 1,
    paddingVertical: SPACING.md,
    color: COLORS.gray700,
    fontSize: getResponsiveFontSize(14),
    fontWeight: '500',
  },
  inputFocused: {
    borderColor: COLORS.gray300,
    backgroundColor: COLORS.white,
  },

  // Flex Layouts
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Spacing Utilities
  mt: { marginTop: SPACING.md },
  mb: { marginBottom: SPACING.md },
  mx: { marginHorizontal: SPACING.md },
  my: { marginVertical: SPACING.md },
  p: { padding: SPACING.md },
  px: { paddingHorizontal: SPACING.md },
  py: { paddingVertical: SPACING.md },
});

export default globalStyles;
