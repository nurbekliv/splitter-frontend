import React from 'react';
import { XStack, YStack, Text } from 'tamagui';
import { Check, Circle } from '@tamagui/lucide-icons';
import { useTranslation } from 'react-i18next';
import { PASSWORD_RULES } from '../model/password-policy';

/** Live checklist under the password field: each rule turns green when met. */
export default function PasswordRules({ value }: { value: string }) {
  const { t } = useTranslation();
  return (
    <YStack gap="$1" marginTop="$2">
      {PASSWORD_RULES.map((rule) => {
        const ok = rule.test(value);
        return (
          <XStack key={rule.key} alignItems="center" gap="$2">
            {ok ? <Check size={14} color="#2ECC71" /> : <Circle size={10} color="$gray8" />}
            <Text fontSize={12} color={ok ? '#2ECC71' : '$gray10'}>
              {t(`auth.passwordRules.${rule.key}`)}
            </Text>
          </XStack>
        );
      })}
    </YStack>
  );
}
