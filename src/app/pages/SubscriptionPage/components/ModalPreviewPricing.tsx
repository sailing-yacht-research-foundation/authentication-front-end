import React from 'react';
import { Divider, Modal, Spin } from 'antd';
import { previewSwitchPlan, switchPlan } from 'services/live-data-server/subscription';
import { showToastMessageOnRequestError } from 'utils/helpers';
import styled from 'styled-components';
import moment from 'moment';
import { TIME_FORMAT } from 'utils/constants';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';

interface IModalPreviewPricing {
    showModal: boolean,
    setShowModal: Function,
    pricingId: string,
    reloadParent: Function
}

export const ModalPreviewPricing = (props: IModalPreviewPricing) => {

    const { t } = useTranslation();

    const { showModal, setShowModal, pricingId, reloadParent } = props;

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const [pricingDetail, setPricingDetail] = React.useState<any>({});

    React.useEffect(() => {
        if (pricingId)
            openPreviewSwitchPlan();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pricingId]);

    const openPreviewSwitchPlan = async () => {
        setIsLoading(true);
        const response = await previewSwitchPlan(pricingId);
        setIsLoading(false);

        if (response.success) {
            setPricingDetail(response.data);
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    const performSwitchPlan = async () => {
        setIsLoading(true);
        const response = await switchPlan(pricingId);
        setIsLoading(false);

        if (response.success) {
            reloadParent();
        } else {
            showToastMessageOnRequestError(response.error);
        }

        setShowModal(false);
    }

    return (
        <Modal
            title={t(translations.subscription_page.switching_plan_preview)}
            onCancel={() => setShowModal(false)}
            onOk={performSwitchPlan}
            confirmLoading={isLoading}
            visible={showModal}>
            <Spin spinning={isLoading}>
                <PricingItemWrapper>
                    {pricingDetail.items?.map(item => <>
                        <PricingItem>
                            <PricingItemTitle>{item.description}</PricingItemTitle>
                            <PricingItemPrice>${item.amount}</PricingItemPrice>
                        </PricingItem>
                        <Divider />
                    </>)}
                </PricingItemWrapper>
                <PricingTotalWrapper>
                    <PricingText><span>{t(translations.subscription_page.subtotal)}</span> <b>${pricingDetail.subtotal}</b></PricingText>
                    <PricingText><span>{t(translations.subscription_page.total)}</span> <TotalPriceText>${pricingDetail.total}</TotalPriceText></PricingText>
                    <PricingText><span>{t(translations.subscription_page.next_payment_attempt)}</span> <span>{moment(pricingDetail.nextPaymentAttempt).format(TIME_FORMAT.date_text_with_time)}</span></PricingText>
                    <PricingText><span>{t(translations.subscription_page.subscription_proration_date)}</span> <span>{moment(pricingDetail.subscriptionProrationDate).format(TIME_FORMAT.date_text_with_time)}</span></PricingText>
                </PricingTotalWrapper>
            </Spin>
        </Modal >
    )
}

const PricingItemWrapper = styled.div``;

const PricingItem = styled.div``;

const PricingItemTitle = styled.h3`
    font-size: 14px;
`;

const PricingItemPrice = styled.div`
    flex: 1;
    text-align: right;
`;

const PricingText = styled.p`
    display: flex;
    justify-content: space-between;
`;

const PricingTotalWrapper = styled.div``;

const TotalPriceText = styled.span`
    font-weight: bold;
    color: red;
    font-size: 16px;
`;