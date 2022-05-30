import React from 'react';
import styled from 'styled-components';
import { Table, Space, Spin, Tag, Button, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import Lottie from 'react-lottie';
import Invitation from '../assets/invitation.json'
import { translations } from 'locales/translations';
import { LottieMessage, LottieWrapper, TableWrapper } from 'app/components/SyrfGeneral';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { renderEmptyValue, renderTimezoneInUTCOffset, truncateName } from 'utils/helpers';
import { TIME_FORMAT } from 'utils/constants';
import { BiCheckCircle } from 'react-icons/bi';
import { MdRemoveCircle } from 'react-icons/md';
import { AcceptInvitationModal } from 'app/pages/MyEventPage/components/modals/AcceptInvitationModal';
import { getMyInvitedEvents } from 'services/live-data-server/participants';
import { RejectInviteRequestModal } from './modals/RejectInviteRequestModal';

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: Invitation,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export const InvitedEventLists = (props) => {

    const { t } = useTranslation();

    const { reloadInvitationCount } = props;

    const translate = {
        status_open_regis: t(translations.my_event_list_page.status_openregistration),
        status_public: t(translations.my_event_list_page.status_publicevent),
        status_private: t(translations.my_event_list_page.status_privateevent),
        anyone_canregist: t(translations.tip.anyone_can_register_event_and_tracking),
        anyone_canview: t(translations.tip.anyone_can_search_view_event),
        only_owner_canview: t(translations.tip.only_owner_cansearch_view_event)
    }

    const columns = [
        {
            title: t(translations.general.name),
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => {
                return <Tooltip title={record?.event.name}>
                    <Link to={`/events/${record?.event.id}`}>{truncateName(record?.event.name)}</Link>
                </Tooltip>;
            },
        },
        {
            title: 'Status',
            dataIndex: 'isOpen',
            key: 'isOpen',
            render: (isOpen, record) => {
                return (
                    <StatusContainer>
                        {record?.event.isOpen ? (
                            <Tooltip title={translate.anyone_canregist} color="blue">
                                <StyledTag >{translate.status_open_regis}</StyledTag>
                            </Tooltip>
                        ) : (
                        <Tooltip title={translate.only_owner_canview}>
                            <StyledTag >{translate.status_private}</StyledTag>
                        </Tooltip>
                        )}
                    </StatusContainer>
                );
            }
        },
        {
            title: t(translations.my_event_list_page.start_date),
            dataIndex: 'approximateStartTime',
            key: 'start_date',
            render: (value, record) => {
                if (record.event) {
                    return [moment(record.event.approximateStartTime).format(TIME_FORMAT.date_text_with_time), record.event.approximateStartTime_zone, renderTimezoneInUTCOffset(record?.event.approximateStartTime_zone)].filter(Boolean).join(' ')
                }

                return renderEmptyValue(null);
            }
        },
        {
            title: t(translations.my_event_list_page.invited_at),
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (value, record) => moment(record?.createdAt).format(TIME_FORMAT.date_text),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => {
                return <Space size="middle">
                    <Button type="primary" onClick={() => acceptInviteRequest(record)} icon={<BiCheckCircle style={{ marginRight: '5px' }} />}>
                        {t(translations.group.accept)}
                    </Button>
                    <Button onClick={() => rejectInviteRequest(record)} icon={<MdRemoveCircle style={{ marginRight: '5px' }} />} danger>
                        {t(translations.group.reject)}
                    </Button>
                </Space>;
            }
        },
    ];

    const [pagination, setPagination] = React.useState<any>({
        page: 1,
        total: 0,
        rows: [],
        size: 10
    });

    const [showRejectConfirmModal, setShowRejectConfirmModal] = React.useState<boolean>(false);

    const [showAcceptModal, setShowAcceptModal] = React.useState<boolean>(false);

    const [request, setRequest] = React.useState<any>({});

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const getInvitations = async (page, size) => {
        setIsLoading(true);
        const response = await getMyInvitedEvents(page, size);
        setIsLoading(false);

        if (response.success) {
            setPagination({
                ...pagination,
                page: page,
                total: response.data.count,
                rows: response.data.rows,
                size: response.data.size
            });
        }
    }

    React.useEffect(() => {
        getInvitations(1, 10);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onPaginationChanged = (page, size) => {
        getInvitations(page, size);
    }

    const acceptInviteRequest = (request) => {
        setRequest(request);
        setShowAcceptModal(true);
    }

    const rejectInviteRequest = (request) => {
        setRequest(request);
        setShowRejectConfirmModal(true);
    }

    const reloadParent = () => {
        getInvitations(pagination.page, pagination.size);
        reloadInvitationCount();
    }

    return (
        <>
            <AcceptInvitationModal reloadParent={reloadParent} request={request} showModal={showAcceptModal} setShowModal={setShowAcceptModal} />
            <RejectInviteRequestModal reloadParent={reloadParent} showModal={showRejectConfirmModal} setShowModal={setShowRejectConfirmModal} request={request} />
            {pagination.rows.length > 0 ? (
                <Spin spinning={isLoading}>
                    <TableWrapper>
                        <Table
                            scroll={{ x: "max-content" }}
                            columns={columns}
                            dataSource={pagination.rows}
                            pagination={{
                                defaultPageSize: 10,
                                current: pagination.page,
                                total: pagination.total,
                                pageSize: pagination.size,
                                onChange: onPaginationChanged,
                            }}
                        />
                    </TableWrapper>
                </Spin>
            ) : (
                <LottieWrapper>
                    <Lottie options={defaultOptions} height={400} width={400} />
                    <LottieMessage>{t(translations.my_event_list_page.you_dont_have_any_invitation)}</LottieMessage>
                </LottieWrapper>
            )}
        </>
    );
};

const StatusContainer = styled.div`
    max-width: 250px;
`;

const StyledTag = styled(Tag)`
    margin-top: 4px;
    margin-bottom: 4px;
`;