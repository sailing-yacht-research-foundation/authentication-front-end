import React from 'react';
import { List, Upload, Spin } from 'antd';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { uploadPdfs } from 'services/live-data-server/event-calendars';

export const PDFItem = (props) => {

    const { event, item, reloadParent } = props;

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const { t } = useTranslation();

    const checkIfPdfExist = (pdfKey) => {
        return event.hasOwnProperty(pdfKey) && !!event[pdfKey];
    }

    const uploadPDF = async (options, pdfKey) => {

        const { onSuccess, onError, file } = options;

        const fmData = new FormData();
        fmData.append(pdfKey, file);

        setIsLoading(true);
        const response = await uploadPdfs(event.id, fmData);
        setIsLoading(false);

        if (response.success) {
            onSuccess();
            reloadParent();
        } else {
            onError();
            showToastMessageOnRequestError(response.error);
        }
    }

    const getFileDownloadURLUsingPdfKey = (pdfKey) => {
        return event[pdfKey];
    }

    return (<List.Item
        actions={[<Spin spinning={isLoading}>
            <Upload
                accept=".pdf"
                showUploadList={false}
                customRequest={options => uploadPDF(options, item.formFieldName)}
            >
                <a>{t(translations.my_event_create_update_page.upload)}</a>
            </Upload>
        </Spin>, checkIfPdfExist(item.formFieldName) && <a target='_blank' download href={getFileDownloadURLUsingPdfKey(item.formFieldName)}>{t(translations.my_event_create_update_page.download)}</a>]}
    >
        <span>{item.name}</span>
    </List.Item>)
}