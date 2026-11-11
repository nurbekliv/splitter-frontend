import React from 'react';
import { Pressable } from 'react-native';
import { XStack, Text } from 'tamagui';
import { LANGUAGE_OPTIONS } from '@/shared/config/languages';
import { useAppStore } from '@/shared/lib/stores/app-store';

/** Compact EN | JA | UZ switch shown in the header of every screen. */
export default function HeaderLanguageSwitch() {
  const language = useAppStore((s) => s.language);
  const setLanguage = useAppStore((s) => s.setLanguage);

  return (
    <XStack bg="$gray3" br={999} p={2} gap={2}>
      {LANGUAGE_OPTIONS.map((option) => {
        const active = option.code === language;
        return (
          <Pressable
            key={option.code}
            onPress={() => setLanguage(option.code)}
            accessibilityRole="button"
            accessibilityLabel={option.shortLabel}
          >
            <XStack px={8} py={3} br={999} bg={active ? '#2ECC71' : 'transparent'}>
              <Text fontSize={11} fontWeight="700" color={active ? 'white' : '$gray10'}>
                {option.shortLabel}
              </Text>
            </XStack>
          </Pressable>
        );
      })}
    </XStack>
  );
}
