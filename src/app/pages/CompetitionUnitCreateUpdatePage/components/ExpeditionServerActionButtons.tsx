import React from 'react';
import { toast } from 'react-toastify';
import {
    subscribe as subscribeRace,
    unsubscribe as unsubscribeRace,
    checkForUserSubscribeStatus,
    getUDPServerDetail,
    getExpeditionByCompetitionUnitId
} from 'services/streaming-server/expedition';
import { Spin, Modal, Button, Space, Image, Divider } from 'antd';
import { ImConnection } from 'react-icons/im';
import { AiFillInfoCircle } from 'react-icons/ai';
import { CreateButton } from 'app/components/SyrfGeneral';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import styled from 'styled-components';
import { media } from 'styles/media';
import CheckList from '../assets/checklist.png';
import moment from 'moment';
import { TIME_FORMAT } from 'utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { selectLastSubscribedCompetitionUnitId } from '../slice/selectors';
import { useCompetitionUnitManagerSlice } from '../slice';
import { StyleConstants } from 'styles/StyleConstants';
import { MdAddComment } from 'react-icons/md';
import { SYRF_SERVER } from 'services/service-constants';
import { selectSessionToken } from 'app/pages/LoginPage/slice/selectors';
import 'whatwg-fetch';
import useWebSocket from "react-use-websocket";
import { message } from 'antd';
import { showToastMessageOnRequestError } from 'utils/helpers';

