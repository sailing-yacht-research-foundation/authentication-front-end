import React from 'react';
import { Spin, Form, Divider, Select } from 'antd';
import { SyrfFieldLabel, SyrfFormButton, SyrfFormWrapper, SyrfInputField, SyrfTextArea, SyrFieldDescription, SyrfFormSelect } from 'app/components/SyrfForm';
import { DeleteButton, GobackButton, PageHeaderContainerResponsive, PageHeading, PageInfoContainer, PageInfoOutterWrapper } from 'app/components/SyrfGeneral';
import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';
import { useHistory, useLocation, useParams } from 'react-router';
import { useForm } from 'antd/lib/form/Form';
import { toast } from 'react-toastify';
import { BiTrash } from 'react-icons/bi';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { IoIosArrowBack } from 'react-icons/io';
import { MODE } from 'utils/constants';
import ReactTooltip from 'react-tooltip';
import { createGroup, updateGroup, getGroupById } from 'services/live-data-server/groups';
import { DeleteGroupModal } from './DeleteGroupModal';

const groupVisibilities = [
    {
        name: "Public",
        value: "PUBLIC"
    },
    {
        name: "Private",
        value: "PRIVATE"
    },
    {
        name: "Moderated",
        value: "MODERATED"
    }
];

const groupTypes = [
    {
        name: "None",
        value: "",
    },
    {
        name: "Organization",
        value: "ORGANIZATION"
    },
    {
        name: "Committee",
        value: "COMMITTEE"
    },
    {
        name: "Team",
        value: "TEAM"
    }
];

