import React from 'react';
import { List } from 'antd';
import { SyrfFormWrapper } from 'app/components/SyrfForm';
import { CreateButton, PageHeaderContainer, PageHeaderTextSmall } from 'app/components/SyrfGeneral';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { PDFItem } from './PDFItem';
import { DownloadOutlined } from '@ant-design/icons';
import { CalendarEvent } from 'types/CalendarEvent';
import styled from 'styled-components';
import { getUserName } from 'utils/user-utils';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/pages/LoginPage/slice/selectors';

interface IPDFUploadForm {
    event: Partial<CalendarEvent>,
    reloadParent?: Function,
    fullWidth?: boolean
}

export const PDFUploadForm = (props: IPDFUploadForm) => {

    const { event, reloadParent, fullWidth } = props;

    const { t } = useTranslation();

    const authUser = useSelector(selectUser);

    const list = [
        {
            name: t(translations.my_event_create_update_page.notice_of_race),
            formFieldName: 'noticeOfRacePDF',
        },
        {
            name: t(translations.my_event_create_update_page.media_waiver),
            formFieldName: 'mediaWaiverPDF',
        },
        {
            name: t(translations.my_event_create_update_page.disclaimer),
            formFieldName: 'disclaimerPDF',
        }
    ];

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

    const canShowSignWaiverAlert = () => {
        let waiverCount = 0;
        const pdfs = ['noticeOfRacePDF', 'mediaWaiverPDF', 'disclaimerPDF'];
        Object.keys(event).forEach(key => {
            if (pdfs.includes(key) && event[key] !== null) {
                waiverCount++;
            }
        });

        return event.isParticipant && !event.isEditor && event.agreedWaivers?.length! < waiverCount;
    }

    return (
        <SyrfFormWrapper style={fullWidth ? { width: '100%', padding: '30px 15px' } : {}}>
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
                    <PDFItem item={item} event={event} reloadParent={reloadParent} />
                )}
            />

            {canShowSignWaiverAlert() && <ParticipantSignWaiverMessage>{t(translations.event_detail_page.hey_competitor_you_havent_signed_all_the_waivers, { competitorName: getUserName(authUser) })}</ParticipantSignWaiverMessage>}

        </SyrfFormWrapper>
    );
}

const ParticipantSignWaiverMessage = styled.div`
    color: #00000073;
    text-align: center;
`;