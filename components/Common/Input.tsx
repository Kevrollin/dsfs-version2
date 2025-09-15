import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { useColorScheme } from '../../hooks/useColorScheme';
import { getTheme } from '../../constants/themes';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  style?: any;
  error?: string;
}

export default function Input({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 1,
  style,
  error,
}: InputProps) {
  const { colorScheme } = useColorScheme();
  const theme = getTheme(colorScheme);

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={[styles.label, { color: theme.text }]}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          { 
            borderColor: theme.inputBorder,
            backgroundColor: theme.input,
            color: theme.text,
          },
          multiline && styles.multilineInput,
          error && { borderColor: theme.error },
        ]}
        placeholder={placeholder}
        placeholderTextColor={theme.placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        numberOfLines={numberOfLines}
      />
      {error && <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  multilineInput: {
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
});