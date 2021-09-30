import React from 'react';
import { Spin, Table } from 'antd';
import { PageHeaderContainer, PageHeaderTextSmall, TableWrapper } from 'app/components/SyrfGeneral';
import moment from 'moment';
import { getAllByCalendarEventId } from 'services/live-data-server/competition-units';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { TIME_FORMAT } from 'utils/constants';
import { Link } from 'react-router-dom';

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
            dataIndex: 'approximateStartTime',
            key: 'start_date',
            render: (value) => moment(value).format(TIME_FORMAT.date_text_with_time),
            width: '33%'
        },
        {
            title: t(translations.competition_unit_list_page.created_date),
            dataIndex: 'created_at',
            key: 'created_at',
            render: (value) => moment(value).format(TIME_FORMAT.date_text),
            width: '33%'
        }
    ];

    const [pagination, setPagination] = React.useState<any>({
        page: 1,
        total: 0,
        rows: []
    });

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const getAll = async (page) => {
        setIsLoading(true);
        const response = await getAllByCalendarEventId(event.id, pagination.page);
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

    React.useEffect(() => {
        getAll(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
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