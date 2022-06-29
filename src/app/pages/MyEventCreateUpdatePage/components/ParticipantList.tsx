import React from 'react';
import { Dropdown, Space, Spin, Table, Menu, Tooltip } from 'antd';
import { CreateButton, DeleteButton, FilterWrapper, IconWrapper, PageHeaderContainer, PageHeaderTextSmall, TableWrapper } from 'app/components/SyrfGeneral';
import { AiFillPlusCircle } from 'react-icons/ai';
import { getAllByCalendarEventIdWithFilter } from 'services/live-data-server/participants';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { DeleteParticipantModal } from 'app/pages/ParticipantCreateUpdatePage/components/DeleteParticipantForm';
import styled from 'styled-components';
import { DownOutlined } from '@ant-design/icons';
import { CompetitorInviteModal } from './modals/CompetitorInviteModal';
import { flat, getFilterTypeBaseOnColumn, handleOnTableStateChanged, parseFilterParamBaseOnFilterType, renderEmptyValue } from 'utils/helpers';
import { EventState, ParticipantInvitationStatus, TIME_FORMAT } from 'utils/constants';
import { Link } from 'react-router-dom';
import { renderAvatar } from 'utils/user-utils';
import { BlockParticipantConfirmModal } from 'app/pages/MyEventPage/components/modals/BlockParticipantConfirmModal';
import { CalendarEvent } from 'types/CalendarEvent';
import { Participant } from 'types/Participant';
import { getDetailedEventParticipantsInfo } from 'services/live-data-server/event-calendars';
import { CSVLink } from "react-csv";
import { FaFileCsv } from 'react-icons/fa';
import moment from 'moment';
import { ParticipantDetailList } from './ParticipantDetailList';
import { FilterConfirmProps } from 'antd/lib/table/interface';
import { TableSorting } from 'types/TableSorting';
import { TableFiltering } from 'types/TableFiltering';
import { getColumnSearchProps } from 'app/components/TableFilter';

const FILTER_MODE = {
    assigned: 'assigned',
    unassigned: 'unassigned',
    all: 'all'
}

