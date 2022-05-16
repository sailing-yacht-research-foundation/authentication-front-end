import React from 'react';
import { Spin, Table } from 'antd';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { RaceStatus, TIME_FORMAT } from 'utils/constants';
import { Link } from 'react-router-dom';
import { PageHeaderContainer, PageHeaderTextSmall, TableWrapper } from 'app/components/SyrfGeneral';
import { checkForUserRelationWithCompetitionUnits, getAllByCalendarEventId } from 'services/live-data-server/competition-units';
import { DeleteCompetitionUnitModal } from './DeleteCompetitionUnitModal';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from 'app/pages/LoginPage/slice/selectors';
import { RaceManageButtons } from './RaceManageButtons';
import { CalendarEvent } from 'types/CalendarEvent';
import { CompetitionUnit } from 'types/CompetitionUnit';
import { renderEmptyValue } from 'utils/helpers';

export const RaceList = (props) => {

    const { t } = useTranslation();

    const { event, canManageEvent }: { event: CalendarEvent, canManageEvent: Function } = props;

    const columns = [
        {
            title: t(translations.general.name),
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => {
                return <Link to={`/playback/?raceId=${record.id}`}>{text}</Link>;
            },
        },
        {
            title: t(translations.competition_unit_list_page.start_date),
            dataIndex: 'approximateStart',
            key: 'approximateStart',
            render: (value, record) => {
                if (moment(value).isValid()) {
                    return moment(value).format(TIME_FORMAT.date_text);
                } else if (RaceStatus.POSTPONED === record.status) {
                    return t(translations.event_detail_page.this_race_is_postponed_therefore_its_start_time_is_not_available);
                }

                return renderEmptyValue(null);
            },
        },
        {
            title: t(translations.competition_unit_list_page.status),
            dataIndex: 'status',
            key: 'status',
            render: (value) => value,
        },
        {
            title: t(translations.general.created_date),
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (value) => moment(value).format(TIME_FORMAT.date_text),
        },
        {
            title: t(translations.general.action),
            key: 'action',
            render: (text, record) => {
                return <RaceManageButtons
                    race={record}
                    canManageEvent={canManageEvent}
                    event={event}
                    reloadParent={reloadParent}
                    relations={relations}
                    isAuthenticated={isAuthenticated}
                    showDeleteRaceModal={showDeleteRaceModal}
                    showRegisterModal={showRegisterModal}
                    setCompetitionUnit={setCompetitionUnit}
                    setShowRegisterModal={setShowRegisterModal} />;
            }
        },
    ];

    const [pagination, setPagination] = React.useState<any>({
        page: 1,
        total: 0,
        rows: [],
        pageSize: 10
    });

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

    const [competitionUnit, setCompetitionUnit] = React.useState<Partial<CompetitionUnit>>({});

    const isAuthenticated = useSelector(selectIsAuthenticated);

    const [showRegisterModal, setShowRegisterModal] = React.useState<boolean>(false);

    const [relations, setRelations] = React.useState<any[]>([]);

    const getAll = async (page, size) => {
        setIsLoading(true);
        const response = await getAllByCalendarEventId(event.id!, page, size);
        setIsLoading(false);

        if (response.success) {
            setPagination({
                ...pagination,
                rows: response.data.rows,
                page: page,
                total: response.data.count,
                pageSize: response.data.size,
            });
            getRelations(response.data?.rows.map(c => c.id));
        }
    }

    const getRelations = async (competitionUnits) => {
        const response = await checkForUserRelationWithCompetitionUnits(competitionUnits);

        if (response.success) {
            setRelations(response.data);
        }
    }

    const onPaginationChanged = (page, size) => {
        getAll(page, size);
    }

    const reloadParent = () => {
        getAll(pagination.page, pagination.pageSize);
    }

    const onCompetitionUnitDeleted = () => {
        getAll(pagination.page, pagination.pageSize);
    }

    const showDeleteRaceModal = (competitionUnit) => {
        setShowDeleteModal(true);
        setCompetitionUnit(competitionUnit);
    }


    React.useEffect(() => {
        getAll(pagination.page, pagination.pageSize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <DeleteCompetitionUnitModal
                competitionUnit={competitionUnit}
                onCompetitionUnitDeleted={onCompetitionUnitDeleted}
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
            />
            <Spin spinning={isLoading}>
                <PageHeaderContainer>
                    <PageHeaderTextSmall>{t(translations.event_detail_page.races)}</PageHeaderTextSmall>
                </PageHeaderContainer>
                <TableWrapper>
                    <Table columns={columns}
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