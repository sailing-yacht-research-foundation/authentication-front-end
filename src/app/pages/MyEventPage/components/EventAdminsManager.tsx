import { Button, Spin, Tooltip } from 'antd';
import { PageHeaderContainer, PageHeaderTextSmall } from 'app/components/SyrfGeneral';
import { translations } from 'locales/translations';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { getEditors, removeEditor } from 'services/live-data-server/event-calendars';
import styled from 'styled-components';
import { renderAvatar } from 'utils/user-utils';
import { DEFAULT_GROUP_AVATAR } from 'utils/constants';
import { revokeGroupAsEditor } from 'services/live-data-server/groups';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { appendThumbnail, showToastMessageOnRequestError } from 'utils/helpers';
import { SYRFImage } from 'app/components/SyrfGeneral/SYRFImage';

export const EventAdminsManager = React.forwardRef<any, any>((props, ref) => {

    const { event } = props;

    const { t } = useTranslation();

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const [groupEditors, setGroupEditors] = React.useState<any[]>([]);

    const [individualEditors, setIndividualEditors] = React.useState<any[]>([]);

    const history = useHistory();

    const getAdmins = async () => {
        setIsLoading(true);
        const response = await getEditors(event.id!);
        setIsLoading(false);

        if (response.success) {
            setIndividualEditors(response?.data?.individualEditors);
            setGroupEditors(response?.data?.groupEditors);
        }
    }

    const onAfterRevoked = (response) => {
        if (response.success) {
            toast.success(t(translations.my_event_create_update_page.successfully_revoked));
            getAdmins();
        } else {
            showToastMessageOnRequestError(response.error);
        }
    }

    const revokeGroup = async (group) => {
        if (!group) return;
        setIsLoading(true);
        const response = await revokeGroupAsEditor(group.id, event.id);
        setIsLoading(false);

        onAfterRevoked(response);

    }

    const revokeIndividual = async (individual) => {
        if (!individual) return;
        setIsLoading(true);
        const response = await removeEditor(event.id, individual.id);
        setIsLoading(false);

        onAfterRevoked(response);
    }

    const renderGroupEditors = () => {
        return groupEditors.map((editor, index) => {
            return <Tooltip key={index} title={editor?.group?.groupName}>
                <EditorItem>
                    <EditorItemAvatarContainer>
                        <SYRFImage
                            alt={editor?.group?.groupName}
                            src={appendThumbnail(editor?.group?.groupImage) || DEFAULT_GROUP_AVATAR}
                            fallback={editor?.group?.groupImage || DEFAULT_GROUP_AVATAR} />
                    </EditorItemAvatarContainer>
                    <EditorItemRightInfo>
                        <EditorRightInfoInner>
                            <EditorName onClick={() => history.push(`/groups/${editor?.group?.id}`)}>{editor?.group?.groupName}</EditorName>
                            <span>{t(translations.group.group)}</span>
                        </EditorRightInfoInner>
                        <EditorRevokeButton onClick={() => revokeGroup(editor?.group)} danger>{t(translations.group.revoke)}</EditorRevokeButton>
                    </EditorItemRightInfo>
                </EditorItem>
            </Tooltip>
        });
    }

    const renderIndividualEditors = () => {
        const userId: any = localStorage.getItem('user_id');
        return individualEditors.map((editor, index) => {
            return <Tooltip key={index} title={editor?.user?.name}>
                <EditorItem key={editor.id}>
                    <EditorItemAvatarContainer>
                        <SYRFImage
                            alt={editor?.user?.name}
                            src={renderAvatar(editor?.user?.avatar)}
                            fallback={renderAvatar(editor?.user?.avatar, false)} />
                    </EditorItemAvatarContainer>
                    <EditorItemRightInfo>
                        <EditorRightInfoInner>
                            <EditorName onClick={() => history.push(`/profile/${editor?.user?.id}`)}>{editor?.user?.name}</EditorName>
                            <span>{t(translations.group.individual)}</span>
                        </EditorRightInfoInner>
                        {userId !== editor.user?.id && <EditorRevokeButton onClick={() => revokeIndividual(editor?.user)} danger>{t(translations.group.revoke)}</EditorRevokeButton>}
                    </EditorItemRightInfo>
                </EditorItem>
            </Tooltip>
        });
    }

    React.useEffect(() => {
        getAdmins();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useImperativeHandle(ref, () => ({
        getAdmins() {
            getAdmins();
        }
    }));

    return (
        <Spin spinning={isLoading}>
            {
                (individualEditors.length > 0 || groupEditors.length > 0) &&
                <>
                    <PageHeaderContainer>
                        <PageHeaderTextSmall>{t(translations.event_detail_page.admins)} ({individualEditors.length + groupEditors.length})</PageHeaderTextSmall>
                    </PageHeaderContainer>
                    <EditorWrapper>
                        {renderIndividualEditors()}
                        {renderGroupEditors()}
                    </EditorWrapper>
                </>
            }
        </Spin>
    )
});

const EditorWrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

const EditorItem = styled.div`
    padding: 5px;
    display: flex;

    &:not(:last-child) {
        border-bottom: 1px solid #eee;
        margin-bottom: 10px;
    }
`;

const EditorItemAvatarContainer = styled.div`
    width: 45px;
    height: 45px;
    flex: 0 0 auto;
    &:not(:last-child) {
        margin-right: 15px;
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
        border: 1px solid #eee;
    }
`;

const EditorItemRightInfo = styled.div`
    display: flex;
    width: 100%;
`;

const EditorName = styled.h4`
    cursor: pointer;
`;

const EditorRightInfoInner = styled.div`
`;

const EditorRevokeButton = styled(Button)`
    margin-left: auto;
`;
