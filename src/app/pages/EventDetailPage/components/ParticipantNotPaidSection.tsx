import React from 'react';
import { BorderedButton, LottieMessage } from 'app/components/SyrfGeneral';
import PayNow from '../assets/pay-now.json';
import Lottie from 'react-lottie';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/pages/LoginPage/slice/selectors';
import { CalendarEvent } from 'types/CalendarEvent';
import { getUserName } from 'utils/user-utils';
import styled from 'styled-components';
import { media } from 'styles/media';
import { payForEvent } from 'services/live-data-server/event-calendars';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { toast } from 'react-toastify';

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: PayNow,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export const ParticipantNotPaidSection = ({ event }: { event: Partial<CalendarEvent> }) => {

    const { t } = useTranslation();

    const authUser = useSelector(selectUser);

    const pay = async () => {
        const response = await payForEvent(event.id!);

        if (response.success) {
            if (response.data.checkoutUrl)
                window.location.href = response.data.checkoutUrl;
            else if (response.data.isPaid) {
                toast.info(t(translations.event_detail_page.you_already_paid_to_join_this_event));
            }
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    if (event.isParticipant && !event.isPaid)
        return (
            <LottieWrapper>
                <Lottie
                    options={defaultOptions}
                    height={150}
                    width={150} />
                <LottieMessage>{t(translations.event_detail_page.hey_participant_name_this_event_has_participant_fee, { participantingFee: event.participatingFee, participantName: getUserName(authUser) })}</LottieMessage>
                <BorderedButton type="primary" onClick={pay}>Pay Now</BorderedButton>
            </LottieWrapper>
        );

    return <></>;
}

const LottieWrapper = styled.div`
    text-align: center;
    margin-top: 15px;

    > div {
        width: 100% !important;
    }

    ${media.medium`
        margin-top: 100px;
        > div {
            width: 400px !important;
        }
    `}
`;