export const GroupForm = () => {
    const history = useHistory();

    const { t } = useTranslation();

    const location = useLocation();

    const [form] = useForm();

    const [isSaving, setIsSaving] = React.useState<boolean>(false);

    const [mode, setMode] = React.useState<string>(MODE.CREATE);

    const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

    const [group, setGroup] = React.useState<any>({});

    const [formChanged, setFormChanged] = React.useState<boolean>(false);

    const { groupId } = useParams<{ groupId: string }>();

    const onFinish = async (values) => {
        let { groupName, description, groupType, visibility } = values;
        let response;

        setIsSaving(true);

        const data = {
            groupName: groupName,
            description: description,
            groupType: groupType || undefined,
            visibility: visibility
        };

        if (mode === MODE.CREATE)
            response = await createGroup(data);
        else
            response = await updateGroup(groupId, data);

        setIsSaving(false);

        if (response.success) {
            if (mode === MODE.CREATE) {
                toast.success(t(translations.group_create_update_page.successfully_created_a_new_group));
                setGroup(response.data);
            } else {
                toast.success(t(translations.group_create_update_page.successfully_updated_your_group));
            }

            history.push(`/groups/${response?.data?.id}`);
            setMode(MODE.UPDATE);
        } else {
            toast.error(t(translations.group_create_update_page.an_error_happened));
        }
    }

    const initModeAndData = async () => {
        if (location.pathname.includes(MODE.UPDATE)) {
            setMode(MODE.UPDATE);
            setIsSaving(true);
            const response = await getGroupById(groupId);
            setIsSaving(false);

            if (response.success) {
                setGroup(response.data);
                form.setFieldsValue({
                    ...response.data,
                    groupType: response.data.groupType || ''
                });
                if (!response?.data?.isAdmin) history.push('/404');
            } else {
                history.push('/404');
            }
        }
    }

    const onGroupDeleted = () => {
        history.push(`/groups`);
    }

    const renderGroupVisibilityList = () => {
        return groupVisibilities.map((visibility) => {
            return <Select.Option key={visibility.value} value={visibility.value}>{visibility.name}</Select.Option>
        });
    }

    const renderGroupTypeList = () => {
        return groupTypes.map((type) => {
            return <Select.Option key={type.value} value={type.value}>{type.name}</Select.Option>
        });
    }

    React.useEffect(() => {
        initModeAndData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Wrapper>
            <DeleteGroupModal
                group={group}
                onGroupDeleted={onGroupDeleted}
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
            />
            <PageHeaderContainerResponsive style={{ 'alignSelf': 'flex-start', width: '100%' }}>
                <PageInfoOutterWrapper>
                    <GobackButton onClick={() => {
                        history.push(`/groups`);
                    }}>
                        <IoIosArrowBack style={{ fontSize: '40px', color: '#1890ff' }} />
                    </GobackButton>
                    <PageInfoContainer>
                        <PageHeading>{mode === MODE.UPDATE ? t(translations.group_create_update_page.update_group) : t(translations.group_create_update_page.create_group)}</PageHeading>
                    </PageInfoContainer>
                </PageInfoOutterWrapper>
            </PageHeaderContainerResponsive>
            <SyrfFormWrapper>
                <Spin spinning={isSaving}>
                    <Form
                        layout={'vertical'}
                        name="basic"
                        form={form}
                        onFinish={onFinish}
                        onValuesChange={() => setFormChanged(true)}
                        initialValues={{
                            groupName: '',
                            description: '',
                            visibility: 'PUBLIC',
                            groupType: ''
                        }}
                    >
                        <Form.Item
                            label={<SyrfFieldLabel>{t(translations.group_create_update_page.group_name)}</SyrfFieldLabel>}
                            name="groupName"
                            data-tip={t(translations.tip.group_name)}
                            rules={[
                                { required: true, message: t(translations.forms.group_name_is_required) },
                                { max: 100, message: t(translations.forms.group_name_must_not_be_longer_than_100_chars) }
                            ]}
                        >
                            <SyrfInputField autoCorrect="off" />
                        </Form.Item>

                        <Form.Item
                            rules={[{ max: 255, message: t(translations.forms.group_description_must_not_be_longer_than_255_chars) }]}
                            label={<SyrfFieldLabel>{t(translations.group_create_update_page.group_description)}</SyrfFieldLabel>}
                            name="description"
                            data-multiline={true}
                            data-tip={t(translations.tip.group_description)}
                        >
                            <SyrfTextArea autoCorrect="off" />
                        </Form.Item>

                        <Form.Item
                            data-tip={t(translations.tip.group_visibility)}
                            style={{ marginBottom: '10px' }}
                            label={<SyrfFieldLabel>{t(translations.group_create_update_page.group_visibility)}</SyrfFieldLabel>}
                            name="visibility"
                            help={<SyrFieldDescription>{t(translations.group_create_update_page.please_choose_a_group_visibility)}</SyrFieldDescription>}
                            rules={[{ required: true }]}
                        >
                            <SyrfFormSelect placeholder={t(translations.group_create_update_page.select_a_visibility)}>
                                {renderGroupVisibilityList()}
                            </SyrfFormSelect>
                        </Form.Item>

                        <Form.Item
                            data-tip={t(translations.tip.group_type)}
                            style={{ marginBottom: '10px' }}
                            label={<SyrfFieldLabel>{t(translations.group_create_update_page.group_type)}</SyrfFieldLabel>}
                            name="groupType"
                            help={<SyrFieldDescription>{t(translations.group_create_update_page.group_has_a_type_please_choose_one_from_the_list)}</SyrFieldDescription>}
                        >
                            <SyrfFormSelect placeholder={t(translations.group_create_update_page.select_a_group_type)}>
                                {renderGroupTypeList()}
                            </SyrfFormSelect>
                        </Form.Item>

                        <Divider />

                        <Form.Item>
                            <SyrfFormButton disabled={!formChanged} type="primary" htmlType="submit">
                                {t(translations.group_create_update_page.save_group)}
                            </SyrfFormButton>
                        </Form.Item>
                    </Form>
                </Spin>
            </SyrfFormWrapper>
            <ReactTooltip />
        </Wrapper >
    )
}


const Wrapper = styled.div`
    display:flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    margin-top: ${StyleConstants.NAV_BAR_HEIGHT};
`;