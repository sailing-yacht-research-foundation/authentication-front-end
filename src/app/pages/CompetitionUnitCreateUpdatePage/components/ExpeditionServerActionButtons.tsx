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

export const ExpeditionServerActionButtons = (props) => {

    const { t } = useTranslation();

    const { competitionUnit } = props;

    const [subscribed, setSubscribed] = React.useState<boolean>(false);

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const [showUDPModal, setShowUDPModal] = React.useState<boolean>(false);

    const lastSubscribedCompetitionUnitId = useSelector(selectLastSubscribedCompetitionUnitId);

    const lastSubscribedCompetitionUnitIdRef = React.useRef<string>(lastSubscribedCompetitionUnitId);

    const { actions } = useCompetitionUnitManagerSlice();

    const dispatch = useDispatch();

    const [udpDetail, setUdpDetail] = React.useState<any>({
        ipAddress: {
            address: ''
        },
        port: ''
    });

    const [lastMessage, setLastMessage] = React.useState({
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

    React.useEffect(() => {
        checkForSubscribeStatus();
        window.onbeforeunload = onWindowClose;
        return () => {
            window.onbeforeunload = null;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onWindowClose = (e) => {
        if (lastSubscribedCompetitionUnitIdRef.current) {
            unsubscribe();
            return t(translations.expedition_server_actions.are_you_sure_you_want_to_leave);
        }

        return null;
    }

    // update subscribe status of invidiual button on pages after unsubscribe using nav connection button.
    React.useEffect(() => {
        if (previousValue?.lastSubscribedCompetitionUnitId && !lastSubscribedCompetitionUnitId &&
            previousValue?.lastSubscribedCompetitionUnitId === competitionUnit?.id
        ) {
            setSubscribed(false);
        }

        lastSubscribedCompetitionUnitIdRef.current = lastSubscribedCompetitionUnitId;
    }, [lastSubscribedCompetitionUnitId]);

    const getExpeditionByCompetitionUnit = async () => {
        const response = await getExpeditionByCompetitionUnitId(competitionUnit?.id || lastSubscribedCompetitionUnitIdRef.current);

        if (response.success) {
            setLastMessage(response?.data?.lastPing);
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
            toast.error(t(translations.expedition_server_actions.an_error_happened_when_subscribe_this_race));
        }
    }

    const unsubscribe = async () => {
        setIsLoading(true);
        const response = await unsubscribeRace(competitionUnit?.id || lastSubscribedCompetitionUnitIdRef.current);
        setIsLoading(false);

        if (response?.success) {
            setSubscribed(false);
            dispatch(actions.setLastSubscribedCompetitionUnitId(''));
        } else {
            toast.error(t(translations.expedition_server_actions.an_error_happened_when_unsubscribe_this_race));
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
            toast.error(t(translations.expedition_server_actions.an_error_happened_when_getting_udp_server_detail))
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
            <Spin spinning={isLoading}>
                {!subscribed && competitionUnit ? (<CreateButton icon={<MdAddComment style={{ marginRight: '5px' }} />} onClick={subscribe} >{t(translations.expedition_server_actions.subscribe_stream_to_expedition)}</CreateButton>) : (
                    competitionUnit ? (<CreateButton icon={<AiFillInfoCircle style={{ marginRight: '5px' }} />} onClick={showUDPModalDetail} >{t(translations.expedition_server_actions.stream_to_expedition_detail)}</CreateButton>) : (
                        (<StyledConnectionButton onClick={() => showUDPModalDetail()} style={{ fontSize: '30px' }} />)
                    )
                )}
            </Spin>
            <Modal
                title={t(translations.expedition_server_actions.stream_to_expedition_detail)}
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
                        lastMessage?.message && <ModalUDPTitle>
                            {t(translations.expedition_server_actions.last_message)} {lastMessage?.message}{t(translations.expedition_server_actions.from)} {lastMessage?.from?.ipAddress}{t(translations.expedition_server_actions.at)} {moment(lastMessage.timestamp).format(TIME_FORMAT.date_text_with_time)}
                        </ModalUDPTitle>
                    }
                </ModalBody>
                <ModalButtonContainer>
                    <Space size={10}>
                        <Button onClick={unsubscribe}>{t(translations.expedition_server_actions.unsubscribe)}</Button>
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