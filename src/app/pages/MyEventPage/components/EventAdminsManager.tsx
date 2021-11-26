import { Button, Spin } from 'antd';
import { PageHeaderContainer, PageHeaderTextSmall } from 'app/components/SyrfGeneral';
import { translations } from 'locales/translations';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { getEditors, removeEditor } from 'services/live-data-server/event-calendars';
import styled from 'styled-components';
import { renderAvatar } from 'utils/user-utils';
import ReactTooltip from 'react-tooltip';
import { DEFAULT_GROUP_AVATAR } from 'utils/constants';
import { revokeGroupAsEditor } from 'services/live-data-server/groups';

export const EventAdminsManager = React.forwardRef<any, any>((props, ref) => {

    const { event } = props;

    const { t } = useTranslation();

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const [groupEditors, setGroupEditors] = React.useState<any[]>([]);

    const [individualEditors, setIndividualEditors] = React.useState<any[]>([]);

    const getAdmins = async () => {
        setIsLoading(true);
        const response = await getEditors(event.id);
        setIsLoading(false);

        if (response.success) {
            if (response?.data?.individualEditors?.length > 0) {
                setIndividualEditors(response?.data?.individualEditors);
            }

            if (response?.data?.groupEditors?.length > 0) {
                setGroupEditors(response?.data?.groupEditors);
            }
        }
    }

    const revokeGroup = async (group) => {
        if (!group) return;
        setIsLoading(true);
        const response = await revokeGroupAsEditor(group.id, event.id);
        setIsLoading(false);


        if (response.success) {
            getAdmins();
        }
    }

    const revokeIndividual = async (individual) => {
        if (!individual) return;
        setIsLoading(true);
        const response = await removeEditor(event.id, individual.id);
        setIsLoading(false);

        if (response.success) {
            getAdmins();
        }
    }

    const renderGroupEditors = () => {
        return groupEditors.map(editor => {
            return <EditorItem data-tip={editor?.group?.groupName}>
                <EditorItemAvatarContainer>
                    <img alt={editor?.group?.groupName} src={editor?.group?.groupImage || DEFAULT_GROUP_AVATAR} />
                </EditorItemAvatarContainer>
                <EditorItemRightInfo>
                    <EditorRightInfoInner>
                        <EditorName>{editor?.group?.groupName}</EditorName>
                        <span>{t(translations.group.group)}</span>
                    </EditorRightInfoInner>
                    <EditorRevokeButton onClick={() => revokeGroup(editor?.group)} danger>Revoke</EditorRevokeButton>
                </EditorItemRightInfo>
            </EditorItem>
        });
    }

    const renderIndividualEditors = () => {
        return individualEditors.map(editor => {
            return <EditorItem data-tip={editor?.user?.name}>
                <EditorItemAvatarContainer>
                    <img alt={editor?.user?.name} src={renderAvatar(editor?.user?.avatar)} />
                </EditorItemAvatarContainer>
                <EditorItemRightInfo>
                    <EditorRightInfoInner>
                        <EditorName>{editor?.user?.name}</EditorName>
                        <span>{t(translations.group.individual)}</span>
                    </EditorRightInfoInner>
                    <EditorRevokeButton onClick={() => revokeIndividual(editor?.user)} danger>{t(translations.group.revoke)}</EditorRevokeButton>
                </EditorItemRightInfo>
            </EditorItem>
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
                    <ReactTooltip />
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
`;

const EditorRightInfoInner = styled.div`
`;

const EditorRevokeButton = styled(Button)`
    margin-left: auto;
`;