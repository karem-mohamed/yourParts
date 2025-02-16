'use client';
import { useTranslations } from 'use-intl';
import Button from '../../_components/button';
import Input from '../../_components/input';
import Card from '@/components/Card';
import Link from 'next/link';
import { FormProvider, useForm } from 'react-hook-form';
import { registerSchema } from '@/validations/schemas';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLocale } from '@/hooks/useLocale';
import { useRegister } from '@/endpoints/auth/register';
import { RegisterData } from '@/endpoints/auth/types';
import useToast from '@/context/toastContext/useToast';
import { useEffect } from 'react';
import handleToken from '@/hooks/useSaveToken';

export default function Login() {
  const t = useTranslations();
  const locale = useLocale();
  const { showToast } = useToast();
  const methods = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
    resolver: yupResolver(registerSchema(locale)),
  });
  const { mutateAsync, data, isError, error, isPending } = useRegister();
  const { handleSubmit } = methods;
  const onSubmit = async (data: RegisterData) => {
    const response = await mutateAsync(data);
    handleToken(response);
    showToast(t('messages.register-success'), 'success');
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
            {t('labels.register')}
          </h2>
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="mt-6 space-y-4"
            >
              <div>
                <Input
                  name="username"
                  type="text"
                  label={t('labels.username')}
                  placeholder={t('placeHolder.pls-enter-username')}
                  className="focus:outline-blue-200 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                />
              </div>
              <div>
                <Input
                  name="email"
                  type="text"
                  label={t('labels.email')}
                  placeholder={t('placeHolder.pls-enter-email')}
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
                label={t('labels.register')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-200"
              />
            </form>
          </FormProvider>
          <p className="mt-4 text-sm text-gray-600 text-center">
            {t('questions.have-account-already')}{' '}
            <Link href="login" className="text-blue-600 hover:underline">
              {t('labels.login')}
            </Link>
          </p>
        </Card>
      </div>
    </>
  );
}
