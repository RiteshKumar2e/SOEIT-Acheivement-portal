import { StyleSheet } from 'react-native';
import { SPACING } from '../../constants/spacing';
import { getResponsiveFontSize } from '../../utils/responsive';
import { COLORS } from '../common/globalStyles';

/**
 * Profile Screen Styles (Shared across roles)
 */

export const profileScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray50,
  },
  headerCard: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: SPACING.lg,
    backgroundColor: COLORS.gray300,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    color: COLORS.white,
    fontSize: getResponsiveFontSize(20),
    fontWeight: '800',
  },
  userEmail: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: getResponsiveFontSize(13),
    marginTop: SPACING.sm,
  },
  userRole: {
    color: COLORS.white,
    fontSize: getResponsiveFontSize(12),
    marginTop: SPACING.sm,
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  sectionTitle: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  cardRowLabel: {
    fontSize: getResponsiveFontSize(13),
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  cardRowValue: {
    fontSize: getResponsiveFontSize(14),
    color: COLORS.textPrimary,
    fontWeight: '600',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.lg,
  },
  button: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    paddingVertical: SPACING.lg,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: getResponsiveFontSize(13),
    fontWeight: '700',
  },
  logoutButton: {
    backgroundColor: COLORS.error,
  },
});

/**
 * Events Page Styles
 */

export const eventsPageStyles = StyleSheet.create({
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
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  filterButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    backgroundColor: COLORS.gray100,
    marginRight: SPACING.sm,
  },
  filterButtonActive: {
    backgroundColor: COLORS.secondary,
  },
  filterText: {
    fontSize: getResponsiveFontSize(12),
    fontWeight: '600',
    color: COLORS.gray600,
  },
  filterTextActive: {
    color: COLORS.white,
  },
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  eventCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  eventBanner: {
    width: '100%',
    height: 160,
    backgroundColor: COLORS.gray200,
  },
  eventContent: {
    padding: SPACING.lg,
  },
  eventTitle: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  eventMeta: {
    flexDirection: 'row',
    marginTop: SPACING.md,
    gap: SPACING.lg,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: getResponsiveFontSize(12),
    color: COLORS.textMuted,
    marginLeft: SPACING.sm,
  },
  eventDate: {
    fontSize: getResponsiveFontSize(12),
    color: COLORS.secondary,
    marginTop: SPACING.sm,
    fontWeight: '600',
  },
});

/**
 * Broadcast Notice Styles
 */

export const broadcastNoticeStyles = StyleSheet.create({
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
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
  },
  noticeCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.secondary,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  noticeTitle: {
    fontSize: getResponsiveFontSize(16),
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  noticeCategory: {
    fontSize: getResponsiveFontSize(12),
    color: COLORS.secondary,
    fontWeight: '600',
    marginTop: SPACING.sm,
  },
  noticeDescription: {
    fontSize: getResponsiveFontSize(13),
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
    lineHeight: 20,
  },
  noticeDate: {
    fontSize: getResponsiveFontSize(11),
    color: COLORS.textMuted,
    marginTop: SPACING.md,
  },
});

export default profileScreenStyles;
