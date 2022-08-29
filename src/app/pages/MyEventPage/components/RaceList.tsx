import React from 'react';
import { Spin, Table, Space, Tooltip, Typography } from 'antd';
import moment from 'moment';
import { getAllByCalendarEventId } from 'services/live-data-server/competition-units';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { EventState, RaceStatus, TIME_FORMAT } from 'utils/constants';
import { Link } from 'react-router-dom';
import { ExpeditionServerActionButtons } from 'app/pages/CompetitionUnitCreateUpdatePage/components/ExpeditionServerActionButtons';
import { BorderedButton } from 'app/components/SyrfGeneral';
import { useHistory } from 'react-router';
import { renderRaceStartTime, renderEmptyValue } from 'utils/helpers';
import { EditFilled } from '@ant-design/icons';

export const RaceList = (props) => {

    const { t } = useTranslation();

    const { event } = props;

    const history = useHistory();

    const columns = [
        {
            title: t(translations.general.name),
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => {
                return <Tooltip title={text}>
                    <Typography.Text ellipsis={true} style={{ maxWidth: '30vw' }}>
                        <Link to={`/playback/?raceId=${record.id}`}>{renderEmptyValue(text)}</Link>
                    </Typography.Text>
                </Tooltip>
            }
        },
        {
            title: t(translations.general.start_date),
            dataIndex: 'approximateStart',
            key: 'approximateStart',
            render: (value, record) => renderRaceStartTime(value, t),
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
            title: 'Action',
            key: 'action',
            render: (text, record) => {
                return (<Space size="middle">
                    {record?.id
                        && record?.status === RaceStatus.ON_GOING && <ExpeditionServerActionButtons competitionUnit={record} />}
                    {
                        canEditRace() && <Tooltip title={t(translations.general.update)}>
                            <BorderedButton icon={<EditFilled />} onClick={() => {
                                history.push(`/events/${record.calendarEventId}/races/${record.id}/update`);
                            }} type="primary" /></Tooltip>
                    }
                </Space>)
            }
        },
    ];

    const canEditRace = () => {
        return event.isEditor && ![EventState.CANCELED, EventState.COMPLETED].includes(event.status);
    }

    const [pagination, setPagination] = React.useState<any>({
        page: 1,
        total: 0,
        rows: []
    });

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const getAll = async (page) => {
        setIsLoading(true);
        const response = await getAllByCalendarEventId(event.id!, page, 1000);
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
