import React from 'react';
import { Space, Spin, Table, Tooltip } from 'antd';
import { BorderedButton, CreateButton, PageHeaderContainer, PageHeaderTextSmall, TableWrapper } from 'app/components/SyrfGeneral';
import { AiFillPlusCircle } from 'react-icons/ai';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { renderEmptyValue } from 'utils/helpers';
import { getAllByVesselId } from 'services/live-data-server/liferafts';
import { SyrfFormWrapper } from 'app/components/SyrfForm';
import { useHistory } from 'react-router-dom';
import { TIME_FORMAT } from 'utils/constants';
import moment from 'moment';
import { DeleteLiferaftModal } from 'app/pages/LiferaftCreateUpdatePage/components/DeleteLifeRaftModal';

export const LiferaftList = (props) => {

    const { t } = useTranslation();

    const { vesselId } = props;

    const history = useHistory();

    const columns = [
        {
            title: t(translations.vessel_create_update_page.serial_number),
            dataIndex: 'serialNumber',
            key: 'serialNumber',
            render: (text, record) => renderEmptyValue(text),
        },
        {
            title: t(translations.vessel_create_update_page.capacity),
            dataIndex: 'capacity',
            key: 'capacity',
            render: (text, record) => renderEmptyValue(text),
        },
        {
            title: t(translations.vessel_create_update_page.manufacturer),
            dataIndex: 'manufacturer',
            key: 'manufacturer',
            render: (text, record) => renderEmptyValue(text),
        },
        {
            title: t(translations.vessel_create_update_page.model),
            dataIndex: 'model',
            key: 'model',
            render: (text, record) => renderEmptyValue(text),
        },
        {
            title: t(translations.vessel_create_update_page.container),
            dataIndex: 'container',
            key: 'container',
            render: (text, record) => renderEmptyValue(text),
        },
        {
            title: t(translations.vessel_create_update_page.last_service_date),
            dataIndex: 'lastServiceDate',
            key: 'lastServiceDate',
            render: (text, record) => text && moment(text).format(TIME_FORMAT.date_text),
        },
        {
            title: t(translations.vessel_create_update_page.manufacture_date),
            dataIndex: 'manufactureDate',
            key: 'manufactureDate',
            render: (text, record) => text && moment(text).format(TIME_FORMAT.date_text),
        },
        {
            title: t(translations.vessel_create_update_page.ownership),
            dataIndex: 'ownership',
            key: 'ownership',
            render: (text, record) => renderEmptyValue(text),
        },
        {
            title: t(translations.general.action),
            key: 'action',
            fixed: true,
            render: (text, record) => (
                <Space size={10}>
                    <Tooltip title={t(translations.tip.update_information_for_this_liferaft)}>
                        <BorderedButton onClick={() => {
                            history.push(`/boats/${vesselId}/liferafts/${record.id}/update`);
                        }} type="primary">
                            {t(translations.general.update)}
                        </BorderedButton>
                    </Tooltip>
                    <Tooltip title={t(translations.tip.delete_this_liferaft)}>
                        <BorderedButton danger onClick={() => showDeleteLiferaftModal(record)}>
                            {t(translations.general.delete)}
                        </BorderedButton>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    const [lifeRafts, setLifeRafts] = React.useState<any[]>([]);

    const [liferaft, setLiferaft] = React.useState<any>({});

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

    const showDeleteLiferaftModal = (liferaft) => {
        setLiferaft(liferaft);
        setShowDeleteModal(true);
    }

    const getAll = async () => {
        setIsLoading(true);
        const response = await getAllByVesselId(vesselId);
        setIsLoading(false);

        if (response.success) {
            setLifeRafts(response.data?.lifeRafts);
        }
    }

    const onLiferaftDeleted = () => {
        getAll();
    }

    React.useEffect(() => {
        getAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <SyrfFormWrapper>
            <DeleteLiferaftModal
                liferaft={liferaft}
                onLiferaftDeleted={onLiferaftDeleted}
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
            />
            <Spin spinning={isLoading}>
                <PageHeaderContainer>
                    <PageHeaderTextSmall>{t(translations.vessel_create_update_page.liferafts)}</PageHeaderTextSmall>
                    {
                        <Tooltip title={t(translations.tip.add_liferaft)}>
                            <CreateButton onClick={() => history.push(`/boats/${vesselId}/liferafts/create`)} icon={<AiFillPlusCircle
                                style={{ marginRight: '5px' }}
                                size={18} />}>
                                {t(translations.vessel_create_update_page.add)}
                            </CreateButton>
                        </Tooltip>
                    }
                </PageHeaderContainer>
                <TableWrapper>
                    <Table columns={columns}
                        scroll={{ x: "max-content" }}
                        dataSource={lifeRafts} />
                </TableWrapper>
            </Spin>
        </SyrfFormWrapper>
    )
}
