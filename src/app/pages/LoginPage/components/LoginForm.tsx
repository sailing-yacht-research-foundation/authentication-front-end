import * as React from 'react';

import { Input, Form, Button, Spin } from 'antd';
import { Auth } from 'aws-amplify';
import { useDispatch } from 'react-redux';
import { UseLoginSlice } from '../slice';
import { useHistory } from 'react-router';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';
import { media } from 'styles/media';
import { SyrfFormButton } from 'app/components/SyrfForm';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';

const layout = {
  wrapperCol: { sm: 24, md: 24, lg: 24 }
};

export const LoginForm = (props) => {
  const { actions } = UseLoginSlice();
  // Used to dispatch slice actions
  const dispatch = useDispatch();

  const history = useHistory();

  const [isSigningIn, setIsSigningIn] = React.useState<boolean>(false);

  const { t } = useTranslation();

  const onFinish = (values: any) => {
    const { email, password } = values;

    setIsSigningIn(true);

    Auth.configure({ storage: localStorage });

    Auth.signIn({
      username: email,
      password
    }).then(user => {
      setIsSigningIn(false);

      if (user.attributes && user.attributes.email_verified) {
        dispatch(actions.setAccessToken(user.signInUserSession?.accessToken?.jwtToken));
        dispatch(actions.setIsAuthenticated(true));
        dispatch(actions.setUser(JSON.parse(JSON.stringify(user))));
        history.push('/');
      }
    }).catch(error => {
      setIsSigningIn(false);
      if (error.code) {
        if (error.code === 'UserNotConfirmedException') {
          history.push('/verify-account', {
            state: {
              email: email
            }
          });
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error(t(translations.login_page.login_error));
      }
    })
  }

  return (
    <Wrapper>
      <Spin spinning={isSigningIn} tip={t(translations.login_page.login_message)}>
        <Title>SYRF</Title>

        <FormWrapper>
          <FormTitle>{t(translations.login_page.login)}</FormTitle>
          <Form
            {...layout}
            name="basic"
            initialValues={{ remember: true }}
            onFinish={onFinish}
          >
            <Form.Item
              name="email"
              rules={[{ required: true, type: 'email' }]}
            >
              <SyrfInput placeholder={t(translations.login_page.email.label)} />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true }]}
            >
              <SyrfInputPassword placeholder={t(translations.login_page.password.label)} />
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
    </Wrapper>
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

const SyrfInput = styled(Input)`
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
`