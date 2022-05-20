import React from 'react';
import { List, Upload, Spin, Button, Modal, Form, Checkbox } from 'antd';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { agreeToWaiver, uploadPdfs } from 'services/live-data-server/event-calendars';
import { CalendarEvent } from 'types/CalendarEvent';
import { useForm } from 'antd/lib/form/Form';
import { SyrfInputField } from 'app/components/SyrfForm';
import { toast } from 'react-toastify';

export const PDFItem = (props) => {

    const { event, item, reloadParent }: { event: CalendarEvent, item: any, reloadParent: Function } = props;

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const [showSignModal, setShowSignModal] = React.useState<boolean>(false);

    const [waiverType, setWaiverType] = React.useState<string>('');

    const [form] = useForm();

    const { t } = useTranslation();

    const checkIfPdfExist = (pdfKey) => {
        return event.hasOwnProperty(pdfKey) && !!event[pdfKey];
    }

    const uploadPDF = async (options, pdfKey) => {

        const { onSuccess, onError, file } = options;

        const fmData = new FormData();
        fmData.append(pdfKey, file);

        setIsLoading(true);
        const response = await uploadPdfs(event.id!, fmData);
        setIsLoading(false);

        if (response.success) {
            onSuccess();
            reloadEvent();
        } else {
            onError();
            showToastMessageOnRequestError(response.error);
        }
    }

    const canUpload = () => {
        return event.isEditor;
    }

    const getFileDownloadURLUsingPdfKey = (pdfKey) => {
        return event[pdfKey];
    }

    const showSignWaiverModal = type => {
        setShowSignModal(true);
        setWaiverType(type);
    }

    const reloadEvent = () => {
        if (reloadParent)
            reloadParent();
    }

    const signWaiver = () => {
        form
            .validateFields()
            .then(async () => {
                setIsLoading(true);
                const response = await agreeToWaiver(event.id!, waiverType);
                setIsLoading(false);

                if (response.success) {
                    toast.success(t(translations.event_detail_page.successfully_signed_waiver));
                    reloadEvent();
                } else {
                    showToastMessageOnRequestError(response.error);
                }

                setShowSignModal(false);
            })
            .catch(() => {
                // no UI/UX throw here so leave this blank for now, just need the validation.
            });
    }

    const canSignWaiver = () => {
        return checkIfPdfExist(item.formFieldName)
            && event.isParticipant
            && !event.isEditor
            && event.agreedWaivers?.filter(waiver => {
                return waiver.waiverType === item.formFieldName
            }).length === 0;
    }

    return (<>
        <Modal visible={showSignModal}
            confirmLoading={isLoading}
            onCancel={() => setShowSignModal(false)}
            onOk={signWaiver}
            title={t(translations.event_detail_page.sign_waiver)}
            okText={t(translations.event_detail_page.sign_waiver)}
            width={1000}
        >
            <object width="100%" height="700" data={getFileDownloadURLUsingPdfKey(item.formFieldName)} type="application/pdf">
                <a href={getFileDownloadURLUsingPdfKey(item.formFieldName)}>test.pdf</a>
            </object>

            <Form
                form={form}
                style={{ marginTop: '10px' }}
                layout="vertical"
                name="basic"
                onFinish={signWaiver}
            >
                <Form.Item
                    name="name"
                    rules={[{ required: true, message: t(translations.forms.please_fill_out_this_field) }]}
                >
                    <SyrfInputField placeholder={t(translations.forms.please_input_your_name)} />
                </Form.Item>

                <Form.Item
                    valuePropName="checked"
                    name="agreeTermAndCondition"
                    rules={[
                        {
                            validator: (_, value) =>
                                value ? Promise.resolve() : Promise.reject(new Error(t(translations.event_detail_page.please_agree_to_the_terms_and_conditions_of_the_event))),
                        },
                    ]}
                >
                    <Checkbox>{t(translations.event_detail_page.i_agree)}</Checkbox>
                </Form.Item>
            </Form>
        </Modal>
        <List.Item
            actions={[
                (<Spin spinning={isLoading}>
                    {canUpload() && <Upload
                        accept=".pdf"
                        showUploadList={false}
                        customRequest={options => uploadPDF(options, item.formFieldName)}
                    >
                        <Button type="link">{t(translations.my_event_create_update_page.upload)}</Button>
                    </Upload>}
                </Spin>),
                (checkIfPdfExist(item.formFieldName) ? <a rel="noreferrer" target='_blank' download href={getFileDownloadURLUsingPdfKey(item.formFieldName)}>{t(translations.my_event_create_update_page.download)}</a> : <span>N/A</span>),
                canSignWaiver() && <Button type='link' onClick={e => showSignWaiverModal(item.formFieldName)}>Sign</Button>
            ]}
        >
            <span>{item.name}</span>
        </List.Item>
    </>)
}