import React from 'react';
import { Spin, Table, Tooltip, Typography } from 'antd';
import { PageHeaderContainer, PageHeaderTextSmall, TableWrapper } from 'app/components/SyrfGeneral';
import moment from 'moment';
import { getVesselParticipantGroupsByEventId } from 'services/live-data-server/vessel-participant-group';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { TIME_FORMAT } from 'utils/constants';
import { renderEmptyValue } from 'utils/helpers';

export const VesselParticipantGroupList = (props) => {

    const { t } = useTranslation();

    const { eventId } = props;

    const columns = [
        {
            title: t(translations.general.name),
            dataIndex: 'name',
            key: 'name',
            render: (value) => <Tooltip title={value}>
                <Typography.Text ellipsis={true} style={{ maxWidth: '10vw' }}>
                    {renderEmptyValue(value)}
                </Typography.Text>
            </Tooltip>
        },
        {
            title: t(translations.general.created_date),
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (value) => moment(value).format(TIME_FORMAT.date_text),
        }
    ];

    const [pagination, setPagination] = React.useState<any>({
        page: 1,
        total: 0,
        rows: [],
        pageSize: 10
    });

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const getAll = async (page, size) => {
        setIsLoading(true);
        const response = await getVesselParticipantGroupsByEventId(eventId, page, size);
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

    React.useEffect(() => {
        getAll(pagination.page, pagination.pageSize);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Spin spinning={isLoading}>
                <PageHeaderContainer>
                    <PageHeaderTextSmall>{t(translations.my_event_create_update_page.Vessel_participant_groups)}</PageHeaderTextSmall>
                </PageHeaderContainer>
                <TableWrapper>
                    <Table columns={columns}
                        scroll={{ x: "max-content" }}
                        dataSource={pagination.rows} pagination={{
                            defaultPageSize: 10,
                            current: pagination.page,
                            total: pagination.total,
                            pageSize: pagination.pageSize,
                            onChange: onPaginationChanged
                        }} />
                </TableWrapper>
            </Spin>
        </>
    )
}
