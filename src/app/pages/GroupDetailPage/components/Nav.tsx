import React from 'react';
import styled from 'styled-components';
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { DeleteGroupModal } from './modals/DeleteGroupModal';
import { LeaveGroupModal } from './modals/LeaveGroupModal';
import { GobackButton } from 'app/components/SyrfGeneral';
import { IoIosArrowBack } from 'react-icons/io';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';

export const Nav = (props) => {

    const { t } = useTranslation();

    const { group } = props;

    const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

    const [showLeaveModal, setShowLeaveModal] = React.useState<boolean>(false);

    const history = useHistory();

    const showDeleteGroupModal = (e) => {
        e.preventDefault();
        setShowDeleteModal(true);
    }

    const showLeaveGroupModal = (e) => {
        e.preventDefault();
        setShowLeaveModal(true);
    }

    const renderActionButton = () => {
        const menu = (
            <Menu>
                {group?.isAdmin && <Menu.Item key="1">
                    <a href={`/groups/${group.id}/update`}>{t(translations.group.update_group)}</a>
                </Menu.Item>}
                <Menu.Item key="1">
                    <a href="/" onClick={showLeaveGroupModal}>{t(translations.group.leave_group)}</a>
                </Menu.Item>
                {group?.isAdmin &&
                    <Menu.Item key="2">
                        <a href="/" onClick={showDeleteGroupModal}>{t(translations.group.delete_group)}</a>
                    </Menu.Item>
                }
            </Menu>
        );

        return (
            <Dropdown overlay={menu} trigger={['click']}>
                <a href="/" className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                    {t(translations.group.manage)} <DownOutlined />
                </a>
            </Dropdown>
        );
    }

    return (
        <>
            <DeleteGroupModal group={group} showModal={showDeleteModal} setShowModal={setShowDeleteModal} />
            <LeaveGroupModal group={group} showModal={showLeaveModal} setShowModal={setShowLeaveModal} />
            <Wrapper>
                <GobackButton onClick={() => history.push("/groups")}>
                    <IoIosArrowBack style={{ fontSize: '40px', color: '#1890ff' }} />
                </GobackButton>
                <InnerWrapper>
                    <NavItem className="active">{t(translations.group.members_nav)}</NavItem>
                    <NavItem>{renderActionButton()}</NavItem>
                </InnerWrapper>
            </Wrapper>
        </>
    );
}

const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
`;

const InnerWrapper = styled.div`
    background: #fafafa;
    border-radius: 10px;
    border: 1px solid #eee;
    padding: 5px;
    display: flex;
    flex-direction: row;
`;

const NavItem = styled.div`
    border-radius: 15px;
    padding: 10px 15px;
    margin: 0 10px;
    cursor: pointer;

    &.active {
        background: #fff;
        border: 1px solid #eee;
    }
`;