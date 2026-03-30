import { StyleSheet } from 'react-native';
import { SPACING } from '../../constants/spacing';
import { getResponsiveFontSize } from '../../utils/responsive';
import { COLORS } from '../common/globalStyles';

/**
 * Admin Dashboard Styles
 */

export const adminDashboardStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray50,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: getResponsiveFontSize(24),
    fontWeight: '800',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: getResponsiveFontSize(13),
    marginTop: SPACING.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    padding: SPACING.lg,
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  statCard: {
    flex: 1,
    marginHorizontal: SPACING.sm,
  },
  statValue: {
    fontSize: getResponsiveFontSize(20),
    fontWeight: '800',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: getResponsiveFontSize(12),
    color: COLORS.textMuted,
    marginTop: SPACING.sm,
  },
  sectionTitle: {
    fontSize: getResponsiveFontSize(18),
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginHorizontal: SPACING.lg,
    marginVertical: SPACING.lg,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  actionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.lg,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  actionSubtitle: {
    fontSize: getResponsiveFontSize(12),
    color: COLORS.textMuted,
    marginTop: SPACING.sm,
  },
  chevron: {
    marginLeft: SPACING.md,
  },
});

export default adminDashboardStyles;
