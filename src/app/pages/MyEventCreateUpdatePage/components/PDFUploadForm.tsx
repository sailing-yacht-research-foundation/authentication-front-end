import React from 'react';
import { List } from 'antd';
import { SyrfFormWrapper } from 'app/components/SyrfForm';
import { CreateButton, PageHeaderContainer, PageHeaderTextSmall } from 'app/components/SyrfGeneral';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { PDFItem } from './PDFItem';
import { DownloadOutlined } from '@ant-design/icons';
import { CalendarEvent } from 'types/CalendarEvent';

interface IPDFUploadForm {
    event: Partial<CalendarEvent>,
    reloadParent?: Function,
    fullWidth?: boolean
}

export const PDFUploadForm = (props: IPDFUploadForm) => {

    const { event, reloadParent, fullWidth } = props;

    const list = [
        {
            name: 'Notice of Race',
            formFieldName: 'noticeOfRacePDF',
        },
        {
            name: 'Media Waiver',
            formFieldName: 'mediaWaiverPDF',
        },
        {
            name: 'Disclaimer',
            formFieldName: 'disclaimerPDF',
        }
    ];

    const { t } = useTranslation();

    const downloadAllPdfs = () => {
        list.forEach(pdf => {
            if (!!event[pdf.formFieldName]) {
                const link = document.createElement('a');
                link.target = '_blank';
                link.href = String(event[pdf.formFieldName]);
                link.setAttribute('download', `${pdf.formFieldName}.pdf`); //or any other extension
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        })
    }

    return (
        <SyrfFormWrapper style={fullWidth ? { width: '100%', padding: '30px 15px' }: {}}>
            <PageHeaderContainer>
                <PageHeaderTextSmall>{t(translations.my_event_create_update_page.pdf_documents)}</PageHeaderTextSmall>
                {(!!event.noticeOfRacePDF || !!event.mediaWaiverPDF || !!event.disclaimerPDF) && <CreateButton onClick={downloadAllPdfs} icon={<DownloadOutlined />}>{t(translations.my_event_create_update_page.download_all)}</CreateButton>}
            </PageHeaderContainer>

            <List
                className="demo-loadmore-list"
                itemLayout="horizontal"
                loading={false}
                dataSource={list}
                renderItem={item => (
                    <PDFItem item={item} event={event} reloadParent={reloadParent}  />
                )}
            />
        </SyrfFormWrapper>
    );
}