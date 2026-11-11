import React from 'react';
import { XStack, Text } from 'tamagui';
import { AlertCircle } from '@tamagui/lucide-icons';

/**
 * Inline error message for forms. Alert.alert() does nothing on web,
 * so server errors were invisible in the browser.
 */
export default function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <XStack
      alignItems="center"
      gap="$2"
      padding="$3"
      borderRadius="$4"
      backgroundColor="#E74C3C1A"
      borderWidth={1}
      borderColor="#E74C3C"
    >
      <AlertCircle size={16} color="#E74C3C" />
      <Text flex={1} fontSize={13} color="#C0392B">
        {message}
      </Text>
    </XStack>
  );
}
