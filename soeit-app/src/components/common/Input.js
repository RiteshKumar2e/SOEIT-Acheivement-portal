import React, { useState } from 'react';
import { StyleSheet, View, TextInput, Text, Animated, Easing } from 'react-native';
import { COLORS } from '../../constants/colors';
import { INPUT_HEIGHT, getResponsiveFontSize, SPACING } from '../../utils/responsive';

const Input = ({
  label,
  error,
  secureTextEntry,
  style,
  inputStyle,
  icon,
  helperText,
  required = false,
  disabled = false,
  accessibilityLabel,
  accessibilityHint,
  testID,
  maxLength,
  characterCount = false,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [focusAnim] = useState(new Animated.Value(0));
  const [value, setValue] = useState(props.value || '');

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(focusAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(focusAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleChangeText = (text) => {
    setValue(text);
    props.onChangeText?.(text);
  };

  const borderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.border, COLORS.primary],
  });

  const backgroundColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.bgInput, 'rgba(79, 70, 229, 0.02)'],
  });

  const finalAccessibilityLabel = accessibilityLabel || label || props.placeholder;

  return (
    <View
      style={[styles.container, style]}
      accessible={false}
    >
      {label && (
        <View style={styles.labelContainer}>
          <Text
            style={[styles.label, disabled && styles.labelDisabled]}
            allowFontScaling
            maxFontSizeMultiplier={1.2}
          >
            {label}
            {required && <Text style={styles.required}> *</Text>}
          </Text>
          {characterCount && maxLength && (
            <Text style={styles.characterCount}>
              {value.length}/{maxLength}
            </Text>
          )}
        </View>
      )}
      <Animated.View
        style={[
          styles.inputContainer,
          { borderColor, backgroundColor },
          error && styles.errorInput,
          disabled && styles.disabledInput,
        ]}
      >
        {icon && <View style={styles.icon}>{icon}</View>}
        <TextInput
          style={[
            styles.input,
            { fontSize: getResponsiveFontSize(16), height: !props.multiline ? INPUT_HEIGHT : undefined },
            disabled && styles.disabledText,
            inputStyle,
          ]}
          placeholderTextColor={COLORS.textMuted}
          onFocus={handleFocus}
          onBlur={handleBlur}
          secureTextEntry={secureTextEntry}
          editable={!disabled}
          accessible
          accessibilityLabel={finalAccessibilityLabel}
          accessibilityHint={accessibilityHint || (required ? 'Required field' : undefined)}
          accessibilityState={{ disabled }}
          testID={testID}
          maxLength={maxLength}
          value={value}
          onChangeText={handleChangeText}
          {...props}
        />
      </Animated.View>
      {error && (
        <Text
          style={styles.errorText}
          accessible
          accessibilityRole="alert"
          allowFontScaling
          maxFontSizeMultiplier={1.2}
        >
          {error}
        </Text>
      )}
      {helperText && !error && (
        <Text
          style={styles.helperText}
          allowFontScaling
          maxFontSizeMultiplier={1.2}
        >
          {helperText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.sm,
  },
  label: {
    color: COLORS.textSecondary,
    fontSize: getResponsiveFontSize(14),
    fontWeight: '600',
  },
  labelDisabled: {
    color: COLORS.textMuted,
  },
  required: {
    color: COLORS.danger,
    fontWeight: '700',
  },
  characterCount: {
    color: COLORS.textMuted,
    fontSize: getResponsiveFontSize(12),
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1.5,
    borderRadius: 12,
    minHeight: INPUT_HEIGHT,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderColor: COLORS.border,
    backgroundColor: COLORS.bgInput,
  },
  input: {
    flex: 1,
    color: COLORS.textPrimary,
    minHeight: INPUT_HEIGHT,
    paddingVertical: SPACING.md,
  },
  icon: {
    marginRight: SPACING.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorInput: {
    borderColor: COLORS.danger,
    backgroundColor: 'rgba(239, 68, 68, 0.02)',
  },
  disabledInput: {
    backgroundColor: COLORS.bgCard,
    opacity: 0.6,
  },
  disabledText: {
    color: COLORS.textMuted,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: getResponsiveFontSize(12),
    marginTop: SPACING.xs,
    marginLeft: SPACING.sm,
    fontWeight: '500',
  },
  helperText: {
    color: COLORS.textMuted,
    fontSize: getResponsiveFontSize(12),
    marginTop: SPACING.xs,
    marginLeft: SPACING.sm,
    fontWeight: '400',
  },
});

export default Input;
