import { BorderedButton, LottieMessage } from 'app/components/SyrfGeneral';
import React from 'react';
import { getPlans, getCustomerPortalLink, checkout } from 'services/live-data-server/subscription';
import styled from 'styled-components';
import { media } from 'styles/media';
import { StyleConstants } from 'styles/StyleConstants';
import { Plan } from 'types/Plan';
import Lottie from 'react-lottie';
import CustomerPortal from '../assets/customer-portal.json';
import { useTranslation } from 'react-i18next';
import { Spin, Button } from 'antd';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { ProfileTabs } from 'app/pages/ProfilePage/components/ProfileTabs';

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: CustomerPortal,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export const Main = () => {

    const { t } = useTranslation();

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const [portalLink, setCustomerPortalLink] = React.useState<string>('');

    const [isCheckingOut, setIsCheckingOut] = React.useState<boolean>(false);

    const [plans, setPlans] = React.useState<Plan[]>([]);

    const getSyrfPlans = async () => {
        setIsLoading(true);
        const response = await getPlans();
        setIsLoading(false);

        if (response.success) {
            setPlans(response.data);
        }
    }

    const getCustomerPortal = async () => {
        setIsLoading(true);
        const response = await getCustomerPortalLink();
        setIsLoading(false);

        if (response.success) {
            setCustomerPortalLink(response.data.url);
        }
    }

    const openCustomerPortal = () => {
        if (!portalLink) return;

        window.open(portalLink, '_blank');
    }

    const performCheckout = async (pricingId: string, quantity: number = 1) => {
        if (isCheckingOut) return;

        setIsCheckingOut(true);
        const response = await checkout(pricingId, quantity);
        setIsCheckingOut(false);

        if (response.success) {
            window.open(response.data.url, '_blank');
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    React.useEffect(() => {
        getSyrfPlans();
        getCustomerPortal();
    }, []);

    const renderPlans = () => {
        if (plans.length > 0)
            return plans.map((p, index) => (<PlanItem className={index % 2 == 0 ? '' : 'active'}>
                <PlanItemHeader>
                    <PlanItemTitle>
                        <PlanTitle>{p.tierName}</PlanTitle>
                        <PlanSubTitle>{p.description}</PlanSubTitle>
                    </PlanItemTitle>
                    {
                        p.pricings.length > 0 && <PlanItemPrice>
                            <PriceText>${p.pricings[0].amount}/</PriceText><span>{p.pricings[0].recurring.intervalCount} {p.pricings[0].recurring.interval}</span>
                        </PlanItemPrice>
                    }
                </PlanItemHeader>
                {
                    index % 2 == 0 ? (<PlanItemContent>
                        <BorderedButton onClick={() => performCheckout(p.pricings[0].id, 1)} type='primary'>Upgrade</BorderedButton>
                        <Button type='link'>Learn more about this plan</Button>
                    </PlanItemContent>) : (<PlanItemContent>
                        <BorderedButton>Cancel Subscription</BorderedButton>
                    </PlanItemContent>)
                }
            </PlanItem>));

        return <NoPlanText>We don't have any plans right now.</NoPlanText>
    }

    return (
        <OuterWrapper>
            <ProfileTabs/>
            <Wrapper>
                <SectionWrapper>
                    <SectionTitle>Plans</SectionTitle>
                    <Spin spinning={isLoading}>
                        <PlanWrapper>
                            {renderPlans()}
                        </PlanWrapper>
                    </Spin>
                </SectionWrapper>
                <SectionWrapper>
                    <SectionTitle>Customer Portal</SectionTitle>
                    <LottieWrapper>
                        <Lottie
                            options={defaultOptions}
                            height={400}
                            width={400} />
                        <LottieMessage>Customer portal is where you can see your purchase history, current active plan, payment method and manage subscription.</LottieMessage>
                        {<BorderedButton onClick={openCustomerPortal} disabled={!portalLink} type="primary">Go to my portal</BorderedButton>}
                    </LottieWrapper>
                </SectionWrapper>
            </Wrapper>
        </OuterWrapper>
    )
}

const OuterWrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 132px;
    align-items: center;
    width: 100%;
    position: relative;
    padding-bottom: 50px;
`;

const SectionTitle = styled.h2``;

const SectionWrapper = styled.div`
    &:not(:first-child) {
        margin-top: 30px;
    }
`;

const Wrapper = styled.div`
    width: 100%;
    background: #fff;
    margin-top: 30px;
    padding: 10px;
    border-radius: 5px;
    padding-bottom: 30px;

    ${media.large`
        padding: 30px 25px;
        width: 75%;
    `}; 
`;

const PlanWrapper = styled.div`
    display: flex;
    padding: 25px 0;
    flex-direction: column;

    ${media.medium`
        flex-direction: row;
    `}
`;

const PlanItem = styled.div`
    width: 100%;
    padding: 15px;
    border-radius: 5px;
    margin: 0 5px;
    border: 1px solid rgba(52, 152, 219, 1);
    
    &:not(:first-child) {
        margin-top: 10px;
    }

    ${media.medium`
        width: 33.3333%;

        &:not(:first-child) {
            margin-top: 0;
        }
    `}

    &.active {
        background-color: #6D79F3;
        h3, span {
            color: #fff;
        }
        button span {
            color: #6D79F3 !important;
        }
    }

`;

const PlanItemHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const PlanTitle = styled.h3`
    margin: 0;
    padding: 0;
    font-size: 18px;
`;

const PlanItemTitle = styled.div`

`;

const PlanItemPrice = styled.span`

`;

const PriceText = styled.span`
    font-weight: 500;
    font-size: 18px;
`;

const PlanSubTitle = styled.span`
    color: #646d7d;
`;

const LottieWrapper = styled.div`
    text-align: center;
    margin-top: 15px;

    > div {
        width: 100% !important;
        height: auto !important;
    }

    ${media.medium`
        > div {
            width: 350px !important;
        }
    `}
`;

const NoPlanText = styled.span`
    text-align: center;
`;

const PlanItemContent = styled.div`
    padding-top: 30px;
    padding-bottom: 10px;
    display: flex;
`;