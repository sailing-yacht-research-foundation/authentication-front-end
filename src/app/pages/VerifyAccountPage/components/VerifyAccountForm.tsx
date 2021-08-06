import * as React from 'react';
import { Input, Form } from 'antd';
import { Auth } from 'aws-amplify';
import { useHistory } from 'react-router';
import { toast } from 'react-toastify';
import { SyrfFormButton } from 'app/components/SyrfForm';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';

export const VerifyAccountForm = () => {

    const history = useHistory<any>();

    const { t } = useTranslation();

    React.useEffect(() => {
        let code = new URLSearchParams(history.location.search).get("code");
        let email = new URLSearchParams(history.location.search).get("email");

        if (!history?.location?.state?.state?.email && !(code && email)) {
            history?.push('/not-found')
        } else if (code && email) {
            verifyAccount(email, code);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onFinish = (values) => {
        const { code } = values;
        const email = history?.location?.state?.state?.email;

        verifyAccount(email, code);
    }

    const showVerifySuccessAndRedirectToLogin = () => {
        history.push('/signin');
        toast.success(t(translations.verify_account_page.account_verified_please_login));
    }

    const verifyAccount = (email, code) => {
        Auth.confirmSignUp(email, code)
            .then(response => {
                showVerifySuccessAndRedirectToLogin();
            }).catch(error => {
                if (error.code !== 'NotAuthorizedException') // don't show when user already confirmed and only want to re-verify email.
                    toast.error(error.message);
            });

        Auth.currentAuthenticatedUser().then(user => { // this case is for re-verify email.
            Auth.verifyCurrentUserAttributeSubmit('email', code).then(() => {
                showVerifySuccessAndRedirectToLogin();
                Auth.signOut();
            }).catch(error => {
                toast.error(error.message);
            });
        }).catch(e => {

        });
    }

    const resendConfirmationCode = () => {
        const email = history?.location?.state?.state?.email;

        Auth.resendSignUp(email).then(response => {
            toast.success(t(translations.verify_account_page.confirmation_code_sent));
        }).catch(error => {
            toast.error(error.message);
        })
    }

    return (
        <Form
            layout={'vertical'}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
        >
            <Form.Item
                label={t(translations.verify_account_page.verification_code)}
                name="code"
                rules={[{ required: true }]}
            >
                <Input />
            </Form.Item>

            <Form.Item>
                <SyrfFormButton type="primary" htmlType="submit">
                    {t(translations.verify_account_page.verify_my_account)}
                </SyrfFormButton>
                <div style={{ marginTop: '10px', textAlign: 'right' }}>
                    <span>{t(translations.verify_account_page.could_not_receive_the_code)} &nbsp; <a style={{ float: 'right' }} href="/" onClick={(e) => {
                        e.preventDefault();
                        resendConfirmationCode();
                    }}>{t(translations.verify_account_page.resend)}</a></span>
                </div>
            </Form.Item>
        </Form>
    );
}
