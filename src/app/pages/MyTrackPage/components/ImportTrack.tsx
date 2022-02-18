import { Modal, Spin, Form } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { SyrfFieldLabel, SyrfFormButton, SyrfInputField } from 'app/components/SyrfForm';
import { translations } from 'locales/translations';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { importExpeditionTrack, importGPXTrack } from 'services/live-data-server/my-tracks';
import { ImportTrackType } from 'utils/constants';
import { showToastMessageOnRequestError } from 'utils/helpers';

export const ImportTrack = ({ onTrackImported, showModal, setShowModal, type }: { onTrackImported: Function, showModal: boolean, setShowModal: Function, type: ImportTrackType }) => {

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
        const form = new FormData();
        let response;
        form.append('importFile', values['file']);
        form.append('trackName', values['trackName']);

        setIsLoading(true);

        if (type === ImportTrackType.GPX)
            response = await importGPXTrack(form);
        else
            response = await importExpeditionTrack(form);

        setIsLoading(false);

        if (response.success) {
            toast.success(t(translations.my_tracks_page.import_track_successfully));
            onTrackImported();
            hideModal();
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    const hideModal = () => {
        setShowModal(false);
        form.resetFields();
    }

    return (
        <Modal
            title={t(translations.my_tracks_page.import_track, { type: type === ImportTrackType.GPX ? 'GPX' : 'Expedition' })}
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
                    style={{ width: '100%' }}
                >
                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.my_tracks_page.track_name)}</SyrfFieldLabel>}
                        name="trackName"
                        rules={[{ required: true, message: t(translations.forms.please_fill_out_this_field) }, {
                            max: 45, message: t(translations.forms.please_input_no_more_than_characters, { numberOfChars: 45 })
                        }]}
                    >
                        <SyrfInputField />
                    </Form.Item>

                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.my_tracks_page.file, { type })}</SyrfFieldLabel>}
                        name="file"
                        valuePropName="fileList"
                        getValueFromEvent={normFile}
                        rules={[{ required: true, message: t(translations.my_tracks_page.please_select_a_file, { type }) }]}
                    >
                        <SyrfInputField type="file" accept={`.${type}`} />
                    </Form.Item>

                    <SyrfFormButton type="primary" htmlType="submit">
                        {t(translations.my_tracks_page.import)}
                    </SyrfFormButton>
                </Form>
            </Spin>
        </Modal>
    );
}