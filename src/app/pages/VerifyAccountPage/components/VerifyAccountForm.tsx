import * as React from 'react';
import { useHistory } from 'react-router';
import { translations } from 'locales/translations';
import { Trans, useTranslation } from 'react-i18next';
import { CreateButton, LottieMessage, LottieWrapper } from 'app/components/SyrfGeneral';
import Lottie from 'react-lottie';
import EmailSent from '../assets/email-sent.json';
import { Link } from 'react-router-dom';
import { Button } from 'antd';

const defaultLottieOptions = {
    loop: true,
    autoplay: true,
    animationData: EmailSent,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export const VerifyAccountForm = (props) => {

    const { email } = props;

    const { t } = useTranslation();

    return (
        <LottieWrapper>
            <Lottie
                options={defaultLottieOptions}
                height={400}
                width={400} />
            <LottieMessage>{t(translations.verify_account_page.please_check_your_email)}</LottieMessage>
            <span><Trans key={translations.verify_account_page.if_you_havent_receive_any_email}>If you haven't received any email at all please click <a href="#">here</a> to resend the verification or click <Link to="/login">here</Link> to return to the login page.</Trans></span>
        </LottieWrapper>
    );
}
