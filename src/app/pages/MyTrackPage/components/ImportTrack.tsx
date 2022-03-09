import React from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { importExpeditionTrack, importGPXTrack } from 'services/live-data-server/my-tracks';
import { getMany } from 'services/live-data-server/vessels';
import { Vessel } from 'types/Vessel';
import { ImportTrackType } from 'utils/constants';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { Modal, Spin, Form, Select, Switch, Radio } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { SyrfFieldLabel, SyrfFormButton, SyrfFormSelect, SyrfInputField } from 'app/components/SyrfForm';
import { translations } from 'locales/translations';

const radioValue = {
    USE_DEFAULT_BOATS: 1,
    CREATE_NEW_BOAT: 2,
    USE_DEFAULT_NAME: 3
}

export const ImportTrack = ({ onTrackImported, showModal, setShowModal, type }: { onTrackImported: Function, showModal: boolean, setShowModal: Function, type: ImportTrackType }) => {

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const [boats, setBoats] = React.useState<Vessel[]>([]);

    const [selectedRadioValue, setSelectedRadioValue] = React.useState<number>(radioValue.USE_DEFAULT_BOATS);

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
        const { file, trackName, vesselId, vesselName } = values;

        form.append('importFile', file);
        form.append('trackName', trackName);
        if (selectedRadioValue === radioValue.USE_DEFAULT_BOATS) {
            form.append('vesselId', vesselId);
        } else if (selectedRadioValue === radioValue.CREATE_NEW_BOAT) {
            form.append('vesselName', vesselName);
        }

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

    const getUserBoats = async () => {
        const response = await getMany(1, 100);

        if (response.success) {
            setBoats(response.data?.rows);
            if (response.data?.count > 0) {
                form.setFieldsValue({
                    vesselId: response.data?.rows[0]?.id
                });
            }
        }
    }

    const renderBoatsList = () => {
        return boats.map(item => <Select.Option value={item.id}>{item.publicName}</Select.Option>)
    }

    React.useEffect(() => {
        getUserBoats();
    }, []);

    const onRadioChanged = (e) => {
        setSelectedRadioValue(e.target.value);
    }

    const renderFormFieldsBaseOnRadioValue = () => {
        switch (selectedRadioValue) {
            case radioValue.CREATE_NEW_BOAT:
                return <Form.Item
                    label={<SyrfFieldLabel>{t(translations.my_tracks_page.boat_name)}</SyrfFieldLabel>}
                    name="vesselName"
                    rules={[{ required: true, message: t(translations.forms.please_fill_out_this_field) }, {
                        max: 45, message: t(translations.forms.please_input_no_more_than_characters, { numberOfChars: 45 })
                    }]}
                >
                    <SyrfInputField />
                </Form.Item>;
            case radioValue.USE_DEFAULT_BOATS:
                return <Form.Item
                    label={<SyrfFieldLabel>{t(translations.my_tracks_page.select_a_boat)}</SyrfFieldLabel>}
                    name="vesselId"
                    rules={[{ required: true, message: t(translations.forms.please_fill_out_this_field) }]}
                >
                    <SyrfFormSelect>
                        {renderBoatsList()}
                    </SyrfFormSelect>
                </Form.Item>
        }
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
                        label={<SyrfFieldLabel>{t(translations.my_tracks_page.boat_name_for_the_track)}</SyrfFieldLabel>}
                    >
                        <Radio.Group onChange={onRadioChanged} value={selectedRadioValue}>
                            <Radio value={radioValue.USE_DEFAULT_BOATS}>{t(translations.my_tracks_page.select_existing_boats)}</Radio>
                            <Radio value={radioValue.CREATE_NEW_BOAT}>{t(translations.my_tracks_page.create_a_new_boat)}</Radio>
                            <Radio value={radioValue.USE_DEFAULT_NAME}>{t(translations.my_tracks_page.use_default_track_name)}</Radio>
                        </Radio.Group>
                    </Form.Item>

                    {renderFormFieldsBaseOnRadioValue()}

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