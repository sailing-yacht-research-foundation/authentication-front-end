import * as React from 'react';
import { useHistory } from 'react-router';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { CreateButton, LottieMessage, LottieWrapper } from 'app/components/SyrfGeneral';
import Lottie from 'react-lottie';
import EmailSent from '../assets/email-sent.json';

const defaultLottieOptions = {
    loop: true,
    autoplay: true,
    animationData: EmailSent,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export const VerifyAccountForm = () => {

    const history = useHistory<any>();

    const { t } = useTranslation();

    return (
        <LottieWrapper>
            <Lottie
                options={defaultLottieOptions}
                height={400}
                width={400} />
            <LottieMessage>{t(translations.verify_account_page.please_check_your_email)}</LottieMessage>
            <CreateButton onClick={() => history.push("/signin")}>{t(translations.verify_account_page.login)}</CreateButton>
        </LottieWrapper>
    );
}
