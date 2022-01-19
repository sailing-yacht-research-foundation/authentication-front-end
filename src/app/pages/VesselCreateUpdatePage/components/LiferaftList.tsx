import React from 'react';
import { Space, Spin, Table, Menu } from 'antd';
import { CreateButton, DeleteButton, PageHeaderContainer, PageHeaderTextSmall, TableWrapper } from 'app/components/SyrfGeneral';
import { AiFillPlusCircle } from 'react-icons/ai';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import ReactTooltip from 'react-tooltip';
import { renderEmptyValue } from 'utils/helpers';
import { getAllByVesselId } from 'services/live-data-server/liferafts';
import { SyrfFormWrapper } from 'app/components/SyrfForm';

export const LiferaftList = (props) => {

    const { t } = useTranslation();

    const { vesselId } = props;

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
            title: t(translations.vessel_create_update_page.public_name),
            dataIndex: 'lastServiceDate',
            key: 'lastServiceDate',
            render: (text, record) => renderEmptyValue(text),
        },
        {
            title: t(translations.vessel_create_update_page.manufacture_date),
            dataIndex: 'manufactureDate',
            key: 'manufactureDate',
            render: (text, record) => renderEmptyValue(text),
        },
        {
            title: t(translations.vessel_create_update_page.ownership),
            dataIndex: 'ownership',
            key: 'ownership',
            render: (text, record) => renderEmptyValue(text),
        },
        {
            title: t(translations.participant_list.action),
            key: 'action',
            fixed: true,
            render: (text, record) => (
                <Space size={10}>

                </Space>
            ),
        },
    ];

    const [lifeRafts, setLifeRafts] = React.useState<any[]>([]);

    const [liferaft, setLiferaft] = React.useState<any>({});

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

    const getAll = async () => {
        setIsLoading(true);
        const response = await getAllByVesselId(vesselId);
        setIsLoading(false);

        if (response.success) {
            setLifeRafts(response.data?.lifeRafts);
        }
    }

    React.useEffect(() => {
        getAll();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <SyrfFormWrapper>
            <Spin spinning={isLoading}>
                <PageHeaderContainer>
                    <PageHeaderTextSmall>{t(translations.vessel_create_update_page.liferafts)}</PageHeaderTextSmall>
                    {
                        <CreateButton data-tip={t(translations.tip.add_liferaft)} icon={<AiFillPlusCircle
                            style={{ marginRight: '5px' }}
                            size={18} />}>{t(translations.vessel_create_update_page.add)}</CreateButton>
                    }
                </PageHeaderContainer>
                <TableWrapper>
                    <Table columns={columns}
                        scroll={{ x: "max-content" }}
                        dataSource={lifeRafts} />
                </TableWrapper>
            </Spin>
            <ReactTooltip />
        </SyrfFormWrapper>
    )
}