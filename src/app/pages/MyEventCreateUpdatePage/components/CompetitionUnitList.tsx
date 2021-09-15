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

export const CompetitionUnitList = (props) => {

    const { t } = useTranslation();

    const { eventId } = props;

    const columns = [
        {
            title: t(translations.competition_unit_list_page.name),
            dataIndex: 'name',
            key: 'name',
            render: text => text,
            width: '20%',
        },
        {
            title: t(translations.competition_unit_list_page.start_date),
            dataIndex: 'approximateStartTime',
            key: 'start_date',
            render: (value) => moment(value).format('MMM. D, YYYY [at] h:mm A z'),
            width: '20%',
        },
        {
            title: t(translations.competition_unit_list_page.created_date),
            dataIndex: 'created_at',
            key: 'created_at',
            render: (value) => moment(value).format('MMM. D, YYYY'),
            width: '20%',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <BorderedButton onClick={() => {
                        history.push(`/my-events/${record.calendarEventId}/my-races/${record.id}/update`)
                    }} type="primary">{t(translations.competition_unit_list_page.update)}</BorderedButton>
                    <BorderedButton danger onClick={() => showDeleteCompetitionUnitModal(record)}>{t(translations.competition_unit_list_page.delete)}</BorderedButton>
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

    const [competitionUnit, setCompetitionUnit] = React.useState<any>({});

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const history = useHistory();

    const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

    const getAll = async (page) => {
        setIsLoading(true);
        const response = await getAllByCalendarEventId(eventId, pagination.page);
        setIsLoading(false);

        if (response.success) {
            setPagination({
                ...pagination,
                rows: response.data?.rows,
                page: page
            });
        }
    }

    const showDeleteCompetitionUnitModal = (competitionUnit) => {
        setShowDeleteModal(true);
        setCompetitionUnit(competitionUnit);
    }

    const onPaginationChanged = (page) => {
        getAll(page);
    }

    const onCompetitionUnitDeleted = () => {
        getAll(pagination.page);
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
                    <PageHeaderTextSmall>{t(translations.competition_unit_list_page.competition_units)}</PageHeaderTextSmall>
                    <CreateButton onClick={() => history.push(`/my-events/${eventId}/my-races/create`)} icon={<AiFillPlusCircle
                        style={{ marginRight: '5px' }}
                        size={18} />}>{t(translations.competition_unit_list_page.create)}</CreateButton>
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