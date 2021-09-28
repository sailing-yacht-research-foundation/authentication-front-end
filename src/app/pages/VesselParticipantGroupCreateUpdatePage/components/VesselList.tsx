import React from 'react';
import { Space, Spin, Table } from 'antd';
import { BorderedButton, DeleteButton, PageHeaderContainer, PageHeaderTextSmall, TableWrapper } from 'app/components/SyrfGeneral';
import moment from 'moment';
import { getMany } from 'services/live-data-server/vessels';
import { getMany as getManyVesselParticipants, create, deleteVesselParticipant } from 'services/live-data-server/vessel-participants';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { TIME_FORMAT } from 'utils/constants';
import { Link } from 'react-router-dom';
import { renderEmptyValue } from 'utils/helpers';
import { toast } from 'react-toastify';

export const VesselList = (props) => {

    const { group } = props;

    const { t } = useTranslation();

    const [vesselParticipants, setVesselParticipants] = React.useState<any[]>([]);

    const columns = [
        {
            title: t(translations.vessel_list_page.public_name),
            dataIndex: 'publicName',
            key: 'publicName',
            render: (text, record) => {
                return <Link to={`/vessels/${record.id}/update`}>{text}</Link>;
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
            dataIndex: 'created_at',
            key: 'created_at',
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
                        <BorderedButton onClick={() => {
                            addToGroup(record.id);
                        }} type="primary">{t(translations.vessel_participant_group_create_update_page.add_to_group)}</BorderedButton> :
                        <DeleteButton onClick={() => removeFromGroup(record.id)}>{t(translations.vessel_participant_group_create_update_page.delete_from_group)}</DeleteButton>
                    }
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

        const response = await create(data);

        if (response.success) {
            toast.success(t(translations.vessel_participant_group_create_update_page.successfully_added_to_group));
            getAllUserVesselParticipants();
        } else {
            toast.error(t(translations.vessel_participant_group_create_update_page.an_error_happened_when_adding_vessel_to_this_group));
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
            const response = await deleteVesselParticipant(vesselParticipant.id);

            if (response.success) {
                toast.success(t(translations.vessel_participant_group_create_update_page.successfully_removed_vessel_from_the_group));
                getAllUserVesselParticipants();
            } else {
                toast.error(t(translations.vessel_participant_group_create_update_page.an_error_happened_when_removing_vessel_from_this_group));
            }
        }
    }

    const getAllUserVessels = async (page) => {
        setIsLoading(true);
        const response = await getMany(pagination.page);
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
        getAllUserVessels(page);
    }

    React.useEffect(() => {
        getAllUserVessels(1);
        getAllUserVesselParticipants();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Spin spinning={isLoading}>
                <PageHeaderContainer>
                    <PageHeaderTextSmall>{t(translations.vessel_list_page.vessels)}</PageHeaderTextSmall>
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