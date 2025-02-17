'use client';
import { useTranslations } from 'use-intl';
import Button from '../../../../components/button';
import Input from '../../../../components/input';
import Card from '@/components/Card';
import Link from 'next/link';
import { FormProvider, useForm } from 'react-hook-form';
import { loginSchema } from '@/validations/schemas';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLocale } from '@/hooks/useLocale';
import { useLogin } from '@/endpoints/auth/login';
import { LoginData } from '@/endpoints/auth/types';
import useToast from '@/context/toastContext/useToast';
import { useEffect } from 'react';
import handleToken from '@/hooks/useSaveToken';
import useUserContext from '@/context/userContext/useUserContext';
import { useRouter } from 'next/navigation';

export default function Login() {
  const t = useTranslations();
  const { push } = useRouter();
  const locale = useLocale();
  const { showToast } = useToast();
  const { setUserData } = useUserContext();
  const methods = useForm({
    defaultValues: {
      identifier: '',
      password: '',
    },
    resolver: yupResolver(loginSchema(locale)),
  });
  const { mutateAsync, data, isError, error, isPending } = useLogin();
  const { handleSubmit } = methods;
  const onSubmit = async (data: LoginData) => {
    const response = await mutateAsync(data);
    handleToken(response);
    setUserData(response.user);
    showToast(t('messages.login-success'), 'success');
    push('home');
  };

  useEffect(() => {
    if (isError && error) {
      showToast(error.response?.data?.message, 'error');
    }
  }, [isError]);
  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            {t('labels.login')}
          </h2>
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="mt-6 space-y-4"
            >
              <div>
                <Input
                  name="identifier"
                  type="text"
                  label={t('labels.name-email')}
                  placeholder={t('placeHolder.pls-enter-username-mail')}
                  className="focus:outline-blue-200 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                />
              </div>
              <div>
                <Input
                  name="password"
                  type="password"
                  label={t('labels.password')}
                  placeholder={t('placeHolder.pls-enter-password')}
                  className="focus:outline-blue-200 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                />
              </div>
              <Button
                isLoading={isPending}
                type={'submit'}
                label={t('labels.login')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-200"
              />
            </form>
          </FormProvider>
          <p className="mt-4 text-sm text-gray-600 text-center">
            {t('questions.have-account')}{' '}
            <Link href="register" className="text-blue-600 hover:underline">
              {t('labels.register')}
            </Link>
          </p>

          <p className="mt-2 text-sm text-gray-600 text-center">
            {t('questions.forget-pass')}{' '}
            <Link href="reset" className="text-blue-600 hover:underline">
              {t('labels.reset-pass')}
            </Link>
          </p>
        </Card>
      </div>
    </>
  );
}
