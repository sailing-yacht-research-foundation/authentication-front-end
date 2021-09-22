import * as React from 'react';
import { Input, Form, Row, Spin } from 'antd';
import { toast } from 'react-toastify';
import { SyrfFormButton } from 'app/components/SyrfForm';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { sendForgotPassword } from 'services/live-data-server/auth';
import Lottie from 'react-lottie';
import styled from 'styled-components';
import { media } from 'styles/media';
import EmailSent from '../assets/email-sent.json'

const defaultLottieOptions = {
  loop: true,
  autoplay: true,
  animationData: EmailSent,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

export function ForgotPasswordForm(props) {
  const [requestedResetPassword, setRequestedResetPassword] = React.useState(false);

  const [isSendingResetPasswordRequest, setIsSendingResetPasswordRequest] = React.useState<boolean>(false);

  const [email, setEmail] = React.useState('');

  const { t } = useTranslation();

  const onFinish = (values) => {
    const { email } = values;

    setEmail(email);
    sendForgotPasswordCode(email);
  }

  const sendForgotPasswordCode = async (email) => {
    setIsSendingResetPasswordRequest(true);
    const response = await sendForgotPassword(email);
    setIsSendingResetPasswordRequest(false);
    if (response.success) {
      setRequestedResetPassword(true);
    } else {
      toast.error(t(translations.forgot_password_page.cannot_send_password_reset_request_at_the_moment));
    }
  }

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
      {!requestedResetPassword ? (
        <Spin spinning={isSendingResetPasswordRequest}>
          <Form
            layout={'vertical'}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              label={t(translations.forgot_password_page.your_email)}
              name="email"
              rules={[{ required: true, type: 'email' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item>
              <SyrfFormButton type="primary" htmlType="submit">
                {t(translations.forgot_password_page.recover_password)}
              </SyrfFormButton>
            </Form.Item>
          </Form>
        </Spin>
      ) : (
        <LottieWrapper>
          <Lottie
            options={defaultLottieOptions}
            height={400}
            width={400} />
          <LottieMessage>{t(translations.forgot_password_page.please_check_your_email_to_reset_your_password, { email: email })}</LottieMessage>
        </LottieWrapper>
      )}
    </Row>
  );
}

const LottieWrapper = styled.div`
    text-align: center;
    margin-top: 15px;

    ${media.medium`
        margin-top: 100px;
    `}
`;

const LottieMessage = styled.p`
   color: #70757a;
   padding: 0 20px;
`;