import React from 'react';
import { StyleSheet, TouchableOpacity, Text, ActivityIndicator, AccessibilityInfo } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/colors';
import { BUTTON_HEIGHT, getResponsiveFontSize, SPACING } from '../../utils/responsive';

const Button = ({
  title,
  onPress,
  loading = false,
  variant = 'primary', // 'primary', 'secondary', 'outline', 'danger'
  size = 'md', // 'sm', 'md', 'lg'
  style,
  textStyle,
  disabled = false,
  width = '100%',
  accessibilityLabel,
  accessibilityHint,
  testID,
  icon: IconComponent,
  fullWidth = true,
}) => {
  const isOutline = variant === 'outline';
  const isSecondary = variant === 'secondary';
  const isDanger = variant === 'danger';

  const getGradientColors = () => {
    if (disabled) return [COLORS.textMuted, COLORS.textMuted];
    if (isSecondary) return COLORS.gradientSecondary;
    if (isDanger) return [COLORS.danger, COLORS.danger];
    return COLORS.gradientPrimary;
  };

  const getBorderColor = () => {
    if (disabled) return COLORS.textMuted;
    if (isSecondary) return COLORS.secondary;
    if (isDanger) return COLORS.danger;
    return COLORS.primary;
  };

  const getButtonHeight = () => {
    switch (size) {
      case 'sm':
        return 44;
      case 'lg':
        return 60;
      default:
        return BUTTON_HEIGHT;
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return getResponsiveFontSize(13);
      case 'lg':
        return getResponsiveFontSize(18);
      default:
        return getResponsiveFontSize(16);
    }
  };

  const content = (
    <>
      {loading ? (
        <ActivityIndicator
          color={isOutline ? COLORS.primary : COLORS.textPrimary}
          size="small"
          accessible
          accessibilityRole="progressbar"
          accessibilityLabel="Loading"
        />
      ) : (
        <Text
          style={[
            styles.text,
            { fontSize: getTextSize() },
            isOutline && { color: COLORS.primary },
            textStyle,
          ]}
          allowFontScaling
          maxFontSizeMultiplier={1.3}
        >
          {title}
        </Text>
      )}
    </>
  );

  if (isOutline) {
    return (
      <TouchableOpacity
        style={[
          styles.button,
          styles.outline,
          {
            borderColor: getBorderColor(),
            height: getButtonHeight(),
            width: fullWidth ? width : 'auto',
          },
          size === 'sm' && styles.btnSm,
          size === 'lg' && styles.btnLg,
          disabled && styles.disabledButton,
          style,
        ]}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={disabled ? 1 : 0.7}
        accessible
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || title}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled: disabled || loading }}
        testID={testID}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={disabled ? 1 : 0.8}
      style={[
        styles.button,
        {
          height: getButtonHeight(),
          width: fullWidth ? width : 'auto',
        },
        size === 'sm' && styles.btnSm,
        size === 'lg' && styles.btnLg,
        disabled && styles.disabledButton,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      accessible
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || loading }}
      testID={testID}
    >
      <LinearGradient
        colors={getGradientColors()}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradient, { borderRadius: size === 'sm' ? 8 : size === 'lg' ? 16 : 12 }]}
      >
        {content}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    flex: 1,
  },
  outline: {
    borderWidth: 1.5,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: '700',
    fontFamily: 'System',
  },
  textSm: { fontSize: 13 },
  textLg: { fontSize: 18 },
  btnSm: { borderRadius: 8 },
  btnLg: { borderRadius: 16 },
  disabledButton: {
    opacity: 0.5,
  },
});

export default Button;
