import React from 'react';
import { toast } from 'react-toastify';
import {
    subscribe as subscribeRace,
    unsubscribe as unsubscribeRace,
    checkForUserSubscribeStatus
} from 'services/streaming-server/expedition';
import { Spin, Modal, Button, Space } from 'antd';
import { MdAddComment } from 'react-icons/md';
import { AiFillInfoCircle } from 'react-icons/ai';
import { CreateButton } from 'app/components/SyrfGeneral';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import styled from 'styled-components';

export const ExpeditionServerActionButtons = (props) => {

    const { t } = useTranslation();

    const { competitionUnit } = props;

    const [subscribed, setSubscribed] = React.useState<boolean>(false);

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const [showUDPModal, setShowUDPModal] = React.useState<boolean>(false);

    const [udpDetail, setUdpDetail] = React.useState({
        ipAddress: {
            address: ''
        },
        port: ''
    });

    React.useEffect(() => {
        checkForSubscribeStatus();
    }, []);

    const subscribe = async () => {
        setIsLoading(true);
        const response = await subscribeRace(competitionUnit?.id);
        setIsLoading(false);

        if (response?.success) {
            setSubscribed(true);
            setShowUDPModal(true);
            setUdpDetail(response?.data?.udpServer);
        } else {
            toast.error('An error happened when unsubscribe this race.');
        }
    }

    const unsubscribe = async () => {
        setIsLoading(true);
        const response = await unsubscribeRace(competitionUnit?.id);
        setIsLoading(false);

        if (response?.success) {
            setSubscribed(false);
        } else {
            toast.error('An error happened when unsubscribe this race.');
        }

        setShowUDPModal(false);
    }

    const showUDPModalDetail = () => {
        setShowUDPModal(true);
    }

    const checkForSubscribeStatus = async () => {
        setIsLoading(true);
        const response = await checkForUserSubscribeStatus(competitionUnit?.id);
        setIsLoading(false);

        if (response?.success) {
            if (response?.data?.rows?.length > 0) setSubscribed(true);
        } else setSubscribed(false);
    }


    const copyToClipboard = (text) => {
        let input = document.createElement('input');
        document.body.appendChild(input);
        input.value = udpDetail?.ipAddress?.address + ':'+ udpDetail?.port;
        input.select();
        document.execCommand('copy', false);
        toast.info(t(translations.expedition_server_actions.copied_to_clipboard));
    }


    return (
        <>
            <Spin spinning={isLoading}>
                {!subscribed ? (
                    <CreateButton icon={<MdAddComment style={{ marginRight: '5px' }} />} onClick={subscribe} >{t(translations.expedition_server_actions.subscribe_stream_to_expedition)}</CreateButton>
                ) : (
                    <CreateButton icon={<AiFillInfoCircle  style={{ marginRight: '5px' }}/>} onClick={showUDPModalDetail} >{t(translations.expedition_server_actions.stream_to_expedition_detail)}</CreateButton>
                )}
            </Spin>
            <Modal
                title={t(translations.expedition_server_actions.stream_to_expedition_detail)}
                visible={showUDPModal}
                onCancel={() => setShowUDPModal(false)}
                footer={null}
            >
                <ModalBody>
                    <ModalUDPTitle><h4>{t(translations.expedition_server_actions.udp_ip)}</h4> {udpDetail?.ipAddress?.address}</ModalUDPTitle>
                    <ModalUDPTitle><h4>{t(translations.expedition_server_actions.udp_port)}</h4> {udpDetail?.port}</ModalUDPTitle>
                </ModalBody>
                <ModalButtonContainer>
                    <Space size={10}>
                        <Button onClick={copyToClipboard} type="primary">{t(translations.expedition_server_actions.copy)}</Button>
                        <Button onClick={unsubscribe}>{t(translations.expedition_server_actions.unsubscribe)}</Button>
                    </Space>
                </ModalButtonContainer>
            </Modal>
        </>
    )
}

const ModalBody = styled.div`
`;

const ModalUDPTitle = styled.div`
    dislay: block;

     > h4 {
         display: inline-block;
     } 
`;

const ModalButtonContainer = styled.div`
     margin-top: 15px;
     text-align: right;
`;