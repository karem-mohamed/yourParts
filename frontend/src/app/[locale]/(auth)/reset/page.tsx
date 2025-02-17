'use client';
import { useTranslations } from 'use-intl';
import Button from '../../../../components/button';
import Input from '../../../../components/input';
import Card from '@/components/Card';
import Link from 'next/link';
import { FormProvider, useForm } from 'react-hook-form';
import { otpSchema, resetSchema } from '@/validations/schemas';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLocale } from '@/hooks/useLocale';
import { ResetData, OtpData } from '@/endpoints/auth/types';
import useToast from '@/context/toastContext/useToast';
import { useEffect } from 'react';
import { useResetPassword } from '@/endpoints/auth/resetPassword';
import { useVerifyOtp } from '@/endpoints/auth/verifyOtp';
import { useRouter } from 'next/navigation';

export default function Login() {
  const t = useTranslations();
  const locale = useLocale();
  const { showToast } = useToast();
  const { push } = useRouter();
  const { mutateAsync, data, isError, error, isPending } = useResetPassword();
  const {
    mutateAsync: verifyOtp,
    isError: isVerifyError,
    error: verifyError,
    isPending: isVerifyLoading,
  } = useVerifyOtp();
  const methods = useForm({
    defaultValues: {
      email: '',
    },
    resolver: yupResolver(resetSchema(locale)),
  });
  const { handleSubmit } = methods;
  const restmethods = useForm({
    defaultValues: {
      otp: '',
      newPassword: '',
    },
    resolver: yupResolver(otpSchema(locale)),
  });
  const { handleSubmit: submit } = restmethods;

  const onSubmit = async (data: ResetData) => {
    const response = await mutateAsync(data);
    showToast(response.message, 'success');
  };

  const onfinish = async (data: OtpData) => {
    const response = await verifyOtp({
      ...data,
      email: methods.getValues().email,
    });
    showToast(response.message, 'success');
    push('login');
  };

  useEffect(() => {
    if (isError && error) {
      showToast(error.response?.data?.message, 'error');
    }
  }, [isError]);

  useEffect(() => {
    if (isVerifyError && verifyError) {
      showToast(verifyError.response?.data?.message, 'error');
    }
  }, [isVerifyError]);

  return (
    <>
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <Card>
          <h2 className="text-2xl font-bold text-gray-900 text-center">
            {t('labels.reset-pass')}
          </h2>
          {data ? (
            <FormProvider {...restmethods}>
              <form
                onSubmit={submit(onfinish)}
                noValidate
                className="mt-6 space-y-4"
              >
                <div>
                  <Input
                    name="otp"
                    type="text"
                    label={t('labels.otp')}
                    placeholder={t('placeHolder.pls-enter-otp')}
                    className="focus:outline-blue-200 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                  />
                </div>
                <div>
                  <Input
                    name="newPassword"
                    type="text"
                    label={t('labels.npassword')}
                    placeholder={t('placeHolder.pls-enter-password')}
                    className="focus:outline-blue-200 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                  />
                </div>

                <Button
                  isLoading={isPending || isVerifyLoading}
                  type={'submit'}
                  label={t('labels.confirm')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-200"
                />
              </form>
            </FormProvider>
          ) : (
            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="mt-6 space-y-4"
              >
                <>
                  <Input
                    name="email"
                    type="text"
                    label={t('labels.email')}
                    placeholder={t('placeHolder.pls-enter-email')}
                    className="focus:outline-blue-200 mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                  />
                </>

                <Button
                  isLoading={isPending || isVerifyLoading}
                  type={'submit'}
                  label={t('labels.confirm')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-md transition duration-200"
                />
              </form>
            </FormProvider>
          )}
          <p className="mt-4 text-sm text-gray-600 text-center">
            <Link href="login" className="text-blue-600 hover:underline">
              {t('labels.login')}
            </Link>
          </p>
        </Card>
      </div>
    </>
  );
}
