import React from 'react';
import { Space, Spin, Table } from 'antd';
import moment from 'moment';
import { getAllByCalendarEventId } from 'services/live-data-server/competition-units';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { RaceStatus, TIME_FORMAT } from 'utils/constants';
import { Link } from 'react-router-dom';
import { ExpeditionServerActionButtons } from 'app/pages/CompetitionUnitCreateUpdatePage/components/ExpeditionServerActionButtons';

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
            width: '25%'
        },
        {
            title: t(translations.competition_unit_list_page.start_date),
            dataIndex: 'approximateStartTime',
            key: 'start_date',
            render: (value) => moment(value).format(TIME_FORMAT.date_text_with_time),
            width: '25%'
        },
        {
            title: t(translations.competition_unit_list_page.created_date),
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (value) => moment(value).format(TIME_FORMAT.date_text),
            width: '25%'
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => {
                if (record?.id
                    && record?.status === RaceStatus.ON_GOING)
                return <ExpeditionServerActionButtons competitionUnit={record} />;
      
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

    const getAll = async (page) => {
        setIsLoading(true);
        const response = await getAllByCalendarEventId(event.id, page, 1000);
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
                <Table columns={columns}
                    size="small"
                    scroll={{ x: "max-content" }}
                    dataSource={pagination.rows} pagination={false} />
            </Spin>
        </>
    )
}