import React from 'react';
import { List, Button, Modal, Form, Checkbox } from 'antd';
import { showToastMessageOnRequestError } from 'utils/helpers';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { agreeToDocument, deleteDocument } from 'services/live-data-server/event-calendars';
import { CalendarEvent } from 'types/CalendarEvent';
import { useForm } from 'antd/lib/form/Form';
import { SyrfInputField } from 'app/components/SyrfForm';
import { toast } from 'react-toastify';
import { ConfirmModal } from 'app/components/ConfirmModal';
import { getUserName } from 'utils/user-utils';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/pages/LoginPage/slice/selectors';

export const DocumentItem = (props) => {

    const authUser = useSelector(selectUser);

    const { event, item, reloadParent }: { event: CalendarEvent, item: any, reloadParent: Function } = props;

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const [showSignModal, setShowSignModal] = React.useState<boolean>(false);

    const [isDeletingDocument, setIsDeletingDocument] = React.useState<boolean>(false);

    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = React.useState<boolean>(false);

    const [form] = useForm();

    const [documentActions, setDocumentActions] = React.useState<any>([]);

    const { t } = useTranslation();

    const canDeleteDocument = () => {
        return event.isEditor;
    }

    const signDocument = () => {
        form
            .validateFields()
            .then(async () => {
                setIsLoading(true);
                const response = await agreeToDocument(event.id!, item.id);
                setIsLoading(false);

                if (response.success) {
                    toast.success(t(translations.general.your_action_is_successful));
                    reloadParent();
                } else {
                    showToastMessageOnRequestError(response.error);
                }

                setShowSignModal(false);
            })
            .catch(() => {
                // no UI/UX throw here so leave this blank for now, just need the validation.
            });
    }

    const canSignDocument = () => {
        return event.isParticipant
            && item.isRequired
            && !item.signDate
    }

    const performDeleteDocument = async () => {
        setIsDeletingDocument(true);
        const response = await deleteDocument(event.id, item.id);
        setIsDeletingDocument(false);

        if (response.success) {
            toast.success(t(translations.general.your_action_is_successful));
            reloadParent();
        } else {
            showToastMessageOnRequestError(response.error);
        }

        setShowConfirmDeleteModal(false);
    }

    React.useEffect(() => {
        const actions: any = [];
        if (item.documentUrl) actions.push(<a rel="noreferrer" target='_blank' download href={item.documentUrl}>{t(translations.my_event_create_update_page.download)}</a>);
        if (canSignDocument()) actions.push(<Button onClick={() => setShowSignModal(true)} type='link'>{t(translations.my_event_create_update_page.sign)}</Button>);
        if (canDeleteDocument()) actions.push(<Button danger onClick={() => setShowConfirmDeleteModal(true)} type='link'>{t(translations.general.delete)}</Button>);
        setDocumentActions(actions);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [item]);

    return (<>
        <ConfirmModal
            title={t(translations.my_event_create_update_page.delete_document)}
            content={t(translations.my_event_create_update_page.are_you_sure_you_want_to_delete_this_document)}
            onOk={performDeleteDocument}
            onCancel={() => setShowConfirmDeleteModal(false)}
            loading={isDeletingDocument}
            showModal={showConfirmDeleteModal}
        />
        <Modal visible={showSignModal}
            confirmLoading={isLoading}
            onCancel={() => setShowSignModal(false)}
            onOk={signDocument}
            title={t(translations.event_detail_page.sign_document)}
            okText={t(translations.event_detail_page.sign_document)}
            width={1000}
        >
            <object width="100%" height="500" data={item.documentUrl} type="application/pdf">
                <a href={item.documentUrl}>{t(translations.my_event_create_update_page.download)}</a>
            </object>

            <Form
                form={form}
                style={{ marginTop: '10px' }}
                layout="vertical"
                name="basic"
                onFinish={signDocument}
            >
                <Form.Item
                    name="name"
                    rules={[{ required: true, message: t(translations.forms.please_fill_out_this_field) }, {
                        validator: (_, value) => {
                            if (value === getUserName(authUser)) return Promise.resolve();
                            return Promise.reject(new Error(t(translations.my_event_create_update_page.the_name_you_entered_does_not_match_your_registered_name)));
                        }
                    }]}
                >
                    <SyrfInputField autoComplete='off' autoCorrect='off' placeholder={t(translations.forms.please_input_your_name)} />
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
            actions={documentActions}
        >
            <span>{item.documentName}</span>
        </List.Item>
    </>)
}
