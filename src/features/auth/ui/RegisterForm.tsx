import React, { useMemo, useState } from 'react';
import { useRouter, Link } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { YStack, XStack, Text } from 'tamagui';
import { useTranslation } from 'react-i18next';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { Card } from '@/shared/ui/Card';
import ScreenFormContainer from '@/shared/ui/ScreenFormContainer';
import PasswordInput from '@/shared/ui/PasswordInput';
import FormError from '@/shared/ui/FormError';
import PasswordRules from './PasswordRules';
import { isStrongPassword } from '../model/password-policy';
import { register as registerUser, RegisterRequest, getCurrentUser } from '../api';
import { saveToken } from '@/shared/lib/utils/token-storage';
import { useAppStore } from '@/shared/lib/stores/app-store';
import { User, Mail, Lock } from '@tamagui/lucide-icons';

type FormData = { username: string; email: string; password: string };

export default function RegisterForm() {
  const { t } = useTranslation();
  const schema = useMemo(
    () =>
      z.object({
        username: z.string().min(2, t('auth.usernameMin')),
        email: z.string().email(t('auth.emailInvalid')),
        password: z.string().refine(isStrongPassword, t('auth.passwordWeak')),
      }),
    [t]
  );
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { username: '', email: '', password: '' },
  });
  const setAuth = useAppStore((s) => s.setAuth);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string>();

  const onSubmit = async (values: RegisterRequest) => {
    try {
      setIsLoading(true);
      setServerError(undefined);
      const res = await registerUser(values);
      await saveToken(res.token);

      let profile = res.user;
      try {
        profile = await getCurrentUser(res.token);
      } catch (fetchError) {
        console.warn('Registration profile refresh failed:', fetchError);
      }

      setAuth(res.token, profile);
      router.replace('/');
    } catch (error: any) {
      setServerError(error?.message || t('auth.registerError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenFormContainer>
      <YStack space="$6">
        {/* Header */}
        <YStack alignItems="center" space="$4">
          <Text fontSize="$8" fontWeight="900" color="$gray12">
            {t('auth.createAccount', 'Create Account')}
          </Text>
          <Text fontSize="$4" color="$gray10" textAlign="center">
            {t('auth.createAccountDesc', 'Join us to start splitting bills with friends')}
          </Text>
        </YStack>

        {/* Form Card */}
        <Card>
          <YStack space="$5">
            {/* Username */}
            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, value } }) => (
                <XStack space="$3" alignItems="flex-start">
                  <YStack
                    width={40}
                    height={40}
                    backgroundColor="$gray3"
                    borderRadius="$6"
                    alignItems="center"
                    justifyContent="center"
                    marginTop="$6"
                  >
                    <User size={20} color="$gray11" />
                  </YStack>
                  <YStack flex={1}>
                    <Input
                      label={t('auth.username', 'Username')}
                      placeholder={t('auth.usernamePlaceholder', 'Enter your username')}
                      value={value}
                      onChangeText={onChange}
                      error={errors.username?.message}
                      required
                    />
                  </YStack>
                </XStack>
              )}
            />

            {/* Email */}
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, value } }) => (
                <XStack space="$3" alignItems="flex-start">
                  <YStack
                    width={40}
                    height={40}
                    backgroundColor="$gray3"
                    borderRadius="$6"
                    alignItems="center"
                    justifyContent="center"
                    marginTop="$6"
                  >
                    <Mail size={20} color="$gray11" />
                  </YStack>
                  <YStack flex={1}>
                    <Input
                      label={t('auth.email', 'Email')}
                      placeholder={t('auth.emailPlaceholder', 'Enter your email')}
                      value={value}
                      onChangeText={onChange}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      error={errors.email?.message}
                      required
                    />
                  </YStack>
                </XStack>
              )}
            />

            {/* Password */}
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, value } }) => (
                <XStack space="$3" alignItems="flex-start">
                  <YStack
                    width={40}
                    height={40}
                    backgroundColor="$gray3"
                    borderRadius="$6"
                    alignItems="center"
                    justifyContent="center"
                    marginTop="$6"
                  >
                    <Lock size={20} color="$gray11" />
                  </YStack>
                  <YStack flex={1}>
                    <PasswordInput
                      label={t('auth.password', 'Password')}
                      placeholder={t('auth.passwordPlaceholder', 'Enter your password')}
                      value={value}
                      onChangeText={onChange}
                      error={errors.password?.message}
                      required
                    />
                    <PasswordRules value={value} />
                  </YStack>
                </XStack>
              )}
            />

            <FormError message={serverError} />

            {/* Submit */}
            <Button
              title={isLoading ? t('common.loading', 'Loading...') : t('auth.createAccount', 'Create Account')}
              variant="primary"
              size="large"
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
            />
          </YStack>
        </Card>

        {/* Footer */}
        <YStack alignItems="center" space="$3">
          <XStack alignItems="center" space="$1">
            <YStack width={80} height={1} backgroundColor="$gray6" />
            <Text fontSize="$3" color="$gray9" paddingHorizontal="$3">
              {t('auth.haveAccount', 'Already have an account?')}
            </Text>
            <YStack width={80} height={1} backgroundColor="$gray6" />
          </XStack>

          <Link href="/login" asChild>
            <Button title={t('auth.signIn', 'Sign In')} variant="outline" size="medium" />
          </Link>
        </YStack>
      </YStack>
    </ScreenFormContainer>
  );
}
