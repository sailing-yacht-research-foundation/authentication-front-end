import React from 'react';
import { useHistory } from 'react-router';
import { Space, Spin, Table, Tooltip } from 'antd';
import { BorderedButton, CreateButton, PageHeaderContainer, PageHeaderTextSmall, TableWrapper } from 'app/components/SyrfGeneral';
import moment from 'moment';
import { AiFillPlusCircle } from 'react-icons/ai';
import { getVesselParticipantGroupsByEventId } from 'services/live-data-server/vessel-participant-group';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { DeleteVesselParticipantGroupModal } from 'app/pages/VesselParticipantGroupListPage/components/DeleteVesselParticipantGroupModal';
import { TIME_FORMAT } from 'utils/constants';
import { VesselParticipantGroup } from 'types/VesselParticipantGroup';

export const VesselParticipantGroupList = (props) => {

    const { t } = useTranslation();

    const { eventId } = props;

    const columns = [
        {
            title: t(translations.general.name),
            dataIndex: 'name',
            key: 'name',
            render: (value) => value
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
            width: '20%',
            render: (text, record) => {
                return <Space size="middle">
                    <Tooltip title={t(translations.tip.update_class)}>
                        <BorderedButton onClick={() => {
                            history.push(`/events/${eventId}/classes/${record.id}/update`);
                        }} type="primary">
                            {t(translations.general.update)}
                        </BorderedButton>
                    </Tooltip>
                    <Tooltip title={t(translations.tip.delete_class)}>
                        <BorderedButton
                            danger
                            onClick={() => showDeleteGroupModal(record)}>
                            {t(translations.general.delete)}
                        </BorderedButton>
                    </Tooltip>
                </Space>;
            }
        },
    ];

    const [pagination, setPagination] = React.useState<any>({
        page: 1,
        total: 0,
        rows: [],
        pageSize: 10
    });

    const [group, setGroup] = React.useState<Partial<VesselParticipantGroup>>({});

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const history = useHistory();

    const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

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

    const showDeleteGroupModal = (group) => {
        setShowDeleteModal(true);
        setGroup(group);
    }

    const onPaginationChanged = (page, size) => {
        getAll(page, size);
    }

    const onGroupDeleted = () => {
        getAll(pagination.page, pagination.pageSize);
    }

    React.useEffect(() => {
        getAll(pagination.page, pagination.pageSize);
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
                    <Tooltip title={t(translations.tip.create_class)}>
                        <CreateButton onClick={() => history.push(`/events/${eventId}/classes/create`)} icon={<AiFillPlusCircle
                            style={{ marginRight: '5px' }}
                            size={18} />}>
                            {t(translations.vessel_participant_group_list_page.create)}
                        </CreateButton>
                    </Tooltip>
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