import { StyleSheet } from 'react-native';
import { SPACING } from '../../constants/spacing';
import { getResponsiveFontSize } from '../../utils/responsive';
import { COLORS } from '../common/globalStyles';

/**
 * RegisterScreen Styles
 * Organized for cleaner component code
 */

export const registerScreenStyles = StyleSheet.create({
  // Container & Layout
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingTop: SPACING.sm,
  },

  // Header Section
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: SPACING.xl,
    gap: SPACING.md,
  },
  backButtonText: {
    color: '#455a64',
    fontSize: getResponsiveFontSize(13),
    fontWeight: '600',
  },
  headerSection: {
    marginBottom: SPACING.xl,
    alignItems: 'center',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.md,
    width: '100%',
    marginBottom: SPACING.xl,
  },
  logoCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    color: COLORS.white,
    fontSize: getResponsiveFontSize(16),
    fontWeight: 'bold',
  },
  universityInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  universityName: {
    color: COLORS.secondary,
    fontSize: getResponsiveFontSize(12),
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  divider: {
    width: 2,
    height: 20,
    backgroundColor: COLORS.secondary,
  },
  universityLocation: {
    color: '#90a4ae',
    fontSize: getResponsiveFontSize(10),
    marginTop: 2,
  },
  naacBadge: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 50,
  },
  naacText: {
    color: COLORS.white,
    fontSize: getResponsiveFontSize(8),
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  naacGrade: {
    color: COLORS.white,
    fontSize: getResponsiveFontSize(10),
    fontWeight: '900',
  },
  pageTitle: {
    fontSize: getResponsiveFontSize(24),
    fontWeight: '800',
    color: '#212121',
    marginTop: SPACING.md,
  },

  // Form Card
  formCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: SPACING.xl + SPACING.lg,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    borderWidth: 0.8,
    borderColor: '#f3f4f6',
  },

  // Tab Navigation
  tabContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
    backgroundColor: '#f9fafb',
    padding: SPACING.sm,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    borderRadius: 6,
  },
  tabActive: {
    backgroundColor: COLORS.secondary,
  },
  tabText: {
    color: COLORS.gray500,
    fontSize: getResponsiveFontSize(13),
    fontWeight: '600',
  },
  tabTextActive: {
    color: COLORS.white,
  },

  // Form Fields
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
    shadowColor: 'transparent',
  },
  input: {
    flex: 1,
    paddingVertical: SPACING.md,
    color: COLORS.gray700,
    fontSize: getResponsiveFontSize(14),
    fontWeight: '500',
  },
  inputContainerFocused: {
    borderColor: COLORS.gray300,
    borderWidth: 1,
    backgroundColor: COLORS.white,
    elevation: 0,
    shadowColor: 'transparent',
  },

  // Picker
  pickerContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: 0,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.gray200,
    borderRadius: 8,
    backgroundColor: COLORS.gray50,
    minHeight: 52,
    elevation: 0,
  },
  picker: {
    flex: 1,
    color: COLORS.gray700,
    height: 52,
    backgroundColor: 'transparent',
  },
  pickerItem: {
    fontSize: getResponsiveFontSize(14),
    fontWeight: '500',
    color: COLORS.gray700,
  },

  // Layout
  twoColumnRow: {
    flexDirection: 'row',
    gap: SPACING.lg,
    marginBottom: SPACING.lg,
  },

  // Button
  signupBtn: {
    backgroundColor: '#2c3e50',
    paddingVertical: SPACING.lg,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  signupBtnDisabled: {
    opacity: 0.6,
  },
  signupBtnText: {
    color: COLORS.white,
    fontSize: getResponsiveFontSize(14),
    fontWeight: '700',
    letterSpacing: 1,
  },

  // Login Link
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    color: '#78909c',
    fontSize: getResponsiveFontSize(12),
  },
  loginLink: {
    color: COLORS.secondary,
    fontSize: getResponsiveFontSize(12),
    fontWeight: '700',
  },
});

export default registerScreenStyles;