export const ParticipantList = (props) => {

    const { t } = useTranslation();

    const { eventId, event }: { eventId: string, event: CalendarEvent } = props;

    const [csvData, setCSVData] = React.useState<any[]>([]);

    const [mappedResults, setMappedResults] = React.useState<any[]>([]);

    const [sorter, setSorter] = React.useState<Partial<TableSorting>>({});

    const [filter, setFilter] = React.useState<TableFiltering[]>([]);

    const handleSearch = (
        selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: any,
    ) => {
        let param: any = selectedKeys[0];
        const filterType = getFilterTypeBaseOnColumn(dataIndex, ['approximateStartTime', 'createdAt']);
        param = parseFilterParamBaseOnFilterType(param, filterType);
        confirm();
        setFilter([...filter.filter(f => f.key !== dataIndex), ...[{ key: dataIndex, value: param, type: filterType }]]);
    };

    const handleReset = (clearFilters: () => void, columnToReset: string) => {
        clearFilters();
        setFilter([...filter.filter(f => f.key !== columnToReset)]);
    };

    const columns: any = [
        {
            title: t(translations.general.public_name),
            dataIndex: 'publicName',
            key: 'publicName',
            sorter: true,
            ...getColumnSearchProps('publicName', handleSearch, handleReset, 'publicName'),
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
            sorter: true,
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
            title: t(translations.participant_list.is_paid),
            dataIndex: 'isPaid',
            key: 'isPaid',
            sorter: true,
            render: (text, record) => String(text),
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
    ].filter(column => {
        if (!event.isPaidEvent) return column.dataIndex !== 'isPaid';
        return true;
    });

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
        rows: [],
        pageSize: 10
    });

    const [participant, setParticipant] = React.useState<Partial<Participant>>({});

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

    const [showInviteModal, setShowInviteModal] = React.useState<boolean>(false);

    const [showBlockParticipantModal, setShowBlockParticipantModal] = React.useState<boolean>(false);

    const [filterMode, setFilterMode] = React.useState<string>(FILTER_MODE.all);

    const filterParticipants = (e, mode) => {
        e.preventDefault();
        setFilterMode(mode);
        getAllByFilter(pagination.page, pagination.pageSize, mode);
    }

    const getAllByFilter = async (page: number, size: number, mode: string) => {
        setIsLoading(true);
        const response = await getAllByCalendarEventIdWithFilter(eventId, page, size, mode, filter, sorter);
        setIsLoading(false);

        if (response.success) {
            setPagination({
                ...pagination,
                rows: response.data.rows,
                page: page,
                total: response.data.count,
                pageSize: response.data.size
            });
            getParticipantDetail();
        }
    }

    const showDeleteParticipanModal = (participant) => {
        setShowDeleteModal(true);
        setParticipant(participant);
    }

    const onPaginationChanged = (page, size) => {
        getAllByFilter(page, size, filterMode);
    }

    const onParticipantDeleted = () => {
        getAllByFilter(pagination.page, pagination.pageSize, filterMode);
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

    const getParticipantDetail = async () => {
        const response = await getDetailedEventParticipantsInfo(eventId);

        if (response.success) {
            const participantsData: any = [];
            response.data?.data.map((participant) => participantsData.push(flat({
                ...participant,
                waiverAgreements: participant.waiverAgreements?.map(waiver => waiver.waiverType),
                documentAgreements: participant.documentAgreements?.map(doc => doc.documentName),
            }, {})));
            setCSVData(participantsData);
        }
    }

    const renderExpandedRowRender = (record) => {
        return (
            <div>
                <ParticipantDetailList eventId={eventId} participant={record} />
            </div>
        );
    }

    React.useEffect(() => {
        if (!showInviteModal) {
            getAllByFilter(pagination.page, pagination.pageSize, filterMode);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showInviteModal, filter, sorter]);

    React.useEffect(() => {
        const resultsWithKey = pagination.rows.map((result) => ({ ...result, key: result.id }))
        setMappedResults(resultsWithKey);
    }, [pagination.rows]);

    return (
        <>
            <CompetitorInviteModal eventId={eventId} showModal={showInviteModal} setShowModal={setShowInviteModal} />
            <DeleteParticipantModal
                participant={participant}
                onParticipantDeleted={onParticipantDeleted}
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
            />
            <BlockParticipantConfirmModal reloadParent={() => getAllByFilter(pagination.page, pagination.pageSize, filterMode)} participant={participant} showModal={showBlockParticipantModal} setShowModal={setShowBlockParticipantModal} />
            <Spin spinning={isLoading}>
                <PageHeaderContainer>
                    <PageHeaderTextSmall>{t(translations.participant_list.participants)}</PageHeaderTextSmall>
                    <Space size={10}>
                        {
                            ![EventState.COMPLETED, EventState.CANCELED].includes(event.status!) && <Tooltip title={t(translations.tip.create_competitor)}>
                                <CreateButton onClick={() => setShowInviteModal(true)} icon={<AiFillPlusCircle
                                    style={{ marginRight: '5px' }}
                                    size={18} />}>
                                    {t(translations.participant_list.invite)}
                                </CreateButton>
                            </Tooltip>
                        }

                        {csvData.length > 0 && <Tooltip title={t(translations.tip.export_competitors_info_along_with_their_shared_information)}>
                            <CreateButton icon={<IconWrapper>
                                <FaFileCsv size={18} /></IconWrapper>}>
                                <CSVLink filename={`${event.name}-competitors-${moment().format(TIME_FORMAT.date_text_with_time)}.csv`} data={csvData}>{t(translations.participant_list.export)}</CSVLink>
                            </CreateButton>
                        </Tooltip>}
                    </Space>
                </PageHeaderContainer>
                <FilterWrapper>
                    <Dropdown trigger={['click']} overlay={menu}>
                        <a className="ant-dropdown-link" href="/" onClick={e => e.preventDefault()}>
                            {filterMode} <DownOutlined />
                        </a>
                    </Dropdown>
                </FilterWrapper>
                <TableWrapper>
                    <Table
                        scroll={{ x: "max-content" }}
                        columns={columns}
                        dataSource={mappedResults}
                        onChange={(_1, _2, sorter) => handleOnTableStateChanged(sorter, setSorter)}
                        pagination={{
                            defaultPageSize: 10,
                            pageSize: pagination.size,
                            current: pagination.page,
                            total: pagination.total,
                            onChange: onPaginationChanged,
                        }}
                        expandable={{
                            expandedRowRender: record => renderExpandedRowRender(record)
                        }}
                    />
                </TableWrapper>
            </Spin>
        </>
    )
}

const AvatarWrapper = styled.div`
    width: 30px;
    height: 30px;
    margin-right: 10px;
`;

const UserWrapper = styled.div`
    display: flex;
    align-items: center;
`;