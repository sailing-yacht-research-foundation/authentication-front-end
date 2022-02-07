import React from 'react';
import { Spin, Table, Space } from 'antd';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { EventState, RaceStatus, TIME_FORMAT } from 'utils/constants';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import ReactTooltip from 'react-tooltip';
import { PageHeaderContainer, PageHeaderTextSmall, TableWrapper, BorderedButton, CreateButton } from 'app/components/SyrfGeneral';
import { getAllByCalendarEventId } from 'services/live-data-server/competition-units';
import { DeleteCompetitionUnitModal } from './DeleteCompetitionUnitModal';
import { FiEdit } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from 'app/pages/LoginPage/slice/selectors';
import { RegisterRaceModal } from 'app/components/RegisterRaceModal';

export const RaceList = (props) => {

    const { t } = useTranslation();

    const { event, canManageEvent } = props;

    const canRegisterToRace = (race) => {
        return [RaceStatus.ON_GOING].includes(race.status) && event.isOpen
            && event.allowRegistration && [EventState.ON_GOING].includes(event.status) && !event.isEditor;
    }

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
                if (canManageEvent())
                    return <Space size="middle">
                        {canRegisterToRace(record) && <CreateButton icon={<FiEdit style={{ marginRight: '10px' }} />} onClick={() => showRegiterModalOrRedirect(record)}>{t(translations.home_page.register_as_competitor)}</CreateButton>}
                        <BorderedButton data-tip={t(translations.tip.update_race)} onClick={() => {
                            history.push(`/events/${record.calendarEventId}/races/${record.id}/update`);
                        }} type="primary">{t(translations.competition_unit_list_page.update)}</BorderedButton>
                        <BorderedButton data-tip={t(translations.tip.delete_race)} danger onClick={() => showDeleteRaceModal(record)}>{t(translations.competition_unit_list_page.delete)}</BorderedButton>
                        <ReactTooltip />
                    </Space>;

                return <></>;
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

    const history = useHistory();

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

    const showRegiterModalOrRedirect = (competitionUnit) => {
        if (isAuthenticated) {
            setCompetitionUnit(competitionUnit);
            setShowRegisterModal(true);
        } else {
            history.push('/signin');
        }
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
            <RegisterRaceModal
                showModal={showRegisterModal}
                setShowModal={setShowRegisterModal}
                raceName={competitionUnit.name}
                lon={event.lon}
                lat={event.lat}
                raceId={competitionUnit.id}
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