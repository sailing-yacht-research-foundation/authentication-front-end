import * as React from 'react';
import styled from 'styled-components/macro';
import { StyleConstants } from 'styles/StyleConstants';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { CreateButton, LottieMessage, LottieWrapper } from 'app/components/SyrfGeneral';
import Lottie from 'react-lottie';
import Mailbox from './assets/mailbox.json';
import { requestSendVerifyEmail } from 'services/live-data-server/user';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { VerifyAccountForm } from '../VerifyAccountPage/components/VerifyAccountForm';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { sendRequestVerifyEmail } from 'services/live-data-server/auth';

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: Mailbox,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

export function EmailNotVefiedPage() {

  const { t } = useTranslation();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const location = useLocation();

  const [sentVerifyEmail, setSentVerifyEmail] = React.useState<boolean>(true);

  const email = (new URLSearchParams(location.search).get('email'));

  const history = useHistory();

  const sendVerifyEmail = async () => {
    setIsLoading(true);
    const response = await sendRequestVerifyEmail(email);
    setIsLoading(false);

    if (response.success) {
      setSentVerifyEmail(true);
    } else {
      showToastMessageOnRequestError(response.error);
    }
  }

  React.useEffect(() => {
    if (!email) history.push('/404');
  }, []);

  return (
    <>
      <Wrapper>
        {!sentVerifyEmail ? (<LottieWrapper>
          <Lottie
            options={defaultOptions}
            height={400}
            width={400} />
          <LottieMessage>{t(translations.verify_account_page.your_email_has_not_been_verified)}</LottieMessage>
          <CreateButton loading={isLoading} onClick={sendVerifyEmail}>{t(translations.verify_account_page.verify_your_account)}</CreateButton>
          <p style={{ marginTop: '15px' }}><Link to={process.env.PUBLIC_URL + '/'}>{t(translations.not_found_page.return_to_homepage)}</Link></p>
        </LottieWrapper>) : (
          <VerifyAccountForm  email={email} />
        )}
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div`
  height: calc(100vh - ${StyleConstants.NAV_BAR_HEIGHT});
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: 320px;
  text-align: center;
`;