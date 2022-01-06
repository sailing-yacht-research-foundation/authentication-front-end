import React from 'react';
import { Dropdown, Space, Spin, Table, Menu } from 'antd';
import { CreateButton, DeleteButton, PageHeaderContainer, PageHeaderTextSmall, TableWrapper } from 'app/components/SyrfGeneral';
import { AiFillPlusCircle } from 'react-icons/ai';
import { getAllByCalendarEventIdWithFilter } from 'services/live-data-server/participants';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { DeleteParticipantModal } from 'app/pages/ParticipantCreateUpdatePage/components/DeleteParticipantForm';
import styled from 'styled-components';
import { DownOutlined } from '@ant-design/icons';
import ReactTooltip from 'react-tooltip';
import { CompetitorInviteModal } from './modals/CompetitorInviteModal';
import { renderEmptyValue } from 'utils/helpers';
import { EventState, ParticipantInvitationStatus } from 'utils/constants';
import { Link } from 'react-router-dom';
import { renderAvatar } from 'utils/user-utils';
import { BlockParticipantConfirmModal } from 'app/pages/MyEventPage/components/modals/BlockParticipantConfirmModal';

const FILTER_MODE = {
    assigned: 'assigned',
    unassigned: 'unassigned',
    all: 'all'
}

export const ParticipantList = (props) => {

    const { t } = useTranslation();

    const { eventId, event } = props;

    const columns = [
        {
            title: t(translations.participant_list.public_name),
            dataIndex: 'publicName',
            key: 'publicName',
            render: (text, record) => <UserWrapper>
                <AvatarWrapper>
                    <img className="avatar-img" alt={text} src={renderAvatar(record?.profile?.avatar)} />
                </AvatarWrapper>
                {record?.userProfileId ? <Link to={`/profile/${record?.userProfileId}`}>{text}</Link> : text}
            </UserWrapper>,
        },
        {
            title: 'Boat Name',
            dataIndex: 'vesselName',
            key: 'vesselName',
            render: (text, record) => {
                return renderAssignedVessels(record);
            },
            ellipsis: true,
        },
        {
            title: t(translations.participant_list.status),
            dataIndex: 'invitationStatus',
            key: 'invitationStatus',
            render: (text, record) => {
                return record?.invitationStatus;
            },
            ellipsis: true,
        },
        {
            title: t(translations.participant_list.class_name),
            dataIndex: 'vesselName',
            key: 'vesselName',
            render: (text, record) => {
                return renderEmptyValue(record?.vesselParticipants[0]?.group?.name);
            },
            ellipsis: true,
        },
        {
            title: t(translations.participant_list.action),
            key: 'action',
            fixed: true,
            render: (text, record) => (
                <Space size={10}>
                    <DeleteButton onClick={() => showDeleteParticipanModal(record)} danger>{t(translations.participant_list.remove)}</DeleteButton>
                    {record?.invitationStatus !== ParticipantInvitationStatus.BLOCKED && <DeleteButton onClick={() => showBlockParticipant(record)} danger>{t(translations.participant_list.block)}</DeleteButton>}
                </Space>
            ),
        },
    ];

    const menu = (
        <Menu>
            <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="/" onClick={e => filterParticipants(e, FILTER_MODE.all)}>
                    {t(translations.participant_list.all)}
                </a>
            </Menu.Item>
            <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="/" onClick={e => filterParticipants(e, FILTER_MODE.assigned)}>
                    {t(translations.participant_list.assigned)}
                </a>
            </Menu.Item>
            <Menu.Item>
                <a target="_blank" rel="noopener noreferrer" href="/" onClick={e => filterParticipants(e, FILTER_MODE.unassigned)}>
                    {t(translations.participant_list.unassigned)}
                </a>
            </Menu.Item>
        </Menu>
    );

    const [pagination, setPagination] = React.useState<any>({
        page: 1,
        total: 0,
        rows: []
    });

    const [participant, setParticipant] = React.useState<any>({});

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

    const [showInviteModal, setShowInviteModal] = React.useState<boolean>(false);

    const [showBlockParticipantModal, setShowBlockParticipantModal] = React.useState<boolean>(false);

    const [filterMode, setFilterMode] = React.useState<string>(FILTER_MODE.all);

    const filterParticipants = (e, mode) => {
        e.preventDefault();
        setFilterMode(mode);
        getAllByFilter(pagination.page, mode);
    }

    const getAllByFilter = async (page, mode) => {
        setIsLoading(true);
        const response = await getAllByCalendarEventIdWithFilter(eventId, page, mode);
        setIsLoading(false);

        if (response.success) {
            setPagination({
                ...pagination,
                rows: response.data?.rows,
                page: page,
                total: response.data?.count
            });
        }
    }

    const showDeleteParticipanModal = (participant) => {
        setShowDeleteModal(true);
        setParticipant(participant);
    }

    const onPaginationChanged = (page) => {
        getAllByFilter(page, filterMode);
    }

    const onParticipantDeleted = () => {
        getAllByFilter(pagination.page, filterMode);
    }

    const showBlockParticipant = (participant) => {
        setParticipant(participant);
        setShowBlockParticipantModal(true);
    }

    const renderAssignedVessels = (participant) => {
        const vesselParticipants = participant.vesselParticipants;
        if (vesselParticipants
            && vesselParticipants.length > 0) {
            return vesselParticipants?.map((vp, index) => {
                if (vp.vessel) {
                    if (index !== (vesselParticipants.length - 1))
                        return vp.vessel?.publicName + ', ';
                    return vp.vessel?.publicName;
                }
                return t(translations.misc.not_available);
            });
        }

        return t(translations.misc.not_available);
    }

    React.useEffect(() => {
        if (!showInviteModal) {
            getAllByFilter(pagination.page, filterMode);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showInviteModal]);

    return (
        <>
            <CompetitorInviteModal eventId={eventId} showModal={showInviteModal} setShowModal={setShowInviteModal} />
            <DeleteParticipantModal
                participant={participant}
                onParticipantDeleted={onParticipantDeleted}
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
            />
            <BlockParticipantConfirmModal reloadParent={() => getAllByFilter(pagination.page, filterMode)} participant={participant} showModal={showBlockParticipantModal} setShowModal={setShowBlockParticipantModal} />
            <Spin spinning={isLoading}>
                <PageHeaderContainer>
                    <PageHeaderTextSmall>{t(translations.participant_list.participants)}</PageHeaderTextSmall>
                    {
                        [EventState.SCHEDULED, EventState.ON_GOING].includes(event.status) && <CreateButton data-tip={t(translations.tip.create_competitor)} onClick={() => setShowInviteModal(true)} icon={<AiFillPlusCircle
                            style={{ marginRight: '5px' }}
                            size={18} />}>{t(translations.participant_list.invite)}</CreateButton>
                    }
                </PageHeaderContainer>
                <FilterWrapper>
                    <Dropdown overlay={menu}>
                        <a className="ant-dropdown-link" href="/" onClick={e => e.preventDefault()}>
                            {filterMode} <DownOutlined />
                        </a>
                    </Dropdown>
                </FilterWrapper>
                <TableWrapper>
                    <Table columns={columns}
                        scroll={{ x: "max-content" }}
                        dataSource={pagination.rows} pagination={{
                            defaultPageSize: 10,
                            current: pagination.page,
                            total: pagination.total,
                            onChange: onPaginationChanged
                        }} />
                </TableWrapper>
            </Spin>
            <ReactTooltip />
        </>
    )
}

const FilterWrapper = styled.div`
    text-align: right;
    text-transform: capitalize;
`;

const AvatarWrapper = styled.div`
    width: 30px;
    height: 30px;
    margin-right: 10px;
`;

const UserWrapper = styled.div`
    display: flex;
    align-items: center;
`;