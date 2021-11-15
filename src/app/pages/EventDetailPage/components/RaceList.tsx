import React from 'react';
import { Spin, Table, Space } from 'antd';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { TIME_FORMAT } from 'utils/constants';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router';
import ReactTooltip from 'react-tooltip';
import { PageHeaderContainer, PageHeaderTextSmall, TableWrapper, BorderedButton } from 'app/components/SyrfGeneral';
import { getAllByCalendarEventId } from 'services/live-data-server/competition-units';
import { DeleteCompetitionUnitModal } from './DeleteCompetitionUnitModal';


const uuid = localStorage.getItem('uuid');

export const RaceList = (props) => {

    const { t } = useTranslation();

    const { event } = props;

    const columns = [
        {
            title: t(translations.competition_unit_list_page.name),
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => {
                return <Link to={`/playback/?raceId=${record.id}`}>{text}</Link>;
            },
            width: '33%'
        },
        {
            title: t(translations.competition_unit_list_page.start_date),
            dataIndex: 'approximateStart',
            key: 'approximateStart',
            render: (value) => moment(value).format(TIME_FORMAT.date_text),
            width: '33%'
        },
        {
            title: t(translations.competition_unit_list_page.created_date),
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (value) => moment(value).format(TIME_FORMAT.date_text),
            width: '33%'
        },
        {
            title: t(translations.competition_unit_list_page.action),
            key: 'action',
            width: '20%',
            render: (text, record) => {
                const userId = localStorage.getItem('user_id');
                if ((userId && userId === record.createdById) || (uuid === record.createdById))
                    return <Space size="middle">
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