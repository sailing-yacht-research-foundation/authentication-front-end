import React from 'react';
import { Modal, Form, Button, Select } from 'antd';
import { SyrfFieldLabel, SyrfFormSelect, SyrfInputField } from 'app/components/SyrfForm';
import { checkIfEmailIsValid, debounce, navigateToProfile, showToastMessageOnRequestError } from 'utils/helpers';
import { inviteUsersToGroup, searchGroupForAssigns } from 'services/live-data-server/groups';
import { toast } from 'react-toastify';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { ItemAvatar, LottieMessage, LottieWrapper } from 'app/components/SyrfGeneral';
import Lottie from 'react-lottie';
import SendEmail from '../../assets/30816-mail-send-animation.json';
import { searchForProfiles } from 'services/live-data-server/profile';
import { getUserAttribute, renderAvatar } from 'utils/user-utils';
import { useSelector } from 'react-redux';
import { selectUser } from 'app/pages/LoginPage/slice/selectors';
import { AdminType } from 'utils/constants';
import { useHistory } from 'react-router-dom';

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

    const [items, setItems] = React.useState<any[]>([]);

    const [showInvitationModal, setShowInvitationModal] = React.useState<boolean>(false);

    const { groupId, showModal, setShowModal, onUsersInvited } = props;

    const [emails, setEmails] = React.useState<string[]>([]);

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const user = useSelector(selectUser);

    const history = useHistory();

    // eslint-disable-next-line
    const debounceSearch = React.useCallback(debounce((keyword) => onSearch(keyword), 300), []);

    const onSearch = async (keyword) => {
        setItems([]);
        const responses: any[] = await Promise.all([searchGroupForAssigns(keyword), searchForProfiles(keyword, getUserAttribute(user, 'locale'))]);
        let groupRows = [];
        let peopleRows = [];

        responses.forEach(response => {
            if (response.data.rows) {
                groupRows = response.data.rows.filter(group => {
                    return group.id !== groupId // exclude current group from the invitees.
                }).map(group => {
                    return {
                        type: AdminType.GROUP,
                        id: group.id,
                        avatar: group.groupImage,
                        name: group.groupName,
                    }
                });
            } else {
                peopleRows = response.data.map(p => {
                    return {
                        type: AdminType.INDIVIDUAL,
                        id: p.id,
                        avatar: p.avatar,
                        name: p.name,
                    }
                })
            }
        });

        setItems([...groupRows, ...peopleRows]);
    }

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
                const { emails, invitees } = values;
                const userIds: any = [], groupIds: any = [];
                const emailsAsArray = emails ? emails.split(',') : [];

                if (!emails && !invitees) {
                    toast.error(t(translations.group.you_must_specify_at_least_one_person_or_group_or_email_to_invite));
                    return;
                }

                invitees?.forEach(invitee => {
                    invitee = JSON.parse(invitee);
                    if (invitee.type === AdminType.GROUP) {
                        groupIds.push(invitee.id);
                    } else {
                        userIds.push(invitee.id);
                    }
                });

                if (emailsAsArray.length > 0 && checkIfEmailArrayHasInvalidEmails(emailsAsArray)) {
                    toast.error(t(translations.group.your_inputted_emails_are_not_valid));
                }

                const processedEmails = emailsAsArray.map(e => {
                    if (checkIfEmailIsValid(e.trim())) {
                        return e.trim();
                    }
                    return null;
                }).filter(Boolean);

                setIsLoading(true);
                const response = await inviteUsersToGroup(groupId, processedEmails, userIds, groupIds);
                setIsLoading(false);

                hideInviteModal();

                if (response.success) {
                    toast.success(t(translations.group.invitations_sent));
                    onUsersInvited();
                    if (processedEmails.length > 0) {
                        setShowInvitationModal(true);
                        setEmails(processedEmails);
                    }
                    form.resetFields();
                } else {
                    showToastMessageOnRequestError(response.error);
                }
            })
            .catch(info => {
                // no UI/UX throw here so leave this blank for now, just need the validation.
            });
    }

    const checkIfEmailArrayHasInvalidEmails = (emails) => {
        let invalid = false;
        emails.forEach(email => {
            if (!checkIfEmailIsValid(email)) {
                invalid = true;
            }
        });

        return invalid;
    }

    const openEmailApp = () => {
        window.location.href = 'mailto:' + emails.join(', ');
    }

    const renderItemResults = () => {
        return items.map((item, index) => <Select.Option key={index} style={{ padding: '5px' }} value={JSON.stringify(item)}>
            <ItemAvatar onClick={(e) => navigateToProfile(e, item, history)} src={renderAvatar(item.avatar)} /> {item.name}
        </Select.Option>)
    }

    return (
        <>
            <Modal
                confirmLoading={isLoading}
                title={t(translations.group.invite_members)}
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
                        label={<SyrfFieldLabel>{t(translations.group.search_and_choose_people_or_groups_to_invite)}</SyrfFieldLabel>}
                        name="invitees"
                    >
                        <SyrfFormSelect mode="multiple"
                            style={{ width: '100%' }}
                            placeholder={t(translations.my_event_create_update_page.invite_groups_or_individual_by_searching_them)}
                            onSearch={debounceSearch}
                            filterOption={false}
                            allowClear
                            maxTagCount={'responsive' as const}
                        >
                            {renderItemResults()}
                        </SyrfFormSelect>
                    </Form.Item>

                    <Form.Item
                        label={<SyrfFieldLabel>{t(translations.group.or_invite_them_using_emails)}</SyrfFieldLabel>}
                        name="emails"
                    >
                        <SyrfInputField
                            autoComplete="off"
                            autoCorrect="off"
                            autoCapitalize="none"
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
