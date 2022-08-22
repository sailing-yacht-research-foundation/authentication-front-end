import React from 'react';
import { LottieWrapper, LottieMessage, BorderedButton } from 'app/components/SyrfGeneral';
import Lottie from 'react-lottie';
import Payment from '../assets/payment.json';
import Connected from '../assets/6900-connected.json';
import styled from 'styled-components';
import { media } from 'styles/media';
import { connectStripe, checkForStripePayout, disconnectStripe } from 'services/live-data-server/groups';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { OrganizationPayout } from 'types/OrganizationPayout';
import { Group } from 'types/Group';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { Button, Descriptions } from 'antd';
import { GroupTypes } from 'utils/constants';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { ConfirmModal } from 'app/components/ConfirmModal';

export const GroupOrganizationConnect = ({ group }: { group: Partial<Group> }) => {

    const statusCheckEvery = 4000;

    let statusCheckInterval;

    const [payoutConnected, setPayoutConnected] = React.useState<boolean>(false);

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: payoutConnected ? Connected : Payment,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    };

    const location = useLocation();

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const [organizationConnectInfo, setOrganizationConnectInfo] = React.useState<Partial<OrganizationPayout>>({});

    const { groupId } = useParams<{ groupId: string }>();

    const [isDisconnectingStripe, setIsDisconnectingStripe] = React.useState<boolean>(false);

    const [showConfirmDisconnectStripeModal, setShowConfirmDisconnectStripeModal] = React.useState<boolean>(false);

    const history = useHistory();

    const { t } = useTranslation();

    const connectOrganizationGroupToStripe = async () => {
        let url = window.location.href;
        if (!url.includes('waitForUpdate')) {
            url = `${window.location.href}?waitForUpdate=true`;
        }

        const groupOrganizationConnectUrl = url;
        setIsLoading(true);
        const response = await connectStripe(group.id!, groupOrganizationConnectUrl);
        setIsLoading(false);

        if (response.success) {
            window.location.href = response.data.url;
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    const checkForOrganizationPayoutInformation = async () => {
        setIsLoading(true);
        const response = await checkForStripePayout(groupId);
        setIsLoading(false);

        if (response.success) {
            setOrganizationConnectInfo(response.data);
            if (response.data?.payoutsEnabled) {
                clearStatusCheckIntervalIfNeeded();
                setPayoutConnected(true);
            }
        }
    }

    const clearStatusCheckIntervalIfNeeded = () => {
        if (statusCheckInterval) clearInterval(statusCheckInterval);
    }

    const reCheckForOrganizationPayoutInformation = () => {
        statusCheckInterval = setInterval(() => {
            checkForOrganizationPayoutInformation();
        }, statusCheckEvery);
    }

    React.useEffect(() => {
        checkForOrganizationPayoutInformation();

        const params = new URLSearchParams(location.search);
        if (params.get('waitForUpdate') === 'true') {
            reCheckForOrganizationPayoutInformation();
        }

        return () => {
            clearStatusCheckIntervalIfNeeded();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (group.id && (group.groupType !== GroupTypes.ORGANIZATION || !group.isAdmin)) {
            history.push(`/groups/${groupId}`);
        }

        setPayoutConnected(group.stripePayoutsEnabled);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [group]);

    const removePayout = async () => {
        setIsDisconnectingStripe(true);
        const response = await disconnectStripe(groupId);
        setIsDisconnectingStripe(false);

        if (response.success) {
            toast.success(t(translations.group.successfully_disconnected_to_stripe));
            setPayoutConnected(false);
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    if (group.id) {
        if (payoutConnected) {
            return (
                <Wrapper>
                    <ConfirmModal
                        content={t(translations.group.are_you_sure_you_want_to_disconnect_stripe_payout)}
                        onCancel={()=> setShowConfirmDisconnectStripeModal(false)}
                        onOk={removePayout}
                        showModal={showConfirmDisconnectStripeModal}
                        title={t(translations.group.disconnect_stripe_payout)}
                        loading={isDisconnectingStripe}
                    />
                    <LottieWrapperNoMargin>
                        <Lottie
                            options={defaultOptions}
                            height={400}
                            width={400} />
                        <LottieMessage>
                            {t(translations.group.your_organization_payout_has_been_set_up)}<br />
                            <Button type="link" danger onClick={()=> setShowConfirmDisconnectStripeModal(true)}>{t(translations.group.remove_payout_connection)}</Button>
                        </LottieMessage>
                    </LottieWrapperNoMargin>

                    <Descriptions title={t(translations.group.connected_information)}>
                        <Descriptions.Item label={t(translations.group.charges_enabled)}>{String(organizationConnectInfo.chargesEnabled)}</Descriptions.Item>
                        <Descriptions.Item label={t(translations.group.payout_enabled)}> {String(organizationConnectInfo.payoutsEnabled)}</Descriptions.Item>
                    </Descriptions>
                </Wrapper>
            );
        }
    }

    return (
        <Wrapper>
            <LottieWrapperNoMargin>
                <Lottie
                    options={defaultOptions}
                    height={400}
                    width={400} />
                <LottieMessage>{t(translations.group.your_organization_has_not_set_up_payout)}</LottieMessage>
                <BorderedButton loading={isLoading} onClick={connectOrganizationGroupToStripe} type="primary">{t(translations.group.set_up_now)}</BorderedButton>
            </LottieWrapperNoMargin>
        </Wrapper >
    );
}


const LottieWrapperNoMargin = styled(LottieWrapper)`
    margin-top: 0 !important;
`;
const Wrapper = styled.div`
    margin-top: 15px;
    width: 100%;
    background: #fff;
    border-radius: 10px;
    border: 1px solid #eee;
    padding: 20px;
    padding-bottom: 40px;

    ${media.medium`
        width: 75%;
        margin-left: 15px;
    `}
`;
