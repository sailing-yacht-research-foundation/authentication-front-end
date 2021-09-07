import React from 'react';
import { useHistory } from 'react-router';
import { Space, Spin, Table } from 'antd';
import { BorderedButton, CreateButton, PageHeaderContainer, PageHeaderText, PageHeaderTextSmall, TableWrapper } from 'app/components/SyrfGeneral';
import moment from 'moment';
import { AiFillPlusCircle } from 'react-icons/ai';
import { getAllByCalendarEventId } from 'services/live-data-server/competition-units';

export const CompetitionUnitList = (props) => {

    const { raceId } = props;

    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: text => <a>{text}</a>,
            width: '20%',
        },
        {
            title: 'Location',
            dataIndex: 'locationName',
            key: 'location',
            width: '20%',
        },
        {
            title: 'Start Date',
            dataIndex: 'approximateStartTime',
            key: 'start_date',
            render: (value) => moment(value).format('YYYY-MM-DD'),
            width: '20%',
        },
        {
            title: 'Created Date',
            dataIndex: 'created_at',
            key: 'created_at',
            render: (value) => moment(value).format('YYYY-MM-DD'),
            width: '20%',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <BorderedButton onClick={() => {
                        history.push(`/my-races/${record.id}/update`)
                    }} type="primary">Update</BorderedButton>
                    <BorderedButton danger onClick={() => showDeleteRaceModal(record)}>Delete</BorderedButton>
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

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const history = useHistory();

    const showDeleteRaceModal = (competitionUnit) => {

    }

    const getAll = async (page) => {
        setIsLoading(true);
        const response = await getAllByCalendarEventId(raceId, pagination.page);
        setIsLoading(false);

        if (response.success) {
            setPagination({
                ...pagination,
                rows: response.data?.rows,
                page: page
            });
        }
    }

    const onPaginationChanged = (page) => {
        getAll(page);
    }
    
    React.useEffect(() => {
        getAll(1);
    }, []);

    return (
        <Spin spinning={isLoading}>
            <PageHeaderContainer>
                <PageHeaderTextSmall>Competition Units</PageHeaderTextSmall>
                <CreateButton onClick={() => history.push(`/my-races/${raceId}/competition-units/create`)} icon={<AiFillPlusCircle
                    style={{ marginRight: '5px' }}
                    size={18} />}>Create</CreateButton>
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
    )
}