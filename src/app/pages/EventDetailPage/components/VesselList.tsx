import React from 'react';
import { Spin, Table, Space } from 'antd';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { PageHeaderContainer, PageHeaderTextSmall, TableWrapper, BorderedButton } from 'app/components/SyrfGeneral';
import { getEventRegisteredVessels } from 'services/live-data-server/event-calendars';
import { renderEmptyValue } from 'utils/helpers';
import styled from 'styled-components';
import { renderAvatar } from 'utils/user-utils';
import { useHistory } from 'react-router-dom';

export const VesselList = (props) => {

    const { t } = useTranslation();

    const { event } = props;

    const history = useHistory();

    const navigateToProfile = (crew) => {
        if (crew?.profile) {
            history.push(`/profile/${crew.profile.id}`)
        }
    }

    const columns = [
        {
            title: t(translations.vessel_list_page.public_name),
            dataIndex: 'publicName',
            key: 'publicName',
        },
        {
            title: t(translations.vessel_list_page.length_in_meters),
            dataIndex: 'lengthInMeters',
            key: 'lengthInMeters',
            render: (text) => renderEmptyValue(text)
        },
        {
            title: t(translations.participant_list.class_name),
            dataIndex: 'class',
            key: 'class',
            render: (text, record) => {
                return renderEmptyValue(record?.vesselParticipants[0]?.group?.name);
            },
            ellipsis: true,
        },
        {
            title: t(translations.participant_list.crew),
            dataIndex: 'class',
            key: 'class',
            render: (text, record) => {
                return record?.vesselParticipants[0]?.crews?.map(crew => <Space key={crew.id} size={10}>
                    <CrewItem onClick={() => navigateToProfile(crew)} alt={crew.publicName} src={renderAvatar(crew.profile?.avatar)} />
                </Space>);
            },
            ellipsis: true,
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
        const response = await getEventRegisteredVessels(event.id, page);
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
                    <PageHeaderTextSmall>{t(translations.event_detail_page.boats)}</PageHeaderTextSmall>
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

const CrewItem = styled.img`
    width: 25px;
    height: 25px;
    object-fit: cover;
    border-radius: 50%;
    cursor: pointer;
`;