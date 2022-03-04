import React from 'react';
import { Modal, Form, Button } from 'antd';
import { SyrfFieldLabel, SyrfInputField } from 'app/components/SyrfForm';
import { checkIfEmailIsValid, showToastMessageOnRequestError } from 'utils/helpers';
import { inviteUsersViaEmails } from 'services/live-data-server/groups';
import { toast } from 'react-toastify';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { LottieMessage, LottieWrapper } from 'app/components/SyrfGeneral';
import Lottie from 'react-lottie';
import SendEmail from '../../assets/30816-mail-send-animation.json';

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: SendEmail,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

interface IInviteUserModal {
    groupId: string,
    showModal: boolean,
    setShowModal: Function,
    onUsersInvited: Function
}

export const InviteUserModal = (props: IInviteUserModal) => {

    const { t } = useTranslation();

    const [form] = Form.useForm();

    const [showInvitationModal, setShowInvitationModal] = React.useState<boolean>(false);

    const { groupId, showModal, setShowModal, onUsersInvited } = props;

    const [emails, setEmails] = React.useState<string[]>([]);

    const hideInviteModal = () => {
        setShowModal(false);
        form.setFieldsValue({
            emails: ''
        })
    }

    const inviteUsers = () => {
        form
            .validateFields()
            .then(async values => {
                const { emails } = values;
                const processedEmails = emails.split(',').map(e => {
                    if (checkIfEmailIsValid(e.trim())) {
                        return e.trim();
                    }
                    return null;
                }).filter(Boolean);

                if (processedEmails.length === 0) {
                    toast.error(t(translations.group.your_inputted_emails_are_not_valid));
                    return;
                }

                hideInviteModal();

                const response = await inviteUsersViaEmails(groupId, processedEmails);

                if (response.success) {
                    toast.success(t(translations.group.invitations_sent));
                    onUsersInvited();
                    setShowInvitationModal(true);
                    setEmails(processedEmails);
                } else {
                    showToastMessageOnRequestError(response.error);
                }
            })
            .catch(info => {
                // no UI/UX throw here so leave this blank for now, just need the validation.
            });
    }

    const openEmailApp = () => {
        window.location.href = 'mailto:' + emails.join(', ');
    }

    return (
        <>
            <Modal
                title={t(translations.group.invite_members_via_emails)}
                bodyStyle={{ display: 'flex', justifyContent: 'center', overflow: 'hidden' }}
                visible={showModal}
                onOk={inviteUsers}
                onCancel={hideInviteModal}
            >
                <Form
                    form={form}
                    layout="vertical"
                    name="basic"
                    style={{ width: '100%' }}
                >
                    <Form.Item
                        label={<SyrfFieldLabel>Emails</SyrfFieldLabel>}
                        name="emails"
                        rules={[{ required: true }]}
                    >
                        <SyrfInputField
                            autoCorrect="off"
                            placeholder={t(translations.group.please_input_emails_by_using_commas)}
                        />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal visible={showInvitationModal} title={t(translations.group.leave_your_invitees_a_message)}
                okText={'Close'}
                cancelButtonProps={{ style: { display: 'none' } }}
                onOk={() => setShowInvitationModal(false)}
                onCancel={() => setShowInvitationModal(false)}>
                <LottieWrapper>
                    <Lottie
                        options={defaultOptions}
                        height={400}
                        width={400} />
                    <LottieMessage>{t(translations.group.you_can_leave_your_invitees_a_message_so_that)}</LottieMessage>
                    <Button onClick={openEmailApp} type="link">{t(translations.group.click_here_to_open_mail_app)}</Button>
                </LottieWrapper>
            </Modal>
        </>
    )
}