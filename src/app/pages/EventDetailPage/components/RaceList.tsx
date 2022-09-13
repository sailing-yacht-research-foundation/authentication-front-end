import React from 'react';
import { Spin, Table, Tooltip, Typography } from 'antd';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { TIME_FORMAT } from 'utils/constants';
import { Link } from 'react-router-dom';
import { PageHeaderContainer, PageHeaderTextSmall, TableWrapper } from 'app/components/SyrfGeneral';
import { getAllByCalendarEventId } from 'services/live-data-server/competition-units';
import { DeleteCompetitionUnitModal } from './DeleteCompetitionUnitModal';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from 'app/pages/LoginPage/slice/selectors';
import { RaceManageButtons } from './RaceManageButtons';
import { CalendarEvent } from 'types/CalendarEvent';
import { CompetitionUnit } from 'types/CompetitionUnit';
import { renderRaceStartTime, renderEmptyValue } from 'utils/helpers';

export const RaceList = (props) => {

    const { t } = useTranslation();

    const { event }: { event: CalendarEvent } = props;

    const columns: any = [
        {
            title: t(translations.general.name),
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => {
                return <Tooltip title={text}>
                    <Typography.Text ellipsis={true} style={{ maxWidth: '40vw' }}>
                        <Link to={`/playback/?raceId=${record.id}`}>{renderEmptyValue(text)}</Link>
                    </Typography.Text>
                </Tooltip>;
            },
        },
        {
            title: t(translations.general.start_date),
            dataIndex: 'approximateStart',
            key: 'approximateStart',
            render: (value, record) => {
              return renderRaceStartTime(value, t);
            },
        },
        {
            title: t(translations.general.status),
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
                    event={event}
                    reloadParent={reloadParent}
                    showDeleteRaceModal={showDeleteRaceModal}
                    setCompetitionUnit={setCompetitionUnit} />;
            },
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
