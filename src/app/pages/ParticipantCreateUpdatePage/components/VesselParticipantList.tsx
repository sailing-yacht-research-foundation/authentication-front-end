import React from 'react';
import { Spin, Table, Tooltip } from 'antd';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { getManyByEventId } from 'services/live-data-server/vessel-participants';
import { registerParticipantsToVesselParticipant, unregisterParticipantFromVesselParticipant } from 'services/live-data-server/participants';
import { toast } from 'react-toastify';
import {
    BorderedButton,
    PageInfoContainer,
    PageHeaderContainerResponsive,
    TableWrapper,
    DeleteButton,
    PageHeaderTextSmall
} from 'app/components/SyrfGeneral';
import { showToastMessageOnRequestError } from 'utils/helpers';

export const VesselParticipantList = (props) => {

    const { eventId, participant } = props;

    const { t } = useTranslation();

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const [pagination, setPagination] = React.useState<any>({
        page: 1,
        total: 0,
        rows: []
    });

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
            title: t(translations.general.action),
            key: 'action',
            render: (text, record) => {
                if (checkIfParticipantExistsOnVesselParticipant(record.participants)) {
                    return <Tooltip title={t(translations.tip.unassign_competitor_to_a_class_and_vessel)}>
                        <DeleteButton onClick={() => {
                            removeParticipantFromVesselParticipant(record.id);
                        }} danger>{t(translations.assign_vessel_participant_modal.unassign)}</DeleteButton>
                    </Tooltip>;
                }

                return <Tooltip title={t(translations.tip.assign_competitor_to_a_class_and_vessel)}>
                    <BorderedButton onClick={() => {
                        assignParticipantToVesselParticipant(record.id);
                    }} type="primary">{t(translations.assign_vessel_participant_modal.assign)}</BorderedButton>
                </Tooltip>;
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
                showToastMessageOnRequestError(response.error);
            }
        }
    }

    const removeParticipantFromVesselParticipant = async (vesselParticipantId) => {
        const response = await unregisterParticipantFromVesselParticipant(vesselParticipantId, participant.id);

        if (response.success) {
            toast.success(t(translations.assign_vessel_participant_modal.successfully_unregister));
            getVesselParticipantByEventId(pagination.page);
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    React.useEffect(() => {
        getVesselParticipantByEventId(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <PageHeaderContainerResponsive style={{ 'alignSelf': 'flex-start', width: '100%' }}>
                <PageInfoContainer>
                    <PageHeaderTextSmall>{t(translations.participant_unit_create_update_page.assign_competitor_to_class_and_vessel)}</PageHeaderTextSmall>
                </PageInfoContainer>
            </PageHeaderContainerResponsive>
            <Spin spinning={isLoading} >
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
            </Spin >
        </>
    )
}
