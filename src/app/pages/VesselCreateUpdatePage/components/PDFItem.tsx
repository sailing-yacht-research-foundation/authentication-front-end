import React from 'react';
import { List, Upload, Spin, Button } from 'antd';
import { uploadVesselPDF } from 'services/live-data-server/vessels';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';

export const PDFItem = (props) => {

    const { vessel, item, reloadVessel } = props;

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const { t } = useTranslation();

    const checkIfPdfExist = (pdfKey) => {
        const pdfs = vessel.equipmentManualPdfs;
        if (pdfs)
            return pdfs.hasOwnProperty(pdfKey);

        return false;
    }

    const uploadPDF = async (options, pdfKey) => {

        const { onSuccess, onError, file } = options;

        const fmData = new FormData();
        fmData.append(pdfKey, file);

        setIsLoading(true);
        const response = await uploadVesselPDF(vessel.id, fmData);
        setIsLoading(false);

        if (response.success) {
            onSuccess();
            reloadVessel();
        } else {
            onError();
            showToastMessageOnRequestError(response.error);
        }
    }

    const getFileDownloadURLUsingPdfKey = (pdfKey) => {
        return vessel?.equipmentManualPdfs[pdfKey];
    }

    return (<List.Item
        actions={[<Spin spinning={isLoading}>
            <Upload
                accept=".pdf"
                showUploadList={false}
                customRequest={options => uploadPDF(options, item.formFieldName)}
            >
                <Button type="link">{t(translations.general.upload)}</Button>
            </Upload>
        </Spin>, checkIfPdfExist(item.formFieldName) && <a rel="noreferrer" target='_blank' download href={getFileDownloadURLUsingPdfKey(item.formFieldName)}>{t(translations.general.download)}</a>]}
    >
        <span>{item.name}</span>
    </List.Item>)
}
