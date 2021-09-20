import React from 'react';
import { useHistory } from 'react-router';
import { Space, Spin, Table } from 'antd';
import { BorderedButton, CreateButton, PageHeaderContainer, PageHeaderTextSmall, TableWrapper } from 'app/components/SyrfGeneral';
import { AiFillPlusCircle } from 'react-icons/ai';
import { getAllByCalendarEventId } from 'services/live-data-server/participants';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { DeleteParticipantModal } from 'app/pages/ParticipantCreateUpdatePage/components/DeleteParticipantForm';

export const ParticipantList = (props) => {

    const { t } = useTranslation();

    const { eventId } = props;

    const columns = [
        {
            title: t(translations.participant_list.public_name),
            dataIndex: 'publicName',
            key: 'publicName',
            render: text => text,
            width: '20%',
        },
        {
            title: t(translations.participant_list.participant_id),
            dataIndex: 'participantId',
            key: 'participantId',
            render: text => text,
            width: '20%',
        },
        {
            title: t(translations.participant_list.action),
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <BorderedButton onClick={() => {
                        history.push(`/events/${record.calendarEventId}/participants/${record.id}/update`)
                    }} type="primary">{t(translations.participant_list.update)}</BorderedButton>
                    <BorderedButton danger onClick={() => showDetelteParticipanModal(record)}>{t(translations.participant_list.delete)}</BorderedButton>
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

    const [participant, setParticipant] = React.useState<any>({});

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
                page: page,
                total: response.data?.count
            });
        }
    }

    const showDetelteParticipanModal = (participant) => {
        setShowDeleteModal(true);
        setParticipant(participant);
    }

    const onPaginationChanged = (page) => {
        getAll(page);
    }

    const onParticipantDeleted = () => {
        getAll(pagination.page);
    }

    React.useEffect(() => {
        getAll(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <DeleteParticipantModal
                participant={participant}
                onParticipantDeleted={onParticipantDeleted}
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
            />
            <Spin spinning={isLoading}>
                <PageHeaderContainer>
                    <PageHeaderTextSmall>{t(translations.participant_list.participants)}</PageHeaderTextSmall>
                    <CreateButton onClick={() => history.push(`/events/${eventId}/participants/create`)} icon={<AiFillPlusCircle
                        style={{ marginRight: '5px' }}
                        size={18} />}>{t(translations.participant_list.create)}</CreateButton>
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