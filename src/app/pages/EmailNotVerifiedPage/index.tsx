import * as React from 'react';
import styled from 'styled-components/macro';
import { StyleConstants } from 'styles/StyleConstants';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { CreateButton, LottieMessage, LottieWrapper } from 'app/components/SyrfGeneral';
import Lottie from 'react-lottie';
import Mailbox from './assets/mailbox.json';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { Link, useHistory } from 'react-router-dom';
import { requestSendVerifyEmail } from 'services/live-data-server/user';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { selectUser } from '../LoginPage/slice/selectors';

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: Mailbox,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice'
  }
};

export function EmailNotVerifiedPage() {

  const { t } = useTranslation();

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const authUser = useSelector(selectUser);

  const history = useHistory();

  const sendVerifyEmail = async () => {
    setIsLoading(true);
    const response = await requestSendVerifyEmail();
    setIsLoading(false);

    if (response.success) {
      toast.success(t(translations.verify_account_page.successfully_sent_verification_link_to_your_email))
    } else {
      showToastMessageOnRequestError(response.error);
    }
  }

  React.useEffect(() => {
    if (authUser.id) {
      if (authUser.emailVerified) {
        history.push('/');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser]);

  return (
    <>
      <Wrapper>
        <LottieWrapper>
          <Lottie
            options={defaultOptions}
            height={400}
            width={400} />
          <LottieMessage>{t(translations.verify_account_page.your_email_has_not_been_verified)}</LottieMessage>
          <CreateButton loading={isLoading} onClick={sendVerifyEmail}>{t(translations.verify_account_page.verify_your_account)}</CreateButton>
          <p style={{ marginTop: '15px' }}><Link to={process.env.PUBLIC_URL + '/'}>{t(translations.not_found_page.return_to_homepage)}</Link></p>
        </LottieWrapper>
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