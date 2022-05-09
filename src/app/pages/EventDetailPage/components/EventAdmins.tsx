import { Spin, Tooltip } from 'antd';
import { PageHeaderContainer, PageHeaderTextSmall } from 'app/components/SyrfGeneral';
import { translations } from 'locales/translations';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { getEditors } from 'services/live-data-server/event-calendars';
import styled from 'styled-components';
import { renderAvatar } from 'utils/user-utils';
import { DEFAULT_GROUP_AVATAR } from 'utils/constants';
import { useHistory } from 'react-router-dom';
import { CalendarEvent } from 'types/CalendarEvent';

const editorHeadlessStyles = {
    width: '25px',
    height: '25px',
    marginRight: '5px'
}
interface IEventAdmins {
    event: Partial<CalendarEvent>,
    headless?: boolean,
    groups?: any[],
    editors?: any[]
}

export const EventAdmins = (props: IEventAdmins) => {

    const { event, headless, groups, editors } = props;

    const { t } = useTranslation();

    const [isLoading, setIsLoading] = React.useState<boolean>(false);

    const [groupEditors, setGroupEditors] = React.useState<any[]>(groups || []);

    const [individualEditors, setIndividualEditors] = React.useState<any[]>(editors || []);

    const history = useHistory();

    const getAdmins = async () => {
        setIsLoading(true);
        const response = await getEditors(event.id!);
        setIsLoading(false);

        if (response.success) {
            if (response.data?.individualEditors.length > 0) {
                setIndividualEditors(response.data.individualEditors);
            }

            if (response.data?.groupEditors.length > 0) {
                setGroupEditors(response.data.groupEditors);
            }
        }
    }

    const renderGroupEditors = () => {
        let editors = groupEditors;
        if (headless && editors.length > 5) editors = editors.slice(0, 5);
        return editors.filter(Boolean).map((editor, index) => {
            if (editor.group) editor = editor.group;
            return <Tooltip title={editor?.groupName}>
                <EditorItem key={index} onClick={() => history.push(`/groups/${editor?.id}`)} style={headless ? editorHeadlessStyles : {}} >
                    <img alt={editor?.groupName} src={editor?.groupImage || DEFAULT_GROUP_AVATAR} />
                </EditorItem>
            </Tooltip>
        });
    }

    const renderIndividualEditors = () => {
        let editors = individualEditors;
        if (headless && editors.length > 5) editors = editors.slice(0, 5);
        return editors.filter(Boolean).map((editor, index) => {
            if (editor.user) editor = editor.user;
            return <Tooltip title={editor?.name}>
                <EditorItem key={index} onClick={() => history.push(`/profile/${editor?.id}`)} style={headless ? editorHeadlessStyles : {}}>
                    <img alt={editor?.name} src={renderAvatar(editor?.avatar)} />
                </EditorItem>
            </Tooltip>
        });
    }

    const renderPlusMore = () => {
        if (headless) {
            let individualsCount = 0, groupsCount = 0, total = 0;
            if (individualEditors.length > 5) individualsCount = (individualEditors.length - 5);
            if (groupEditors.length > 5) groupsCount = (groupEditors.length - 5)
            total = individualsCount + groupsCount;
            if (total > 0)
                return <span>+{(individualsCount + groupsCount)} more</span>;
        }

        return <></>;
    }

    React.useEffect(() => {
        if (!editors && !groups)
            getAdmins();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {
                (individualEditors.length > 0 || groupEditors.length > 0) && <Spin spinning={isLoading}>
                    {!headless && <PageHeaderContainer>
                        <PageHeaderTextSmall>{t(translations.event_detail_page.admins)}</PageHeaderTextSmall>
                    </PageHeaderContainer>}
                    <EditorWrapper>
                        {renderIndividualEditors()}
                        {renderGroupEditors()}
                        {renderPlusMore()}
                    </EditorWrapper>
                </Spin>
            }
        </>
    )
}

const EditorWrapper = styled.div`
    display: flex;
    align-items: center;
`;

const EditorItem = styled.div`
    width: 45px;
    height: 45px;
    cursor: pointer;
    &:not(:last-child) {
        margin-right: 7px;
    }

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
        border: 1px solid #eee;
    }
`;