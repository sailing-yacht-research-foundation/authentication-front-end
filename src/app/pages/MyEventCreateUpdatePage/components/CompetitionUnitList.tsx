import React from 'react';
import { useHistory } from 'react-router';
import { Space, Spin, Table, Tooltip } from 'antd';
import { BorderedButton, CreateButton, PageHeaderContainer, PageHeaderTextSmall, TableWrapper } from 'app/components/SyrfGeneral';
import moment from 'moment';
import { AiFillPlusCircle } from 'react-icons/ai';
import { getAllByCalendarEventId } from 'services/live-data-server/competition-units';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { DeleteCompetitionUnitModal } from 'app/pages/CompetitionUnitListPage/components/DeleteCompetitionUnitModal';
import { RaceStatus, TIME_FORMAT } from 'utils/constants';
import { Link } from 'react-router-dom';
import { StopRaceConfirmModal } from './modals/StopRaceConfirmModal';
import { CalendarEvent } from 'types/CalendarEvent';
import { CompetitionUnit } from 'types/CompetitionUnit';
import { getFilterTypeBaseOnColumn, handleOnTableStateChanged, parseFilterParamBaseOnFilterType, renderRaceStartTime, truncateName } from 'utils/helpers';
import { TableSorting } from 'types/TableSorting';
import { TableFiltering } from 'types/TableFiltering';
import { FilterConfirmProps } from 'antd/lib/table/interface';
import { getColumnSearchProps, getColumnTimeProps } from 'app/components/TableFilter';

export const CompetitionUnitList = ({ eventId }: { eventId: string, event?: CalendarEvent }) => {

    const { t } = useTranslation();


    const [showStopRaceConfirmModal, setShowStopRaceConfirmModal] = React.useState<boolean>(false);

    const [sorter, setSorter] = React.useState<Partial<TableSorting>>({});

    const [filter, setFilter] = React.useState<TableFiltering[]>([]);

    const handleSearch = (
        selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: any,
    ) => {
        let param: any = selectedKeys[0];
        const filterType = getFilterTypeBaseOnColumn(dataIndex, ['approximateStart', 'createdAt']);
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
            title: t(translations.general.name),
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name', handleSearch, handleReset, 'name'),
            sorter: true,
            render: (text, record) => {
                return (
                    <Tooltip title={t(translations.tip.view_this_race_in_the_playback)}>
                        <Link to={`/playback/?raceId=${record.id}`}>{truncateName(text)}</Link>
                    </Tooltip>
                );
            },
            width: '20%',
        },
        {
            title: t(translations.general.status),
            dataIndex: 'status',
            key: 'status',
            render: (value) => value,
            width: '20%',
            sorter: true,
        },
        {
            title: t(translations.competition_unit_list_page.start_date),
            dataIndex: 'approximateStart',
            key: 'approximateStart',
            ...getColumnTimeProps('approximateStart', handleSearch, handleReset, 'approximateStart'),
            render: (value, record) => renderRaceStartTime(value, t),
            width: '25%',
            sorter: true,
        },
        {
            title: t(translations.general.created_date),
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (value) => moment(value).format(TIME_FORMAT.date_text),
            width: '20%',
            sorter: true,
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    {record.status === RaceStatus.ON_GOING && <CreateButton onClick={() => openStopRaceConfirmModal(record)}>{t(translations.competition_unit_list_page.stop)}</CreateButton>}
                    <Tooltip title={t(translations.tip.update_race)}>
                        <BorderedButton onClick={() => {
                            history.push(`/events/${record.calendarEventId}/races/${record.id}/update`)
                        }} type="primary">{t(translations.general.update)}</BorderedButton>
                    </Tooltip>
                    {record.status !== RaceStatus.COMPLETED && <Tooltip title={t(translations.tip.delete_race)}>
                        <BorderedButton danger onClick={() => showDeleteCompetitionUnitModal(record)}>
                            {t(translations.general.delete)}
                        </BorderedButton>
                    </Tooltip>}
                </Space>
            ),
            width: '20%',
        },
    ];

    const [pagination, setPagination] = React.useState<any>({
        page: 1,
        total: 0,
        rows: [],
        pageSize: 10,
    });

    const [competitionUnit, setCompetitionUnit] = React.useState<Partial<CompetitionUnit>>({});

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const history = useHistory();

    const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

    const getAll = async (page: number, size: number) => {
        setIsLoading(true);
        const response = await getAllByCalendarEventId(eventId, page, size, filter, sorter);
        setIsLoading(false);

        if (response.success) {
            setPagination({
                ...pagination,
                rows: response.data.rows,
                page: page,
                total: response.data.count,
                pageSize: response.data.size
            });
        }
    }

    const showDeleteCompetitionUnitModal = (competitionUnit: CompetitionUnit) => {
        setShowDeleteModal(true);
        setCompetitionUnit(competitionUnit);
    }

    const onPaginationChanged = (page, size) => {
        getAll(page, size);
    }

    const onCompetitionUnitDeleted = () => {
        getAll(pagination.page, pagination.pageSize);
    }

    React.useEffect(() => {
        getAll(pagination.page, pagination.pageSize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sorter, filter]);

    const openStopRaceConfirmModal = (competitionUnit: CompetitionUnit) => {
        setCompetitionUnit(competitionUnit);
        setShowStopRaceConfirmModal(true);
    }

    return (
        <>
            <StopRaceConfirmModal reloadParent={() => getAll(pagination.page, pagination.pageSize)} race={competitionUnit} showModal={showStopRaceConfirmModal} setShowModal={setShowStopRaceConfirmModal} />
            <DeleteCompetitionUnitModal
                competitionUnit={competitionUnit}
                onCompetitionUnitDeleted={onCompetitionUnitDeleted}
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
            />
            <Spin spinning={isLoading}>
                <PageHeaderContainer>
                    <PageHeaderTextSmall>{t(translations.competition_unit_list_page.competition_units)}</PageHeaderTextSmall>
                    <Tooltip title={t(translations.tip.create_race)}>
                        <CreateButton onClick={() => history.push(`/events/${eventId}/races/create`)}
                            icon={<AiFillPlusCircle
                                style={{ marginRight: '5px' }}
                                size={18} />}>{t(translations.general.create)}
                        </CreateButton>
                    </Tooltip>
                </PageHeaderContainer>
                <TableWrapper>
                    <Table columns={columns}
                        onChange={(_1, _2, sorter) => handleOnTableStateChanged(sorter, setSorter)}
                        scroll={{ x: "max-content" }}
                        dataSource={pagination.rows} pagination={{
                            defaultPageSize: 10,
                            current: pagination.page,
                            total: pagination.total,
                            pageSize: pagination.pageSize,
                            onChange: onPaginationChanged,
                        }} />
                </TableWrapper>
            </Spin>
        </>
    )
}