export const ExpeditionServerActionButtons = (props) => {

    const streamUrl = `${process.env.REACT_APP_SYRF_STREAMING_SERVER_SOCKETURL}`;

    const sessionToken = useSelector(selectSessionToken);

    const { lastMessage } = useWebSocket(
        `${streamUrl}/authenticate?session_token=${sessionToken}`, {
        shouldReconnect: () => true
    }
    );

    const { t } = useTranslation();

    const { competitionUnit } = props;

    const [subscribed, setSubscribed] = React.useState<boolean>(false);

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const [showUDPModal, setShowUDPModal] = React.useState<boolean>(false);

    const lastSubscribedCompetitionUnitId = useSelector(selectLastSubscribedCompetitionUnitId);

    const lastSubscribedCompetitionUnitIdRef = React.useRef<string>(lastSubscribedCompetitionUnitId);

    const sessionTokenRef = React.useRef<string>(sessionToken);

    const showedConnectedMessage = React.useRef<boolean>(false);

    const { actions } = useCompetitionUnitManagerSlice();

    const dispatch = useDispatch();

    const [udpDetail, setUdpDetail] = React.useState<any>({
        ipAddress: {
            address: ''
        },
        port: ''
    });

    const [lastPingMessage, setLastPingMessage] = React.useState({
        message: '',
        from: {
            ipAddress: ''
        },
        timestamp: Date.now()
    });

    const usePrevious = <T extends unknown>(value: T): T | undefined => {
        const ref = React.useRef<T>();
        React.useEffect(() => {
            ref.current = value;
        });
        return ref.current;
    }

    const previousValue = usePrevious<{ lastSubscribedCompetitionUnitId: string }>({ lastSubscribedCompetitionUnitId });

    // Listen last message from web socket
    React.useEffect(() => {
        handleMessageFromWebsocket(lastMessage?.data)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lastMessage]);


    React.useEffect(() => {
        checkForSubscribeStatus();
        window.onbeforeunload = onWindowClose;
        window.onunload = onWindowClose;
        return () => {
            window.onbeforeunload = null;
            window.onunload = null;

            if (!competitionUnit) {
                unsubscribe(lastSubscribedCompetitionUnitIdRef?.current);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onWindowClose = (e) => {
        if (lastSubscribedCompetitionUnitIdRef.current) {
            fetch(`${SYRF_SERVER.STREAMING_SERVER}${SYRF_SERVER.API_VERSION}/expedition/unsubscribe`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + sessionToken
                },
                body: JSON.stringify({
                    competitionUnitId: lastSubscribedCompetitionUnitIdRef.current
                }),
                keepalive: true // this is important!
            })
        }

        return null;
    }

    React.useEffect(() => {
        // update subscribe status of invidiual button on pages after unsubscribe using nav connection button.
        if (previousValue?.lastSubscribedCompetitionUnitId
            && !lastSubscribedCompetitionUnitId
            && previousValue?.lastSubscribedCompetitionUnitId
            === competitionUnit?.id) {
            setSubscribed(false);
        }

        // unsubscribe all previous races
        if (competitionUnit
            && competitionUnit?.id
            === previousValue?.lastSubscribedCompetitionUnitId
            && subscribed) {
            unsubscribe(competitionUnit?.id);
        }

        lastSubscribedCompetitionUnitIdRef.current = lastSubscribedCompetitionUnitId;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lastSubscribedCompetitionUnitId]);

    const handleMessageFromWebsocket = (data) => {
        let formattedData: any = {};
        if (!data) return;

        try {
            formattedData = JSON.parse(data);
        } catch (e) {
            console.error(e);
            message.error(t(translations.expedition_server_actions.error_when_handling_received_ping));
            return;
        }

        if (formattedData.type !== 'data'
            && formattedData.dataType !== 'expedition-ping-update') return;

        setLastPingMessage({
            ...lastPingMessage,
            from: {
                ipAddress: formattedData?.data?.from
            },
            message: formattedData?.data?.message,
            timestamp: formattedData?.data?.timestamp
        });

        if (!competitionUnit && !showedConnectedMessage.current) {
            showedConnectedMessage.current = true;
            message.success(t(translations.expedition_server_actions.stream_to_expedition_connected));
        }
    }

    const getExpeditionByCompetitionUnit = async () => {
        const response = await getExpeditionByCompetitionUnitId(competitionUnit?.id || lastSubscribedCompetitionUnitIdRef.current);

        if (response.success) {
            setLastPingMessage(response?.data?.lastPing);
        }
    }

    const subscribe = async () => {
        setIsLoading(true);
        const response = await subscribeRace(competitionUnit?.id);
        setIsLoading(false);

        if (response?.success) {
            setSubscribed(true);
            showUDPModalDetail();
            dispatch(actions.setLastSubscribedCompetitionUnitId(competitionUnit?.id));
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    const unsubscribe = async (competitionUnitId) => {
        setIsLoading(true);
        const response = await unsubscribeRace(competitionUnitId, sessionTokenRef.current);
        setIsLoading(false);

        if (response?.success) {
            setSubscribed(false);
            if (competitionUnitId === lastSubscribedCompetitionUnitId)
                dispatch(actions.setLastSubscribedCompetitionUnitId(''));
        } else {
            showToastMessageOnRequestError(response.error);
        }

        setShowUDPModal(false);
    }

    const showUDPModalDetail = async () => {
        setIsLoading(true);
        const response = await getUDPServerDetail();
        setIsLoading(false);

        if (response.success) {
            setUdpDetail(response.data);
            setShowUDPModal(true);
            getExpeditionByCompetitionUnit();
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    const checkForSubscribeStatus = async () => {
        setIsLoading(true);
        const response = await checkForUserSubscribeStatus(competitionUnit?.id || lastSubscribedCompetitionUnitIdRef.current);
        setIsLoading(false);

        if (response?.success) {
            if (response?.data?.rows?.length > 0) setSubscribed(true);
        } else setSubscribed(false);
    }


    const copyToClipboard = (text) => {
        let input = document.createElement('input');
        document.body.appendChild(input);
        input.value = text;
        input.select();
        document.execCommand('copy', false);
        toast.info(t(translations.expedition_server_actions.copied_to_clipboard));
        document.body.removeChild(input);
    }

    return (
        <Wrapper>
            {competitionUnit ? (
                <Spin spinning={isLoading}>
                    {!subscribed ? (<CreateButton icon={<MdAddComment style={{ marginRight: '5px' }} />} onClick={subscribe} >{t(translations.expedition_server_actions.stream_to_expedition)}</CreateButton>) : (<CreateButton icon={<AiFillInfoCircle style={{ marginRight: '5px' }} />} onClick={showUDPModalDetail} >{t(translations.expedition_server_actions.stream_to_expedition)}</CreateButton>)}
                </Spin>) : (
                lastPingMessage?.from?.ipAddress && <Spin spinning={isLoading}>
                    <StyledConnectionButton onClick={() => showUDPModalDetail()} style={{ fontSize: '30px' }} />
                </Spin>
            )}
            <Modal
                title={t(translations.expedition_server_actions.stream_to_expedition)}
                visible={showUDPModal}
                onCancel={() => setShowUDPModal(false)}
                footer={null}
            >
                <ModalBody>
                    <StyledUl style={{ listStyleType: 'upper-greek' }}>
                        <li>{t(translations.expedition_server_actions.check_list_1)}
                            <StyledUl style={{ listStyleType: 'none' }}>
                                <li> {t(translations.expedition_server_actions.check_list_1_1)}</li>
                            </StyledUl>
                        </li>

                        <li>{t(translations.expedition_server_actions.check_list_2)}</li>

                        <li>{t(translations.expedition_server_actions.check_list_3)}</li>

                        <li>{t(translations.expedition_server_actions.check_list_4)}</li>

                        <li>{t(translations.expedition_server_actions.check_list_5)}</li>

                        <li>{t(translations.expedition_server_actions.check_list_6)}</li>

                        <li>{t(translations.expedition_server_actions.check_list_7)}</li>
                    </StyledUl>
                    <Image src={CheckList} />

                    <Divider />

                    <ModalUDPTitle>
                        <ItemTitle>
                            {t(translations.expedition_server_actions.udp_ip)} <b>{udpDetail?.ipAddress?.address}</b>
                        </ItemTitle>
                        <Button onClick={() => copyToClipboard(udpDetail?.ipAddress?.address)} shape={"round"} type="primary">{t(translations.expedition_server_actions.copy)}</Button>
                    </ModalUDPTitle>

                    <ModalUDPTitle>
                        <ItemTitle>
                            {t(translations.expedition_server_actions.udp_port)} <b>{udpDetail?.port}</b>
                        </ItemTitle>
                        <Button onClick={() => copyToClipboard(udpDetail?.port)} shape={"round"} type="primary">{t(translations.expedition_server_actions.copy)}</Button>
                    </ModalUDPTitle>
                    {
                        lastPingMessage?.message && <ModalUDPTitle>
                            {t(translations.expedition_server_actions.last_message)} {lastPingMessage?.message}{t(translations.expedition_server_actions.from)} {lastPingMessage?.from?.ipAddress}{t(translations.expedition_server_actions.at)} {moment(lastPingMessage.timestamp).format(TIME_FORMAT.date_text_with_time)}
                        </ModalUDPTitle>
                    }
                </ModalBody>
                <ModalButtonContainer>
                    <Space size={10}>
                        <Button onClick={() => unsubscribe(competitionUnit?.id || lastSubscribedCompetitionUnitIdRef?.current)}>{t(translations.expedition_server_actions.unsubscribe)}</Button>
                    </Space>
                </ModalButtonContainer>
            </Modal>
        </Wrapper>
    )
}

const StyledUl = styled.ul`
    padding-left: 15px;
`;

const Wrapper = styled.div`
    display: none;

    ${media.large`
        display: block !important;
    `}
`;

const ModalBody = styled.div`
`;

const ItemTitle = styled.div`
    flex: .8;
`;

const ModalUDPTitle = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 15px;

     > h4 {
         display: inline-block;
     } 
`;

const ModalButtonContainer = styled.div`
     margin-top: 15px;
     text-align: right;
`;

const StyledConnectionButton = styled(ImConnection)`
     color: #1890ff;
     font-size: 25px;
     margin: 0 15px;
     cursor: pointer;

     &:hover {
        color: ${StyleConstants.MAIN_TONE_COLOR};
     }
`;