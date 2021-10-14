import React from 'react';
import { useHistory } from 'react-router';
import { Space, Spin, Table } from 'antd';
import { BorderedButton, CreateButton, PageHeaderContainer, PageHeaderTextSmall, TableWrapper } from 'app/components/SyrfGeneral';
import moment from 'moment';
import { AiFillPlusCircle } from 'react-icons/ai';
import { getVesselParticipantGroupsByEventId } from 'services/live-data-server/vessel-participant-group';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { DeleteVesselParticipantGroupModal } from 'app/pages/VesselParticipantGroupListPage/components/DeleteVesselParticipantGroupModal';
import { TIME_FORMAT } from 'utils/constants';

export const VesselParticipantGroupList = (props) => {

    const { t } = useTranslation();

    const { eventId } = props;

    const columns = [
        {
            title: t(translations.vessel_participant_group_list_page.name),
            dataIndex: 'name',
            key: 'name',
            render: (value) => value
        },
        {
            title: t(translations.vessel_participant_group_list_page.created_date),
            dataIndex: 'created_at',
            key: 'created_at',
            render: (value) => moment(value).format(TIME_FORMAT.date_text),
        },
        {
            title: t(translations.vessel_participant_group_list_page.action),
            key: 'action',
            width: '20%',
            render: (text, record) => {
                return <Space size="middle">
                    <BorderedButton onClick={() => {
                        history.push(`/events/${eventId}/classes/${record.id}/update`);
                    }} type="primary">{t(translations.vessel_participant_group_list_page.update)}</BorderedButton>
                    <BorderedButton danger onClick={() => showDeleteGroupModal(record)}>{t(translations.vessel_participant_group_list_page.delete)}</BorderedButton>
                </Space>;
            }
        },
    ];

    const [pagination, setPagination] = React.useState<any>({
        page: 1,
        total: 0,
        rows: []
    });

    const [group, setGroup] = React.useState<any>({});

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const history = useHistory();

    const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

    const getAll = async (page) => {
        setIsLoading(true);
        const response = await getVesselParticipantGroupsByEventId(eventId, page);
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

    const showDeleteGroupModal = (group) => {
        setShowDeleteModal(true);
        setGroup(group);
    }

    const onPaginationChanged = (page) => {
        getAll(page);
    }

    const onGroupDeleted = () => {
        getAll(pagination.page);
    }

    React.useEffect(() => {
        getAll(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <DeleteVesselParticipantGroupModal
                group={group}
                onGroupDeleted={onGroupDeleted}
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
            />
            <Spin spinning={isLoading}>
                <PageHeaderContainer>
                    <PageHeaderTextSmall>{t(translations.my_event_create_update_page.Vessel_participant_groups)}</PageHeaderTextSmall>
                    <CreateButton onClick={() => history.push(`/events/${eventId}/classes/create`)} icon={<AiFillPlusCircle
                        style={{ marginRight: '5px' }}
                        size={18} />}>{t(translations.vessel_participant_group_list_page.create)}</CreateButton>
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