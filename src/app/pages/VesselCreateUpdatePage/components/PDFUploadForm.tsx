import React from 'react';
import { List } from 'antd';
import { SyrfFormWrapper } from 'app/components/SyrfForm';
import { CreateButton, PageHeaderContainer, PageHeaderDescription, PageHeaderTextSmall } from 'app/components/SyrfGeneral';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { PDFItem } from './PDFItem';
import { DownloadOutlined } from '@ant-design/icons';

export const PDFUploadForm = (props) => {

    const { vessel, reloadVessel } = props;

    const { t } = useTranslation();

    const list = [
        {
            name: t(translations.vessel_create_update_page.radar),
            formFieldName: 'radar',
        },
        {
            name: t(translations.vessel_create_update_page.instrument_system),
            formFieldName: 'instrumentSystem',
        },
        {
            name: 'EDCIS',
            formFieldName: 'edcis',
        },
        {
            name: 'SSB',
            formFieldName: 'ssb',
        },
        {
            name: 'VHF',
            formFieldName: 'vhf',
        },
        {
            name: t(translations.vessel_create_update_page.pactor_moderm),
            formFieldName: 'pactorModem',
        },
        {
            name: t(translations.vessel_create_update_page.water_maker),
            formFieldName: 'waterMaker',
        },
        {
            name: t(translations.vessel_create_update_page.generator),
            formFieldName: 'generator',
        },
        {
            name: t(translations.vessel_create_update_page.electrical_distribution_system),
            formFieldName: 'electricalDistributionSystem',
        },
        {
            name: t(translations.vessel_create_update_page.engine),
            formFieldName: 'engine',
        }
    ];

    const downloadAllPdfs = () => {
        for (const [key, value] of Object.entries(vessel.equipmentManualPdfs)) {
            const link = document.createElement('a');
            link.target = '_blank';
            link.href = String(value);
            link.setAttribute('download', `${key}.pdf`); //or any other extension
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    return (
        <SyrfFormWrapper>
            <PageHeaderContainer>
                <div>
                    <PageHeaderTextSmall>{t(translations.vessel_create_update_page.equipment_manuals)}</PageHeaderTextSmall>
                    <PageHeaderDescription>{t(translations.vessel_create_update_page.upload_your_equipment_manuals_so_that_your_crews)}</PageHeaderDescription>
                </div>
                {vessel.equipmentManualPdfs && <CreateButton onClick={downloadAllPdfs} icon={<DownloadOutlined />}>{t(translations.vessel_create_update_page.download_all)}</CreateButton>}
            </PageHeaderContainer>

            <List
                className="demo-loadmore-list"
                itemLayout="horizontal"
                loading={false}
                dataSource={list}
                renderItem={item => (
                    <PDFItem item={item} vessel={vessel} reloadVessel={reloadVessel} />
                )}
            />
        </SyrfFormWrapper>
    );
}