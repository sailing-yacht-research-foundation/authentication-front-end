import * as React from 'react';
import { translations } from 'locales/translations';
import { Trans, useTranslation } from 'react-i18next';
import { LottieWrapper, LottieMessage } from 'app/components/SyrfGeneral';
import Lottie from 'react-lottie';
import EmailSent from '../assets/email-sent.json';
import { sendRequestVerifyEmail } from 'services/live-data-server/auth';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { toast } from 'react-toastify';
import { useHistory, useLocation, Link } from 'react-router-dom';

const defaultLottieOptions = {
    loop: true,
    autoplay: true,
    animationData: EmailSent,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export const VerifyAccountForm = () => {

    const history = useHistory();

    const location = useLocation();
  
    const email = (new URLSearchParams(location.search).get('email'));
  
    React.useEffect(() => {
      if (!email) history.push('/404');
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    const { t } = useTranslation();

    const sendVerifyEmail = async () => {
        const response = await sendRequestVerifyEmail(email);

        if (!response.success) {
            showToastMessageOnRequestError(response.error);
        } else {
            toast.success(t(translations.verify_account_page.successfully_sent_verification_link_to, { email: email }))
        }
    }

    return (
        <LottieWrapper>
            <Lottie
                options={defaultLottieOptions}
                height={400}
                width={400} />
            <LottieMessage>{t(translations.verify_account_page.please_check_your_email)} <br />
                <Trans
                    i18nKey={translations.verify_account_page.if_you_havent_receive_any_email}
                    defaults="If you haven't received any email at all please click <0>here</0> to resend the verification or click <1>here</1> to return to the login page to log in." // optional defaultValue
                    components={[<a href='/' onClick={(e) => {
                        e.preventDefault();
                        sendVerifyEmail();
                    }}>here</a>, <Link to="/signin">here</Link>]} /></LottieMessage>
        </LottieWrapper>
    );
}
