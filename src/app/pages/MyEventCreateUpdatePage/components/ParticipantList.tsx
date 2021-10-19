import React from 'react';
import { useHistory } from 'react-router';
import { Dropdown, Space, Spin, Table, Menu } from 'antd';
import { BorderedButton, CreateButton, PageHeaderContainer, PageHeaderTextSmall, TableWrapper } from 'app/components/SyrfGeneral';
import { AiFillCopy, AiFillPlusCircle } from 'react-icons/ai';
import { getAllByCalendarEventIdWithFilter } from 'services/live-data-server/participants';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { DeleteParticipantModal } from 'app/pages/ParticipantCreateUpdatePage/components/DeleteParticipantForm';
import styled from 'styled-components';
import { AssignVesselParticipantModal } from './AssignVesselParticipantModal';
import { toast } from 'react-toastify';
import { DownOutlined } from '@ant-design/icons';
import ReactTooltip from 'react-tooltip';

const FILTER_MODE = {
    assigned: 'assigned',
    unassigned: 'unassigned',
    all: 'all'
}

export const ParticipantList = (props) => {

    const { t } = useTranslation();

    const { eventId } = props;

    const columns = [
        {
            title: t(translations.participant_list.public_name),
            dataIndex: 'publicName',
            key: 'publicName',
            render: text => text,
        },
        {
            title: t(translations.participant_list.assigned_vessels),
            dataIndex: 'vesselName',
            key: 'vesselName',
            render: (text, record) => {
                return renderAssignedVessels(record);
            },
            ellipsis: true,
        },
        {
            title: t(translations.participant_list.tracker_url),
            dataIndex: 'trackerUrl',
            key: 'trackerUrl',
            render: text => {
                return <CreateButton data-tip={t(translations.tip.copy_competitor_tracker_link)} onClick={() => copyToClipboard(text)} icon={<AiFillCopy style={{ marginRight: '10px' }} />}>Copy</CreateButton>
            },
        },
        {
            title: t(translations.participant_list.action),
            key: 'action',
            fixed: true,
            render: (text, record) => (
                <Space size={10}>
                    <AssignButton data-tip={t(translations.tip.assign_competitor)} onClick={() => {
                        showAssignParticipantModal(record);
                    }} type="primary">{t(translations.participant_list.assign)}</AssignButton>
                    <BorderedButton data-tip={t(translations.tip.update_competitor)} onClick={() => {
                        history.push(`/events/${record.calendarEventId}/competitors/${record.id}/update`)
                    }} type="primary">{t(translations.participant_list.update)}</BorderedButton>
                    <BorderedButton data-tip={t(translations.tip.delete_competitor)} danger onClick={() => showDeleteParticipanModal(record)}>{t(translations.participant_list.delete)}</BorderedButton>
                    <ReactTooltip/>
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

    const history = useHistory();

    const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

    const [showAssignModal, setShowAssignModal] = React.useState<boolean>(false);

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

    const showAssignParticipantModal = (participant) => {
        setShowAssignModal(true);
        setParticipant(participant);
    }

    const copyToClipboard = (text) => {
        let input = document.createElement('input');
        document.body.appendChild(input);
        input.value = text;
        input.select();
        document.execCommand('copy', false);
        toast.info(t(translations.participant_list.copied_to_clipboard));
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
        if (!showAssignModal) {
            getAllByFilter(pagination.page, filterMode);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showAssignModal]);

    return (
        <>
            <DeleteParticipantModal
                participant={participant}
                onParticipantDeleted={onParticipantDeleted}
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
            />
            <AssignVesselParticipantModal
                participant={participant}
                showAssignModal={showAssignModal}
                eventId={eventId}
                setShowAssignModal={setShowAssignModal}
            />
            <Spin spinning={isLoading}>
                <PageHeaderContainer>
                    <PageHeaderTextSmall>{t(translations.participant_list.participants)}</PageHeaderTextSmall>
                    <CreateButton data-tip={t(translations.tip.create_competitor)} onClick={() => history.push(`/events/${eventId}/competitors/create`)} icon={<AiFillPlusCircle
                        style={{ marginRight: '5px' }}
                        size={18} />}>{t(translations.participant_list.create)}</CreateButton>
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

const AssignButton = styled(BorderedButton)`
    background: #DC6E1E;
    border: 1px solid #fff;

    :hover, :focus {
        background: #DC6E1E;
        border: 1px solid #fff;
    }
`;

const FilterWrapper = styled.div`
    text-align: right;
    text-transform: capitalize;
`;