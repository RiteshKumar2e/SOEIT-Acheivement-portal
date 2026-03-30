import React from 'react';
import { View, StyleSheet, SafeAreaView, Text } from 'react-native';
import { COLORS } from '../../constants/colors';
import { SPACING } from '../../utils/responsive';

/**
 * Container - Main content wrapper with safe padding
 */
export const Container = ({ children, style, paddingHorizontal = 20, paddingVertical = 16 }) => (
  <View
    style={[
      styles.container,
      {
        paddingHorizontal,
        paddingVertical,
      },
      style,
    ]}
  >
    {children}
  </View>
);

/**
 * SafeContainer - Uses SafeAreaView for proper edge handling
 */
export const SafeContainer = ({ children, style, horizontal = true, vertical = true }) => (
  <SafeAreaView
    style={[
      styles.safeContainer,
      {
        edges: [
          horizontal && 'left',
          horizontal && 'right',
          vertical && 'top',
          vertical && 'bottom',
        ].filter(Boolean),
      },
      style,
    ]}
  >
    {children}
  </SafeAreaView>
);

/**
 * Spacer - Adds vertical spacing with accessibility considerations
 */
export const Spacer = ({ height = SPACING.lg, accessible = true, accessibilityRole = 'none' }) => (
  <View
    style={{ height }}
    accessible={accessible}
    accessibilityRole={accessibilityRole}
  />
);

/**
 * HStack - Horizontal flex row with consistent spacing
 */
export const HStack = ({
  children,
  spacing = SPACING.md,
  align = 'center',
  justify = 'flex-start',
  style,
  ...props
}) => (
  <View
    style={[
      styles.hstack,
      {
        space: spacing,
        alignItems: align,
        justifyContent: justify,
        gap: spacing,
      },
      style,
    ]}
    {...props}
  >
    {children}
  </View>
);

/**
 * VStack - Vertical flex column with consistent spacing
 */
export const VStack = ({
  children,
  spacing = SPACING.md,
  align = 'stretch',
  justify = 'flex-start',
  style,
  ...props
}) => (
  <View
    style={[
      styles.vstack,
      {
        space: spacing,
        alignItems: align,
        justifyContent: justify,
        gap: spacing,
      },
      style,
    ]}
    {...props}
  >
    {children}
  </View>
);

/**
 * Screen wrapper with ScrollView considerations
 */
export const ScreenContainer = ({ children, style, contentContainerStyle }) => (
  <View
    style={[
      styles.screenContainer,
      style,
    ]}
  >
    {children}
  </View>
);

/**
 * Card component with consistent styling
 */
export const Card = ({
  children,
  style,
  padding = SPACING.lg,
  onPress,
  accessible = true,
}) => (
  <View
    style={[
      styles.card,
      { padding },
      onPress && styles.cardTouchable,
      style,
    ]}
    accessible={accessible}
  >
    {children}
  </View>
);

/**
 * ButtonGroup - Horizontal button container with proper spacing
 */
export const ButtonGroup = ({
  children,
  direction = 'column',
  spacing = SPACING.md,
  style,
  accessibilityRole = 'group',
}) => (
  <View
    style={[
      {
        flexDirection: direction === 'row' ? 'row' : 'column',
        gap: spacing,
      },
      style,
    ]}
    accessible
    accessibilityRole={accessibilityRole}
    accessibilityLabel="Button group"
  >
    {children}
  </View>
);

/**
 * Section - Grouped content section with title
 */
export const Section = ({
  title,
  children,
  style,
  spacing = SPACING.md,
  transparent = false,
}) => (
  <View
    style={[
      !transparent && styles.sectionContainer,
      { marginBottom: SPACING.lg },
      style,
    ]}
  >
    {title && (
      <SectionTitle>{title}</SectionTitle>
    )}
    <View style={{ gap: spacing }}>
      {children}
    </View>
  </View>
);

/**
 * SectionTitle - Styled section header
 */
export const SectionTitle = ({ children, style }) => (
  <View
    style={{ marginBottom: SPACING.md }}
    accessible
    accessibilityRole="header"
  >
    {typeof children === 'string' ? (
      <Text style={[styles.sectionTitle, style]}>{children}</Text>
    ) : (
      children
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  safeContainer: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.bgPrimary,
  },
  hstack: {
    flexDirection: 'row',
  },
  vstack: {
    flexDirection: 'column',
  },
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTouchable: {
    opacity: 0.9,
  },
  sectionContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
});

export default {
  Container,
  SafeContainer,
  Spacer,
  HStack,
  VStack,
  ScreenContainer,
  Card,
  ButtonGroup,
  Section,
  SectionTitle,
};
