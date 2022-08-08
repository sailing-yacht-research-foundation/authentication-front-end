import React from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Spin, Form, Checkbox, Divider } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { SyrfFieldLabel, SyrfFormButton, SyrfInputField } from 'app/components/SyrfForm';
import { translations } from 'locales/translations';
import { CalendarEvent } from 'types/CalendarEvent';
import { uploadDocuments } from 'services/live-data-server/event-calendars';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { toast } from 'react-toastify';

interface IArbitraryDocumentUploadForm {
    event: Partial<CalendarEvent>,
    showModal: boolean,
    setShowModal: Function,
    reloadParent: Function
}

export const ArbitraryDocumentUploadForm = ({ event, showModal, setShowModal, reloadParent }: IArbitraryDocumentUploadForm) => {

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const [form] = useForm();

    const { t } = useTranslation();

    const normFile = (e: any) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.target?.files[0];
    }

    const onFinish = async (values) => {
        const { fields } = values;

        setIsLoading(true);
        for (const field of fields) {
            const form = new FormData();
            form.append('documentFile', field.documentFile);
            form.append('documentName', field.documentName);
            form.append('isRequired', String(!!field.isRequired));

            const response = await uploadDocuments(event.id, form);

            if (!response.success) {
                showToastMessageOnRequestError(response.error);
            } else {
                toast.success(t(translations.my_event_create_update_page.document_uploaded, { fileName: field.documentName }));
            }
        }

        form.resetFields();
        setIsLoading(false);
        setShowModal(false);
        reloadParent();
    }

    const hideModal = () => {
        setShowModal(false);
        form.resetFields();
    }

    return (
        <Modal
            title={t(translations.my_event_create_update_page.upload_arbitrary_documents)}
            bodyStyle={{ display: 'flex', justifyContent: 'center', overflow: 'hidden', flexDirection: 'column' }}
            visible={showModal}
            footer={null}
            onCancel={hideModal}
        >
            <Spin spinning={isLoading}>
                <Form
                    form={form}
                    layout="vertical"
                    name="basic"
                    onFinish={onFinish}
                    initialValues={
                        { fields: [undefined] }
                    }
                    style={{ width: '100%' }}
                >
                    <Form.List name="fields">
                        {(fields) => {
                            return (
                                <div>
                                    {fields.map((field, index) => (
                                        <div key={field.key}>
                                            <Form.Item
                                                label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.document_name)}</SyrfFieldLabel>}
                                                name={[field.name, 'documentName']}
                                                rules={[{ required: true, message: t(translations.forms.please_fill_out_this_field) }, {
                                                    max: 45, message: t(translations.forms.please_input_no_more_than_characters, { numberOfChars: 45 })
                                                }, ({ getFieldValue }) => ({
                                                    validator(_, value) {
                                                        if (fields.length === 1) return Promise.resolve();
                                                        for (let i = 0; i < fields.length; i++) {
                                                            if (((i !== index) && (getFieldValue(['fields', i, 'documentName']) !== value)) || !value) {
                                                                return Promise.resolve();
                                                            }
                                                        }
                                                        return Promise.reject(new Error(t(translations.my_event_create_update_page.this_name_has_been_used_before_please_try_another_name)));
                                                    },
                                                })]}
                                            >
                                                <SyrfInputField  />
                                            </Form.Item>

                                            <Form.Item
                                                label={<SyrfFieldLabel>{t(translations.my_event_create_update_page.pdf_file)}</SyrfFieldLabel>}
                                                name={[field.name, 'documentFile']}
                                                valuePropName="fileList"
                                                getValueFromEvent={normFile}
                                                rules={[{ required: true, message: t(translations.my_tracks_page.please_select_a_file) }]}
                                            >
                                                <SyrfInputField type="file" accept={`.pdf`} />
                                            </Form.Item>

                                            <Form.Item
                                                valuePropName="checked"
                                                name={[field.name, 'isRequired']}
                                            >
                                                <Checkbox>{t(translations.my_event_create_update_page.require_competitor_signature)}</Checkbox>
                                            </Form.Item>
                                            <Divider />
                                        </div>
                                    ))}
                                </div>
                            );
                        }}
                    </Form.List>

                    <SyrfFormButton type="primary" htmlType="submit">
                        {t(translations.my_event_create_update_page.upload)}
                    </SyrfFormButton>
                </Form>
            </Spin>
        </Modal>
    );
}
