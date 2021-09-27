import React from 'react';
import { Modal, Space, Spin, Table } from 'antd';
import { DeleteButton, TableWrapper } from 'app/components/SyrfGeneral';
import { BiTrash } from 'react-icons/bi';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { getMany } from 'services/live-data-server/vessel-participants';

export const AssignVesselParticipantModal = (props) => {

    const { t } = useTranslation();

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const [pagination, setPagination] = React.useState<any>({
        page: 1,
        total: 0,
        rows: []
    });

    const { participant, showAssignModal, setShowAssignModal } = props;

    const columns = [
        {
            title: t(translations.assign_vessel_participant_modal.group_name),
            dataIndex: 'name',
            key: 'name',
            render: text => text,
            width: '20%',
        },
        {
            title: t(translations.assign_vessel_participant_modal.vessel_name),
            dataIndex: 'approximateStartTime',
            key: 'start_date',
            render: (value) => value,
            width: '20%',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <DeleteButton onClick={() => { }} danger icon={<BiTrash
                        style={{ marginRight: '5px' }}
                        size={18} />}>{t(translations.assign_vessel_participant_modal.unassign)}</DeleteButton>
                </Space>
            ),
            width: '20%',
        },
    ];

    const onPaginationChanged = (page) => {
        getMany(page);
    }

    return (
        <Modal title={t(translations.assign_vessel_participant_modal.assign_vessel_to_vessel_groups)}
            visible={showAssignModal}
            onCancel={()=>setShowAssignModal(false)}
            okButtonProps={{
                style: {
                    display: 'none'
                }
            }}
        >
            <Spin spinning={isLoading}>
                <TableWrapper>
                    <Table columns={columns}
                        scroll={{ x: "max-content" }}
                        dataSource={pagination.rows} pagination={{
                            defaultPageSize: 10,
                            current: pagination.page,
                            total: pagination.total,
                            onChange: onPaginationChanged
                        }}
                       />
                </TableWrapper>
            </Spin>
        </Modal>
    )
}