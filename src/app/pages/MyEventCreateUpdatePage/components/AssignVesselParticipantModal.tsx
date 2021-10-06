import React from 'react';
import { Modal, Spin, Table } from 'antd';
import { BorderedButton, DeleteButton, TableWrapper } from 'app/components/SyrfGeneral';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { getManyByEventId } from 'services/live-data-server/vessel-participants';
import { registerParticipantsToVesselParticipant, unregisterParticipantFromVesselParticipant } from 'services/live-data-server/participants';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { media } from 'styles/media';

export const AssignVesselParticipantModal = (props) => {

    const { eventId } = props;

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
            dataIndex: 'groupName',
            key: 'groupName',
            render: (value, record) => {
                return record.group?.name
            },
            width: '33%',
        },
        {
            title: t(translations.assign_vessel_participant_modal.vessel_name),
            dataIndex: 'vesselName',
            key: 'vesselName',
            render: (value, record) => {
                return record.vessel?.publicName
            },
            width: '33%',
        },
        {
            title: t(translations.assign_vessel_participant_modal.action),
            key: 'action',
            render: (text, record) => {
                if (checkIfParticipantExistsOnVesselParticipant(record.participants)) {
                    return <DeleteButton onClick={() => {
                        removeParticipantFromVesselParticipant(record.id);
                    }} danger>{t(translations.assign_vessel_participant_modal.unassign)}</DeleteButton>;
                }

                return <BorderedButton onClick={() => {
                    assignParticipantToVesselParticipant(record.id);
                }} type="primary">{t(translations.assign_vessel_participant_modal.assign)}</BorderedButton>;
            },
            width: '33%',
        },
    ];

    const onPaginationChanged = (page) => {
        getVesselParticipantByEventId(page);
    }

    const checkIfParticipantExistsOnVesselParticipant = (participants) => {
        return participants.filter(p => {
            return p.id === participant.id
        }).length > 0;
    }

    const getVesselParticipantByEventId = async (page) => {
        setIsLoading(true);
        const response = await getManyByEventId(eventId, page);
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

    const assignParticipantToVesselParticipant = async (vesselParticipantId) => {
        const response = await registerParticipantsToVesselParticipant(vesselParticipantId, [participant.id]);

        if (response.success) {
            toast.success(t(translations.assign_vessel_participant_modal.successfully_register));
            getVesselParticipantByEventId(pagination.page);
        } else {
            if (response.error?.response
                && response.error?.response?.status === 422) {
                toast.error(t(translations.assign_vessel_participant_modal.competitor_already_assigned));
            } else {
                toast.error(t(translations.assign_vessel_participant_modal.an_error_happended_when_registering));
            }
        }
    }

    const removeParticipantFromVesselParticipant = async (vesselParticipantId) => {
        const response = await unregisterParticipantFromVesselParticipant(vesselParticipantId, participant.id);

        if (response.success) {
            toast.success(t(translations.assign_vessel_participant_modal.successfully_unregister));
            getVesselParticipantByEventId(pagination.page);
        } else {
            toast.error(t(translations.assign_vessel_participant_modal.an_error_happended_when_ungistering));
        }
    }

    React.useEffect(() => {
        if (showAssignModal)
            getVesselParticipantByEventId(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showAssignModal]);

    return (
        <StyledModal title={t(translations.assign_vessel_participant_modal.assign_vessel_to_vessel_group)}
            visible={showAssignModal}
            onCancel={() => setShowAssignModal(false)}
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
        </StyledModal>
    )
}

const StyledModal = styled(Modal)`
    width: 100% !important;

    .ant-modal-content {
        width: 100%;
    }

    ${media.medium`
        width: 1000px !important;

        .ant-modal-content {
            width: 1000px;
        }
    `}
`;