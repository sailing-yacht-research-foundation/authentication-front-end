import * as React from 'react';
import styled from 'styled-components';
import { ProfileTabs } from './../../ProfilePage/components/ProfileTabs';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/translations';
import { BorderedButton, DeleteButton, LottieMessage, LottieWrapper, PageDescription, PageHeaderContainerResponsive, PageHeading, PageInfoContainer, TableWrapper } from 'app/components/SyrfGeneral';
import { Table, Spin, Button, Space } from 'antd';
import Lottie from 'react-lottie';
import NoResult from '../assets/no-credentials.json';
import { getCredentialByPage } from 'services/live-data-server/external-platform';
import ReactTooltip from 'react-tooltip';
import { CreateButton } from 'app/components/SyrfGeneral';
import { AiFillPlusCircle } from 'react-icons/ai';
import { LinkNewCredentialModal } from './modals/LinkNewCredentialModal';
import { DeleteCredentialModal } from 'app/pages/VesselListPage/components/DeleteCredentialModal';
import { MODE } from 'utils/constants';

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: NoResult,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export const CredentialList = (props) => {

    const { t } = useTranslation();

    const columns = [
        {
            title: t(translations.credentail_manager_page.username),
            dataIndex: 'userId',
            key: 'userId',
            render: (text, record) => {
                return text;
            }
        },
        {
            title: t(translations.credentail_manager_page.source),
            dataIndex: 'source',
            key: 'source',
            render: (text, record) => {
                return text;
            }
        },
        {
            title: t(translations.credentail_manager_page.action),
            key: 'action',
            render: (text, record) => {
                return <Space size={10}>
                    <BorderedButton type="primary" onClick={()=> showUpdateCredentialModal(record)}>{t(translations.credentail_manager_page.edit)}</BorderedButton>
                    <DeleteButton danger onClick={() => {
                    showDeleteCredentialModal(record)
                }}>{t(translations.credentail_manager_page.unlink)}</DeleteButton>
                </Space>;
            }
        },
    ];

    const [pagination, setPagination] = React.useState<any>({
        page: 1,
        total: 0,
        rows: []
    });

    const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

    const [showCreateModal, setShowCreateModal] = React.useState<boolean>(false);

    const [credential, setCredential] = React.useState<any>({});

    const [isChangingPage, setIsChangingPage] = React.useState<boolean>(false);

    const [mode, setMode] = React.useState<string>(MODE.CREATE);

    React.useEffect(() => {
        getAll(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getAll = async (page) => {
        setIsChangingPage(true);
        const response = await getCredentialByPage({ page, size: 10 });
        setIsChangingPage(false);

        if (response.success) {
            setPagination({
                ...pagination,
                rows: response.data?.rows,
                page: page,
                total: response.data?.count
            });
        }
    }

    const onPaginationChanged = (page) => {
        getAll(page);
    }

    const showDeleteCredentialModal = (credential) => {
        setShowDeleteModal(true);
        setCredential(credential);
    }

    const showUpdateCredentialModal = (credential) => {
        setShowCreateModal(true);
        setMode(MODE.UPDATE);
        setCredential(credential);
    }

    const onCredentialDeleted = () => {
        getAll(pagination.page);
    }

    const showCreateCredentialModal = () => {
        setMode(MODE.CREATE);
        setCredential({});
        setShowCreateModal(true);
    }

    return (
        <Wrapper>
            <ProfileTabs />
            <DeleteCredentialModal onCredentialDeleted={onCredentialDeleted} credential={credential} showDeleteModal={showDeleteModal} setShowDeleteModal={setShowDeleteModal}/>
            <LinkNewCredentialModal mode={mode} credential={credential} reloadParent={() => getAll(pagination.page)} showModal={showCreateModal} setShowModal={setShowCreateModal} />
            <>
                <PageHeaderContainerResponsive style={{ 'alignSelf': 'flex-start', width: '100%' }}>
                    <PageInfoContainer>
                        <PageHeading>{t(translations.credentail_manager_page.credentials)}</PageHeading>
                        <PageDescription>{t(translations.credentail_manager_page.this_is_where_you_can_manage_your_credential_you_linked)}</PageDescription>
                    </PageInfoContainer>
                    <CreateButton
                        data-tip={t(translations.tip.link_a_new_credential_to_your_account)}
                        onClick={showCreateCredentialModal} icon={<AiFillPlusCircle
                            style={{ marginRight: '5px' }}
                            size={18} />}>{t(translations.credentail_manager_page.link_new_credential)}</CreateButton>
                </PageHeaderContainerResponsive>
                {pagination.rows.length > 0 ? (
                    <Spin spinning={isChangingPage}>
                        <TableWrapper>
                            <Table scroll={{ x: "max-content" }} columns={columns}
                                dataSource={pagination.rows} pagination={{
                                    defaultPageSize: 10,
                                    current: pagination.page,
                                    total: pagination.total,
                                    onChange: onPaginationChanged
                                }} />

                        </TableWrapper>
                    </Spin>
                )
                    : (<LottieWrapper>
                        <Lottie
                            options={defaultOptions}
                            height={400}
                            width={400} />
                        <LottieMessage>{t(translations.credentail_manager_page.you_havent_linked_any_credentials)}</LottieMessage>
                    </LottieWrapper>)}
                <ReactTooltip />
            </>
        </Wrapper>
    );
}

const Wrapper = styled.div`
    margin-top: 132px;
`;

