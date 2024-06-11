import { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import { PhoneRegExp, SmsExpirationSeconds } from '@/utils/common';
import { saveUserInfo, setUserSessionId } from '@/utils/user';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { postSignCode, registerByPhone, signByPhone } from '@/apis/userService';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const PhoneRegisterCard = (props: {
  loginLoading: boolean;
  openLoading: Function;
  closeLoading: Function;
}) => {
  const { loginLoading, openLoading, closeLoading } = props;
  const { t } = useTranslation('login');
  const router = useRouter();
  const [seconds, setSeconds] = useState(SmsExpirationSeconds - 1);
  const [isSendCode, setIsSendCode] = useState(false);
  const [smsCode, setSmsCode] = useState('');

  const formSchema = z.object({
    invitationCode: z
      .string()
      .min(1, t('Please enter the correct invitation code')!)
      .optional(),
    phone: z.string().regex(PhoneRegExp, {
      message: t('Please enter the correct phone number')!,
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'all',
    defaultValues: {
      invitationCode: '',
      phone: '',
    },
  });

  useEffect(() => {
    form.formState.isValid;
  }, []);

  useEffect(() => {
    let timer: any;
    if (isSendCode && seconds > 0) {
      timer = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);
    }

    if (seconds === 0) {
      setIsSendCode(false);
      setSeconds(SmsExpirationSeconds);
    }

    return () => clearInterval(timer);
  }, [isSendCode, seconds]);

  const sendCode = () => {
    if (form.formState.isValid) {
      const phone = form.getValues('phone');
      postSignCode(phone)
        .then(() => {
          toast.success(t('SMS sent successfully'));
          setIsSendCode(true);
        })
        .catch(() => {
          toast.error(t('SMS send failed, please try again later'));
        });
    }
  };

  const sign = () => {
    form.trigger();
    if (form.formState.isValid && smsCode.length === 6) {
      const phone = form.getValues('phone');
      const invitationCode = form.getValues('invitationCode')!;
      openLoading();
      registerByPhone(phone, smsCode, invitationCode)
        .then((response) => {
          setUserSessionId(response.sessionId);
          saveUserInfo({
            canRecharge: response.canRecharge,
            role: response.role,
            username: response.username,
          });
          router.push('/');
        })
        .catch(async (response) => {
          closeLoading();
          const json = await response.json();
          toast.error(json.message || t('Verification code error'));
        });
    }
  };
  return (
    <Card>
      <CardContent className="space-y-2">
        <Form {...form}>
          <form>
            <FormField
              control={form.control}
              name="invitationCode"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormControl className="w-full">
                    <div>
                      <div className="py-2.5 text-sm font-medium leading-none">
                        {t('Invitation Code')}
                      </div>
                      <div className="flex border rounded-md">
                        <Input
                          className="w-full m-0 border-none outline-none bg-transparent rounded-md"
                          {...field}
                        />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="flex flex-col items-start">
                  <FormControl className="w-full">
                    <div>
                      <div className="py-2.5 text-sm font-medium leading-none">
                        {t('Phone Number')}
                      </div>
                      <div className="flex border rounded-md">
                        <Button
                          type="button"
                          variant="ghost"
                          className="absolute font-semibold"
                        >
                          +86
                        </Button>
                        <Input
                          className="w-full m-0 border-none outline-none bg-transparent rounded-md p-0 pl-14"
                          {...field}
                        />
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <div className="pt-2">
          <div className="py-2.5 text-sm font-medium leading-none">
            {t('Code')}
          </div>
          <div className="flex border rounded-md">
            <Input
              value={smsCode}
              onChange={(e) => {
                setSmsCode(e.target.value);
              }}
              className="m-0 border-none outline-none bg-transparent rounded-md p-0 pr-[102px] pl-4"
            />
            <Button
              className="absolute right-0 text-center"
              disabled={!form.formState.isValid}
              variant="link"
              onClick={sendCode}
            >
              {isSendCode ? seconds + 's' : t('Send code')}
            </Button>
          </div>
        </div>
        <div className="pt-4">
          <Button
            className="w-full"
            type="submit"
            onClick={sign}
            disabled={loginLoading}
          >
            {loginLoading ? t('Logging in...') : t('Login to your account')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PhoneRegisterCard;
