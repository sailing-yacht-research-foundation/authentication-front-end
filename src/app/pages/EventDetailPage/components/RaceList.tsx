import React from 'react';
import { Spin, Table } from 'antd';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { TIME_FORMAT } from 'utils/constants';
import { Link } from 'react-router-dom';
import { PageHeaderContainer, PageHeaderTextSmall, TableWrapper } from 'app/components/SyrfGeneral';
import { checkForUserRelationWithCompetitionUnits, getAllByCalendarEventId } from 'services/live-data-server/competition-units';
import { DeleteCompetitionUnitModal } from './DeleteCompetitionUnitModal';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from 'app/pages/LoginPage/slice/selectors';
import { RaceManageButtons } from './RaceManageButtons';

export const RaceList = (props) => {

    const { t } = useTranslation();

    const { event, canManageEvent } = props;

    const columns = [
        {
            title: t(translations.competition_unit_list_page.name),
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
            render: (value) => moment(value).format(TIME_FORMAT.date_text),
        },
        {
            title: t(translations.competition_unit_list_page.status),
            dataIndex: 'status',
            key: 'status',
            render: (value) => value,
        },
        {
            title: t(translations.competition_unit_list_page.created_date),
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (value) => moment(value).format(TIME_FORMAT.date_text),
        },
        {
            title: t(translations.competition_unit_list_page.action),
            key: 'action',
            render: (text, record) => {
                return <RaceManageButtons
                    race={record}
                    canManageEvent={canManageEvent}
                    event={event}
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
        rows: []
    });

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

    const [competitionUnit, setCompetitionUnit] = React.useState<any>({});

    const isAuthenticated = useSelector(selectIsAuthenticated);

    const [showRegisterModal, setShowRegisterModal] = React.useState<boolean>(false);

    const [relations, setRelations] = React.useState<any[]>([]);

    const getAll = async (page) => {
        setIsLoading(true);
        const response = await getAllByCalendarEventId(event.id, page);
        setIsLoading(false);

        if (response.success) {
            setPagination({
                ...pagination,
                rows: response.data?.rows,
                page: page,
                total: response.data?.count
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

    const onPaginationChanged = (page) => {
        getAll(page);
    }

    const onCompetitionUnitDeleted = () => {
        getAll(pagination.page);
    }

    const showDeleteRaceModal = (competitionUnit) => {
        setShowDeleteModal(true);
        setCompetitionUnit(competitionUnit);
    }


    React.useEffect(() => {
        getAll(1);
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
                            onChange: onPaginationChanged
                        }} />
                </TableWrapper>
            </Spin>
        </>
    )
}