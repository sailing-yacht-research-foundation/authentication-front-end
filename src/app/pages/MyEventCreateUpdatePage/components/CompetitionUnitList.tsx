import React from 'react';
import { useHistory } from 'react-router';
import { Space, Spin, Table } from 'antd';
import { BorderedButton, CreateButton, PageHeaderContainer, PageHeaderTextSmall, TableWrapper } from 'app/components/SyrfGeneral';
import moment from 'moment';
import { AiFillPlusCircle } from 'react-icons/ai';
import { getAllByCalendarEventId } from 'services/live-data-server/competition-units';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { DeleteCompetitionUnitModal } from 'app/pages/CompetitionUnitListPage/components/DeleteCompetitionUnitModal';
import { RaceStatus, TIME_FORMAT } from 'utils/constants';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';
import { StopRaceConfirmModal } from './modals/StopRaceConfirmModal';
import { CalendarEvent } from 'types/CalendarEvent';
import { CompetitionUnit } from 'types/CompetitionUnit';

export const CompetitionUnitList = ({ eventId, event }: { eventId: string, event?: CalendarEvent }) => {

    const { t } = useTranslation();


    const [showStopRaceConfirmModal, setShowStopRaceConfirmModal] = React.useState<boolean>(false);

    const columns = [
        {
            title: t(translations.general.name),
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => {
                return <Link data-tip={t(translations.tip.view_this_race_in_the_playback)} to={`/playback/?raceId=${record.id}`}>{text}</Link>;
            },
            width: '20%',
        },
        {
            title: t(translations.general.status),
            dataIndex: 'status',
            key: 'status',
            render: (value) => value,
            width: '20%',
        },
        {
            title: t(translations.general.created_date),
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (value) => moment(value).format(TIME_FORMAT.date_text),
            width: '20%',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    {record.status === RaceStatus.ON_GOING && <CreateButton onClick={() => openStopRaceConfirmModal(record)}>{t(translations.competition_unit_list_page.stop)}</CreateButton>}
                    <BorderedButton data-tip={t(translations.tip.update_race)} onClick={() => {
                        history.push(`/events/${record.calendarEventId}/races/${record.id}/update`)
                    }} type="primary">{t(translations.general.update)}</BorderedButton>
                    {record.status !== RaceStatus.COMPLETED && <BorderedButton data-tip={t(translations.tip.delete_race)} danger onClick={() => showDeleteCompetitionUnitModal(record)}>{t(translations.general.delete)}</BorderedButton>}
                    <ReactTooltip />
                </Space>
            ),
            width: '20%',
        },
    ];

    const [pagination, setPagination] = React.useState<any>({
        page: 1,
        total: 0,
        rows: []
    });

    const [competitionUnit, setCompetitionUnit] = React.useState<Partial<CompetitionUnit>>({});

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const history = useHistory();

    const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

    const getAll = async (page: number) => {
        setIsLoading(true);
        const response = await getAllByCalendarEventId(eventId, page);
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

    const showDeleteCompetitionUnitModal = (competitionUnit: CompetitionUnit) => {
        setShowDeleteModal(true);
        setCompetitionUnit(competitionUnit);
    }

    const onPaginationChanged = (page: number) => {
        getAll(page);
    }

    const onCompetitionUnitDeleted = () => {
        getAll(pagination.page);
    }

    React.useEffect(() => {
        getAll(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const openStopRaceConfirmModal = (competitionUnit: CompetitionUnit) => {
        setCompetitionUnit(competitionUnit);
        setShowStopRaceConfirmModal(true);
    }

    return (
        <>
            <StopRaceConfirmModal reloadParent={() => getAll(pagination.page)} race={competitionUnit} showModal={showStopRaceConfirmModal} setShowModal={setShowStopRaceConfirmModal} />
            <DeleteCompetitionUnitModal
                competitionUnit={competitionUnit}
                onCompetitionUnitDeleted={onCompetitionUnitDeleted}
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
            />
            <Spin spinning={isLoading}>
                <PageHeaderContainer>
                    <PageHeaderTextSmall>{t(translations.competition_unit_list_page.competition_units)}</PageHeaderTextSmall>
                    <CreateButton data-tip={t(translations.tip.create_race)} onClick={() => history.push(`/events/${eventId}/races/create`)} icon={<AiFillPlusCircle
                        style={{ marginRight: '5px' }}
                        size={18} />}>{t(translations.general.create)}</CreateButton>
                </PageHeaderContainer>
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