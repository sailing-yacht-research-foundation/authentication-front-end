import * as React from 'react';

import { Input, Form, Button, Spin } from 'antd';
import { useDispatch } from 'react-redux';
import { UseLoginSlice } from '../slice';
import { useHistory, useLocation } from 'react-router';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';
import { media } from 'styles/media';
import { SyrfFormButton } from 'app/components/SyrfForm';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { ReactComponent as Logo } from '../assets/logo-dark.svg';
import { login } from 'services/live-data-server/auth';
import { subscribeUser } from 'subscription';
import { AuthCode, ignoreBrowserSupportAttributes } from 'utils/constants';

const layout = {
  wrapperCol: { sm: 24, md: 24, lg: 24 }
};

export const LoginForm = (props) => {
  const { actions } = UseLoginSlice();
  // Used to dispatch slice actions
  const dispatch = useDispatch();

  const history = useHistory();

  const location = useLocation();

  const [isSigningIn, setIsSigningIn] = React.useState<boolean>(false);

  const { t } = useTranslation();

  const onFinish = async (values: any) => {
    const { email, password } = values;

    setIsSigningIn(true);

    const response: any = await login({ email: email, password: password });

    setIsSigningIn(false);

    if (response.success) {
      dispatch(actions.setSessionToken(response.token));
      dispatch(actions.setRefreshToken(response.user.refresh_token));
      dispatch(actions.setTokenExpiredDate(response.user.expiredAt));
      dispatch(actions.setRefreshTokenExpiredDate(response.user.refreshExpiredAt));
      dispatch(actions.getUser());
      dispatch(actions.setIsAuthenticated(true));
      localStorage.removeItem('is_guest');
      localStorage.setItem('user_id', response.user.id);
      redirectToURLOrMainPage('/');
      subscribeUser();
      if (!response.user?.email_verified) {
        toast.info(t(translations.login_page.please_verify_your_account));
        redirectToURLOrMainPage('/account-not-verified');
      }
    } else {
      switch (response.error?.response.data.errorCode) {
        case AuthCode.WRONG_CREDENTIALS:
          toast.error(t(translations.login_page.credentials_are_not_correct));
          break;
        default:
          toast.info(t(translations.login_page.cannot_login_at_the_moment));
      }
    }
  }

  const redirectToURLOrMainPage = (url) => {
    const param = new URLSearchParams(location.search);
    const redirectURL = param.get('redirectBack');
    history.push(redirectURL || url);
  }

  return (
    <Wrapper>
      <Spin spinning={isSigningIn} tip={t(translations.login_page.login_message)}>
        <Title>
          <StyledLogo onClick={() => history.push('/')} />
        </Title>

        <FormWrapper>
          <FormTitle>{t(translations.login_page.login)}</FormTitle>
          <Form
            {...layout}
            name="basic"
            autoComplete='off'
            initialValues={{
              remember: true,
              email: '',
              password: ''
            }}
            onFinish={onFinish}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: t(translations.forms.please_fill_out_this_field) },
                {
                  pattern: /^\S+$/,
                  message: t(translations.forms.must_not_contain_blank, { field: t(translations.general.email) })
                },
                { type: 'email', message: t(translations.forms.email_must_be_valid) }]}
            >
              <SyrfInput
                placeholder={t(translations.general.email)} />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: t(translations.forms.please_fill_out_this_field) },
                {
                  pattern: /^\S+$/,
                  message: t(translations.forms.must_not_contain_blank, { field: t(translations.general.password) })
                },
                {
                  max: 16, min: 8, message: t(translations.forms.please_input_between, { min: 8, max: 16, field: t(translations.general.password) })
                },
              ]}
            >
              <SyrfInputPassword placeholder={t(translations.general.password)} />
            </Form.Item>

            <Form.Item
            >
              <SyrfFormButton type="primary" htmlType="submit">
                {t(translations.login_page.login)}
              </SyrfFormButton>
            </Form.Item>

            <ForgotPasswordLinkContainer>
              <Link to="/forgot-password">{t(translations.login_page.forgot_password)}</Link>
            </ForgotPasswordLinkContainer>
          </Form>
        </FormWrapper>

        <SignupContainer>
          <GreyTitle>{t(translations.login_page.dont_have_account)}</GreyTitle>

          <SyrfSignupButton onClick={() => history.push('/signup')}>
            {t(translations.login_page.signup)}
          </SyrfSignupButton>
        </SignupContainer>
      </Spin>
    </Wrapper >
  );
}

const Wrapper = styled.div`
  background: #EEF5FF;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 50px;
  ${media.medium`
    height: 100vh;
    padding-bottom: 0;
  `};
`;

const Title = styled.h2`
  font-family: Inter;
  font-size: 36px;
  font-style: normal;
  font-weight: 700;
  line-height: 44px;
  letter-spacing: 0em;
  text-align: center;
  margin-top: 119px;
`

const FormWrapper = styled.div`
  background: #fff;
  border-radius: 4px;
  padding: 0 60px;
  padding-bottom: 30px;
  margin-top: 61px;
  width: 100%;
  ${media.medium`
  width: 460px;
  `};
`;

const FormTitle = styled.h3`
  font-family: ${StyleConstants.FONT_OPEN_SANS};
  font-size: 28px;
  font-style: normal;
  font-weight: 700;
  line-height: 38px;
  letter-spacing: 0em;
  text-align: center;
  color: #626262;
  padding: 20px;
  padding-top: 70px;
`

const SyrfInput = styled(Input).attrs(props => ({
  ...ignoreBrowserSupportAttributes
}))`
  background: #F8F8F8 !important;
  border-radius: 4px;
  border: none;
  height: 36px;
`

const SyrfInputPassword = styled(Input.Password)`
  background: #F8F8F8 !important;
  border-radius: 4px;
  border: none;
  height: 36px;
  > input {
    background: #F8F8F8 !important;
  }
`;

const ForgotPasswordLinkContainer = styled.div`
  display: block;
  text-align: center;
  font-family: Open Sans;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 19px;
  letter-spacing: 0em;
  text-align: center;
  color: #348BCD;
`;

const SignupContainer = styled.div`
  background: #FCF1E9;
  text-align: center;
  padding: 0 60px;
  padding-bottom: 40px;
`

const GreyTitle = styled.h3`
  font-family: ${StyleConstants.FONT_OPEN_SANS};
  font-size: 28px;
  font-style: normal;
  font-weight: 700;
  line-height: 38px;
  letter-spacing: 0em;
  text-align: center;
  color: #7A7A7A;
  padding-top: 30px;
`

const SyrfSignupButton = styled(Button)`
  width: 100%;
  max-width: 360px;
  height: 36px;
  border-radius: 4px;
  background: #DB6E1E;
  font-family: ${StyleConstants.FONT_OPEN_SANS};
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 19px;
  color: #fff;
  &:hover {
    background: #DB6E1E;
    color: #fff;
    border-color: #DB6E1E;
  }
`;

const StyledLogo = styled(Logo)`
  cursor: pointer;
`
