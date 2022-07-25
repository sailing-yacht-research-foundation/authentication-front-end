import { BorderedButton, LottieMessage } from 'app/components/SyrfGeneral';
import React from 'react';
import { getPlans, getCustomerPortalLink, checkout, cancelPlan, getUserActivePlan } from 'services/live-data-server/subscription';
import styled from 'styled-components';
import { media } from 'styles/media';
import { Plan, Pricing } from 'types/Plan';
import Lottie from 'react-lottie';
import CustomerPortal from '../assets/customer-portal.json';
import { useTranslation } from 'react-i18next';
import { Spin } from 'antd';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { ProfileTabs } from 'app/pages/ProfilePage/components/ProfileTabs';
import { ConfirmModal } from 'app/components/ConfirmModal';
import { toast } from 'react-toastify';
import { translations } from 'locales/translations';
import { ModalPreviewPricing } from './ModalPreviewPricing';
import { TIME_FORMAT } from 'utils/constants';
import moment from 'moment';
interface ActivePlan {
    status: string;
    tierCode: string;
    tierName: string;
    productId: string;
    pricingId: string;
    interval: string;
    intervalCount: number;
    cancelAt: number;
}

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

    const [currentActivePlan, setCurrentActivePlan] = React.useState<Partial<ActivePlan>>({});

    const [showCancelSubscriptionModal, setShowCancelSubscriptionModal] = React.useState<boolean>(false);

    const [showPreviewModal, setShowPreviewModal] = React.useState<boolean>(false);

    const [isPerformingCancelPlan, setIsPerformingCancelPlan] = React.useState<boolean>(false);

    const [plans, setPlans] = React.useState<Plan[]>([]);

    const [selectedPricingId, setSelectedPricingId] = React.useState<string>('');

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

    const performCheckout = async (pricingId: string) => {
        if (isCheckingOut) return;

        setIsCheckingOut(true);
        const response = await checkout(pricingId);
        setIsCheckingOut(false);

        if (response.success) {
            window.location.href = response.data.url;
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    React.useEffect(() => {
        getSyrfPlans();
        getCustomerPortal();
        getActivePlan();
    }, []);

    const performCancelSubscription = async () => {
        setIsPerformingCancelPlan(true);
        const response = await cancelPlan();
        setIsPerformingCancelPlan(false);

        if (response.success) {
            if (response.data.cancelAtPeriodEnd) {
                toast.success(t(translations.subscription_page.your_subscription_will_be_cancelled_at_the_period_end));
            } else {
                toast.success(t(translations.general.your_action_is_successful));
            }
            getActivePlan();
        } else {
            showToastMessageOnRequestError(response.error);
        }

        setShowCancelSubscriptionModal(false);
    }

    const getActivePlan = async () => {
        const response = await getUserActivePlan();

        if (response.success) {
            setCurrentActivePlan(response.data);
        }
    }

    const performCheckoutOrCancelPlan = (pricingId: string) => {
        if (isPricingActive(pricingId)) {
            setShowCancelSubscriptionModal(true);
        } else {
            if (currentActivePlan.productId) {
                openPreviewSwitchPlan(pricingId);
            } else {
                performCheckout(pricingId);
            }
        }
    }

    const isPricingActive = (pricingId: string) => {
        return pricingId === currentActivePlan.pricingId;
    }

    const isPlanActive = (productId: string) => {
        return productId === currentActivePlan.productId;
    }

    const openPreviewSwitchPlan = (pricingId: string) => {
        setShowPreviewModal(true);
        setSelectedPricingId(pricingId);
    }

    const renderPlanButton = (plan: Plan, pricing: Pricing) => {
        if (!isPricingActive(pricing.id)) {
            return <BorderedButton
                type={!isPlanActive(plan.productId) ? 'primary' : undefined}
                onClick={() => performCheckoutOrCancelPlan(pricing.id)}
            >{t(currentActivePlan.pricingId ? translations.general.switch : translations.general.subscribe)}</BorderedButton>
        } else if (isPricingActive(pricing.id) && !currentActivePlan.cancelAt) {
            return <BorderedButton
                onClick={() => performCheckoutOrCancelPlan(pricing.id)}
                className={'cancelable'}
            >{t(translations.general.cancel)}</BorderedButton>
        }

        return <></>;
    }

    const renderPlans = () => {
        if (plans.length > 0)
            return plans.map((p, index) => (
                <PlanItem key={index} className={isPlanActive(p.productId) ? 'active' : ''}>
                    <PlanItemHeader>
                        <PlanItemTitle>
                            <PlanTitle>{p.tierName}</PlanTitle>
                            <PlanSubTitle>{p.description}</PlanSubTitle>
                            {isPlanActive(p.productId) && currentActivePlan.cancelAt && <div>{t(translations.subscription_page.expire_at)} {moment(currentActivePlan.cancelAt).format(TIME_FORMAT.date_text_with_time)}</div>}
                        </PlanItemTitle>
                        <PlanItemPriceWrapper>
                            {
                                p.pricings.length > 0 && p.pricings.map((pricing, index) =>
                                    <PlanItemPrice key={index}>
                                        <div>
                                            <PriceText>${pricing.amount}/</PriceText>
                                            <span>{pricing.recurring.intervalCount} {pricing.recurring.interval}</span>
                                        </div>
                                        <div>
                                            {renderPlanButton(p, pricing)}
                                        </div>
                                    </PlanItemPrice>)
                            }
                        </PlanItemPriceWrapper>
                    </PlanItemHeader>
                </PlanItem>));

        return <NoPlanText>{t(translations.subscription_page.we_dont_have_any_plans_right_now)}</NoPlanText>
    }

    return (
        <OuterWrapper>
            <ModalPreviewPricing
                setShowModal={setShowPreviewModal}
                pricingId={selectedPricingId}
                reloadParent={getActivePlan}
                showModal={showPreviewModal} />
            <ConfirmModal
                loading={isPerformingCancelPlan}
                showModal={showCancelSubscriptionModal}
                content={t(translations.subscription_page.are_you_sure_you_want_to_cancel_subscription)}
                title={t(translations.subscription_page.cancel_subscription)}
                onOk={performCancelSubscription}
                onCancel={() => setShowCancelSubscriptionModal(false)}
            />
            <ProfileTabs />
            <Wrapper>
                <SectionWrapper>
                    <SectionTitle>{t(translations.subscription_page.plans)}</SectionTitle>
                    <Spin spinning={isLoading}>
                        <PlanWrapper>
                            {renderPlans()}
                        </PlanWrapper>
                    </Spin>
                </SectionWrapper>
                <SectionWrapper>
                    <SectionTitle>{t(translations.subscription_page.customer_portal)}</SectionTitle>
                    <LottieWrapper>
                        <Lottie
                            options={defaultOptions}
                            height={400}
                            width={400} />
                        <LottieMessage>{t(translations.subscription_page.customer_portal_is_where)}</LottieMessage>
                        {<BorderedButton onClick={openCustomerPortal} disabled={!portalLink} type="primary">{t(translations.subscription_page.go_to_my_portal)}</BorderedButton>}
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
        h3, span, div {
            color: #fff;
        }
        button span {
            color: #6D79F3 !important;
        }
        .preview span {
            color: #fff !important;
        }

        button.cancelable {
            background: #DC6E1E;
            span {
                color: #fff !important;
            }
        }
    }
`;

const PlanItemHeader = styled.div`
    display: flex;
    flex-direction: column;
`;

const PlanTitle = styled.h3`
    margin: 0;
    padding: 0;
    font-size: 18px;
`;

const PlanItemTitle = styled.div`

`;

const PlanItemPrice = styled.div`
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
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

const PlanItemPriceWrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin-top: 10px;
`;
