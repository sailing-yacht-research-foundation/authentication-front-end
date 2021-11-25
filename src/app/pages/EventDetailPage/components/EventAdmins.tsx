import { Spin } from 'antd';
import { PageHeaderContainer, PageHeaderTextSmall } from 'app/components/SyrfGeneral';
import { translations } from 'locales/translations';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { getEditors } from 'services/live-data-server/event-calendars';
import styled from 'styled-components';
import { renderAvatar } from 'utils/user-utils';
import ReactTooltip from 'react-tooltip';
import { DEFAULT_GROUP_AVATAR } from 'utils/constants';

const editorHeadlessStyles = {
    width: '25px',
    height: '25px',
    marginRight: '5px'
}

export const EventAdmins = (props) => {

    const { event, headless } = props;

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

    const renderGroupEditors = () => {
        let editors = groupEditors;
        if (headless && editors.length > 5) editors = editors.slice(0, 5);
        return editors.map(editor => {
            return <EditorItem style={headless ? editorHeadlessStyles : {}} data-tip={editor?.group?.groupName}>
                <img alt={editor?.group?.groupName} src={editor?.group?.groupImage || DEFAULT_GROUP_AVATAR} />
            </EditorItem>
        });
    }

    const renderIndividualEditors = () => {
        let editors = individualEditors;
        if (headless && editors.length > 5) editors = editors.slice(0, 5);
        return individualEditors.map(editor => {
            return <EditorItem style={headless ? editorHeadlessStyles : {}} data-tip={editor?.user?.name}>
                <img alt={editor?.user?.name} src={renderAvatar(editor?.user?.avatar)} />
            </EditorItem>
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
                    <ReactTooltip />
                </Spin>
            }
        </>
    )
}

const EditorWrapper = styled.div`
    display: flex;
`;

const EditorItem = styled.div`
    width: 45px;
    height: 45px;
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