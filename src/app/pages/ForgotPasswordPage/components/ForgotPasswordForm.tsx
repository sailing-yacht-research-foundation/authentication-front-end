import * as React from 'react';
import { Input, Form, Row } from 'antd';
import { Auth } from 'aws-amplify';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router';
import { SyrfFormButton } from 'app/components/SyrfForm';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';

export function ForgotPasswordForm(props) {
  const [requestedResetPassword, setRequestedResetPassword] = React.useState(false);

  const [email, setEmail] = React.useState('');

  const history = useHistory();

  const { t } = useTranslation();

  const onFinish = (values) => {
    const { email } = values;

    setEmail(email);
    sendForgotPasswordCode(email);
  }

  const sendForgotPasswordCode = (email) => {
    Auth.forgotPassword(email)
      .then(() => {
        setRequestedResetPassword(true)
        toast.success(t(translations.forgot_password_page.confirmation_code_sent));
      })
      .catch(err => toast.error(err.message));
  }

  const onSubmitPasswordReset = (values) => {
    const { code, newPassword } = values;
    Auth.forgotPasswordSubmit(email, code, newPassword)
      .then(() => {
        history.push('/signin')
        toast.success(t(translations.forgot_password_page.your_password_has_been_changed_you_can_login_now));
      })
      .catch(err => toast.error(err.message))
  }

  return (
    <Row justify="center" align="middle" style={{ minHeight: '100vh' }}>
      {!requestedResetPassword ? (
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
      ) : (
        <Form
          name="basic"
          layout={'vertical'}
          initialValues={{ remember: true }}
          onFinish={onSubmitPasswordReset}
        >
          <Form.Item
            label={t(translations.forgot_password_page.code)}
            name="code"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={t(translations.forgot_password_page.new_password)}
            name="newPassword"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label={t(translations.forgot_password_page.confirm_new_password)}
            name="newPasswordConfirmation"
            rules={[
              {
                required: true,
                message: t(translations.forgot_password_page.please_confirm_new_password),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error(t(translations.forgot_password_page.the_two_passwords_that_you_entered_do_not_match)));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          
          <Form.Item>
            <SyrfFormButton type="primary" htmlType="submit">
              {t(translations.forgot_password_page.change_password)}
            </SyrfFormButton>
          </Form.Item>

          <Form.Item >
            <div style={{ marginTop: '10px', textAlign: 'right' }}>
              <div>{t(translations.forgot_password_page.could_not_receive_the_code)} <a href="/" onClick={(e) => {
                e.preventDefault();
                sendForgotPasswordCode(email);
              }}>{t(translations.forgot_password_page.resend)}</a></div>
            </div>
          </Form.Item>
        </Form>
      )}
    </Row>
  );
}