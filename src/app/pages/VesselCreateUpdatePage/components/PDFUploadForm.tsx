import React from 'react';
import { Button, List } from 'antd';
import { SyrfFormWrapper } from 'app/components/SyrfForm';
import { CreateButton, PageHeaderContainer, PageHeaderTextSmall } from 'app/components/SyrfGeneral';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { PDFItem } from './PDFItem';
import { DownloadOutlined } from '@ant-design/icons';

export const PDFUploadForm = (props) => {

    const { vessel, reloadVessel } = props;

    const list = [
        {
            name: 'Radar',
            formFieldName: 'radar',
        },
        {
            name: 'Instrument System',
            formFieldName: 'instrumentSystem',
        },
        {
            name: 'edcis',
            formFieldName: 'edcis',
        },
        {
            name: 'ssb',
            formFieldName: 'ssb',
        },
        {
            name: 'vhf',
            formFieldName: 'vhf',
        },
        {
            name: 'Pactor Modern',
            formFieldName: 'pactorModern',
        },
        {
            name: 'Water Maker',
            formFieldName: 'waterMaker',
        },
        {
            name: 'Generator',
            formFieldName: 'generator',
        },
        {
            name: 'Electrical Distribution System',
            formFieldName: 'electricalDistributionSystem',
        },
        {
            name: 'Engine',
            formFieldName: 'engine',
        }
    ];

    const { t } = useTranslation();

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
                <PageHeaderTextSmall>{t(translations.vessel_create_update_page.pdf_documents)}</PageHeaderTextSmall>
                { vessel.equipmentManualPdfs && <CreateButton onClick={downloadAllPdfs} icon={<DownloadOutlined />}>{t(translations.vessel_create_update_page.download_all)}</CreateButton>}
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