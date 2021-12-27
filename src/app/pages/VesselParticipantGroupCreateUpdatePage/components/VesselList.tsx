import React from 'react';
import { Input, Space, Spin, Table } from 'antd';
import { BorderedButton, CreateButton, DeleteButton, PageHeaderContainer, PageHeaderTextSmall, TableWrapper } from 'app/components/SyrfGeneral';
import moment from 'moment';
import { getManyVesselsByEventCalendarId } from 'services/live-data-server/vessels';
import { getMany as getManyVesselParticipants, create, deleteVesselParticipant } from 'services/live-data-server/vessel-participants';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { TIME_FORMAT } from 'utils/constants';
import { Link } from 'react-router-dom';
import { renderEmptyValue, showToastMessageOnRequestError } from 'utils/helpers';
import { toast } from 'react-toastify';
import { AiFillPlusCircle } from 'react-icons/ai';
import { create as createVessel } from 'services/live-data-server/vessels';
import { DeleteVesselModal } from 'app/pages/VesselListPage/components/DeleteVesselModal';
import ReactTooltip from 'react-tooltip';

export const VesselList = (props) => {

    const { group, eventId } = props;

    const { t } = useTranslation();

    const [vesselParticipants, setVesselParticipants] = React.useState<any[]>([]);

    const [numberOfBoatsToCreate, setNumberOfBoatsToCreate] = React.useState<any>(0);

    const columns = [
        {
            title: t(translations.vessel_list_page.public_name),
            dataIndex: 'publicName',
            key: 'publicName',
            render: (text, record) => {
                return <Link data-tip={t(translations.tip.update_this_boat)} to={`/boats/${record.id}/update`}>{text}</Link>;
            },
        },
        {
            title: t(translations.vessel_list_page.length_in_meters),
            dataIndex: 'lengthInMeters',
            key: 'lengthInMeters',
            render: (value) => renderEmptyValue(value),
        },
        {
            title: t(translations.vessel_list_page.created_date),
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (value) => moment(value).format(TIME_FORMAT.date_text),
            width: '20%',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => {
                const vesselParticipant: any = findVesselParticipantByVesselIdAndGroupId(record.id);
                return <Space size="middle">
                    {!vesselParticipant ?
                        <BorderedButton 
                        data-tip={t(translations.tip.add_boat_to_class)}
                        onClick={() => {
                            addToGroup(record.id);
                        }} type="primary">{t(translations.vessel_participant_group_create_update_page.add_to_group)}</BorderedButton> :
                        <DeleteButton data-tip={t(translations.tip.remove_boat_from_class)} onClick={() => removeFromGroup(record.id)}>{t(translations.vessel_participant_group_create_update_page.delete_from_group)}</DeleteButton>
                    }
                    <BorderedButton data-tip={t(translations.tip.delete_boat)} danger onClick={() => showDeleteVesselModal(record)}>{t(translations.vessel_list_page.delete)}</BorderedButton>
                    <ReactTooltip />
                </Space>;
            },
            width: '20%',
        },
    ];

    const [pagination, setPagination] = React.useState<any>({
        page: 1,
        total: 0,
        rows: []
    });

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

    const [vessel, setVessel] = React.useState<any>({});

    const showDeleteVesselModal = (vessel) => {
        setShowDeleteModal(true);
        setVessel(vessel);
    }

    const getAllUserVesselParticipants = async () => {
        setIsLoading(true);
        const response = await getManyVesselParticipants(undefined);
        setIsLoading(false);

        if (response.success) {
            setVesselParticipants(response.data?.rows);
        }
    }

    const addToGroup = async (vesselId) => {
        const data = {
            vesselParticipantGroupId: group.id,
            vesselId: vesselId,
            vesselParticipantId: ''
        }

        setIsLoading(true);
        const response = await create(data);
        setIsLoading(false);

        if (response.success) {
            toast.success(t(translations.vessel_participant_group_create_update_page.successfully_added_to_group));
            getAllUserVesselParticipants();
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    const findVesselParticipantByVesselIdAndGroupId = (vesselId) => {
        return vesselParticipants.filter(vp => {
            return vp.vesselId === vesselId && vp.vesselParticipantGroupId === group.id
        })[0];
    }

    const removeFromGroup = async (vesselId) => {
        const vesselParticipant: any = findVesselParticipantByVesselIdAndGroupId(vesselId);

        if (vesselParticipant) {
            setIsLoading(true);
            const response = await deleteVesselParticipant(vesselParticipant.id);
            setIsLoading(false);

            if (response.success) {
                toast.success(t(translations.vessel_participant_group_create_update_page.successfully_removed_vessel_from_the_group));
                getAllUserVesselParticipants();
            } else {
                showToastMessageOnRequestError(response.error);
            }
        }
    }

    const getAllUserAndEventVessels = async (page) => {
        setIsLoading(true);
        const response = await getManyVesselsByEventCalendarId(eventId, page);
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
        getAllUserAndEventVessels(page);
    }

    const onVesselDeleted = () => {
        getAllUserAndEventVessels(pagination.page);
    }

    const createNVessels = async () => {
        const minimumVesselsToCreate = 1;
        const maximumVesselsToCreate = 30;

        if (numberOfBoatsToCreate < minimumVesselsToCreate) {
            toast.error(t(translations.vessel_list_page.the_number_of_boats_must_be_greater_than_zero));
            return;
        } else if (numberOfBoatsToCreate > maximumVesselsToCreate) {
            toast.error(t(translations.vessel_list_page.the_number_of_boats_must_not_more_than_30));
            return;
        }

        setIsLoading(true);
        for (let i = 0; i < numberOfBoatsToCreate; i++) {
            await createVessel({
                publicName: `Boat ${i + 1}`,
                lengthInMeters: null,
                orcJsonPolars: {},
                bulkCreated: true,
                scope: eventId
            });
        }
        setIsLoading(false);
        getAllUserAndEventVessels(1);
        toast.success(t(translations.vessel_list_page.successfully_created_vessels, { number_of_vessels: numberOfBoatsToCreate }))
    }

    React.useEffect(() => {
        getAllUserAndEventVessels(1);
        getAllUserVesselParticipants();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <DeleteVesselModal
                vessel={vessel}
                onVesselDeleted={onVesselDeleted}
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
            />
            <Spin spinning={isLoading}>
                <PageHeaderContainer>
                    <PageHeaderTextSmall>{t(translations.vessel_list_page.vessels)}</PageHeaderTextSmall>
                    <Space>
                        <Input value={numberOfBoatsToCreate} onChange={e => {
                            setNumberOfBoatsToCreate(e.target.value)
                        }} type="number" style={{ width: '70px' }} />
                        <CreateButton
                            data-tip={t(translations.tip.create_n_boats)}
                            onClick={() => createNVessels()}
                            icon={<AiFillPlusCircle
                                style={{ marginRight: '5px' }}
                                size={18} />}>{t(translations.vessel_list_page.create)}</CreateButton>
                    </Space>
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