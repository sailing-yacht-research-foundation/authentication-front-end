import React from 'react';
import { List, Space, Spin } from 'antd';
import { SyrfFormWrapper } from 'app/components/SyrfForm';
import { CreateButton, IconWrapper, PageHeaderContainer, PageHeaderTextSmall } from 'app/components/SyrfGeneral';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { PDFItem } from './PDFItem';
import { DownloadOutlined } from '@ant-design/icons';
import { CalendarEvent } from 'types/CalendarEvent';
import styled from 'styled-components';
import { getUserName } from 'utils/user-utils';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/pages/LoginPage/slice/selectors';
import { ArbitraryDocumentUploadForm } from './ArbitraryDocumentUploadForm';
import { getArbitraryDocumentsUsingEventId } from 'services/live-data-server/event-calendars';
import { DocumentItem } from './DocumentItem';
import { FaUpload } from 'react-icons/fa';

interface IPDFUploadForm {
    event: Partial<CalendarEvent>,
    reloadParent?: Function,
    fullWidth?: boolean
}

export const PDFUploadForm = (props: IPDFUploadForm) => {

    const { event, reloadParent, fullWidth } = props;

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const [showArbitraryDocumentUploadModal, setShowArbitraryDocumentUploadModal] = React.useState<boolean>(false);

    const { t } = useTranslation();

    const authUser = useSelector(selectUser);

    const [arbitraryPagination, setArbitraryPagination] = React.useState<any>({
        page: 1,
        total: 0,
        rows: [],
        size: 10
    });

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

    const downloadAllWaivers = () => {
        list.forEach(pdf => {
            if (!!event[pdf.formFieldName]) {
                generateDownLoadLink(pdf.formFieldName, String(event[pdf.formFieldName]));
            }
        })
    }

    const downloadAllDocuments = () => {
        arbitraryPagination.rows.forEach(item => {
            generateDownLoadLink(item.documentName, item.documentUrl);
        })
    }

    const generateDownLoadLink = (name, url) => {
        const link = document.createElement('a');
        link.target = '_blank';
        link.href = url;
        link.setAttribute('download', `${name}.pdf`); //or any other extension
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const canShowSignWaiverAlert = () => {
        let waiverCount = 0;
        const pdfs = ['noticeOfRacePDF', 'mediaWaiverPDF', 'disclaimerPDF'];
        Object.keys(event).forEach(key => {
            if (pdfs.includes(key) && event[key] !== null) {
                waiverCount++;
            }
        });

        const hasUnsignedDocuments = arbitraryPagination.rows.filter(item => !item.signDate && item.isRequired).length > 0;

        return event.isParticipant
            && (event.agreedWaivers?.length! < waiverCount
                || hasUnsignedDocuments);
    }

    const getArbitraryDocuments = async (page, size) => {
        setIsLoading(true);
        const response = await getArbitraryDocumentsUsingEventId(event.id, page, size);
        setIsLoading(false);

        if (response.success) {
            setArbitraryPagination({
                ...arbitraryPagination,
                rows: response.data.rows,
                page,
                size,
                total: response.data.count
            });
        }
    }

    React.useEffect(() => {
        if (event.id) getArbitraryDocuments(arbitraryPagination.page, arbitraryPagination.size);
    }, [event]);

    return (
        <SyrfFormWrapper style={fullWidth ? { width: '100%', padding: '30px 15px' } : {}}>
            <ArbitraryDocumentUploadForm reloadParent={() => getArbitraryDocuments(arbitraryPagination.page, arbitraryPagination.size)} event={event} showModal={showArbitraryDocumentUploadModal} setShowModal={setShowArbitraryDocumentUploadModal} />
            <PageHeaderContainer>
                <PageHeaderTextSmall>{t(translations.my_event_create_update_page.pdf_documents)}</PageHeaderTextSmall>
            </PageHeaderContainer>

            <List
                header={<DocumentTitleWrapper>
                    <DocumentTitle>{t(translations.my_event_create_update_page.waiver_documents)}</DocumentTitle>
                    {(!!event.noticeOfRacePDF || !!event.mediaWaiverPDF || !!event.disclaimerPDF) && <CreateButton onClick={downloadAllWaivers} icon={<DownloadOutlined />}>{t(translations.my_event_create_update_page.download_all)}</CreateButton>}
                </DocumentTitleWrapper>}
                itemLayout="horizontal"
                loading={false}
                dataSource={list}
                renderItem={item => (
                    <PDFItem item={item} event={event} reloadParent={reloadParent} />
                )}
            />

            <Spin spinning={isLoading}>
                <List
                    style={{ marginTop: '10px' }}
                    itemLayout="horizontal"
                    header={<DocumentTitleWrapper>
                        <DocumentTitle>{t(translations.my_event_create_update_page.additional_documents)}</DocumentTitle>
                        <Space size={5}>
                            {event.isEditor && <CreateButton
                                onClick={() => setShowArbitraryDocumentUploadModal(true)}
                                icon={<IconWrapper><FaUpload /></IconWrapper>}>{t(translations.my_event_create_update_page.upload)}</CreateButton>}
                            {arbitraryPagination.rows.length > 0 && <CreateButton onClick={downloadAllDocuments} icon={<DownloadOutlined />}>{t(translations.my_event_create_update_page.download_all)}</CreateButton>}
                        </Space>

                    </DocumentTitleWrapper>}
                    loading={false}
                    dataSource={arbitraryPagination.rows}
                    pagination={{
                        onChange: (page, size) => {
                            getArbitraryDocuments(page, size)
                        },
                        current: arbitraryPagination.page,
                        defaultCurrent: arbitraryPagination.page,
                        pageSize: arbitraryPagination.size,
                    }}
                    renderItem={item => (
                        <DocumentItem item={item} event={event} reloadParent={reloadParent} />
                    )}
                />
            </Spin>

            {canShowSignWaiverAlert() && <ParticipantSignWaiverMessage>{t(translations.event_detail_page.hey_competitor_you_havent_signed_all_the_waivers, { competitorName: getUserName(authUser) })}</ParticipantSignWaiverMessage>}


        </SyrfFormWrapper>
    );
}

const ParticipantSignWaiverMessage = styled.div`
    margin-top: 30px;
    color: #00000073;
    text-align: center;
`;

const DocumentTitle = styled.h4``;

const DocumentTitleWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`;