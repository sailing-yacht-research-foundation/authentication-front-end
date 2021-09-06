import React from 'react';
import { Table, Tag, Space, Button } from 'antd';
import { useSelector } from 'react-redux';
import { selectResults } from '../slice/selectors';
import { selectPage, selectTotal } from 'app/pages/HomePage/slice/selectors';
import styled from 'styled-components';
import { media } from 'styles/media';
import { useTranslation } from 'react-i18next';
import Lottie from 'react-lottie';
import NoResult from '../assets/no-results.json'
import { translations } from 'locales/translations';
import { AiFillPlusCircle } from 'react-icons/ai';
import { PageHeaderContainer, PageHeaderText } from 'app/components/SyrfGeneral';

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: text => <a>{text}</a>,
    },
    {
        title: 'Location',
        dataIndex: 'location',
        key: 'location',
    },
    {
        title: 'Start Date',
        dataIndex: 'start_date',
        key: 'start_date',
    },
    {
        title: 'Created Date',
        dataIndex: 'created_at',
        key: 'created_at',
    },
    {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
            <Space size="middle">
                <BorderedButton type="primary">Update</BorderedButton>
                <BorderedButton danger>Delete</BorderedButton>
            </Space>
        ),
    },
];

const data = [
    {
        key: '1',
        name: 'Summer Race at Italy',
        location: 'Italy',
        start_date: '2021-09-06',
        created_at: '2021-09-06',
    },
    {
        key: '2',
        name: 'Spring race',
        location: 'Oman',
        start_date: '2021-09-06',
        created_at: '2021-09-06',
    },
    {
        key: '3',
        name: 'United States mid summer kick-off',
        location: 'United States',
        start_date: '2021-09-06',
        created_at: '2021-09-06',
    },
];

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: NoResult,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export const MyRaces = () => {

    const results = useSelector(selectResults);

    const page = useSelector(selectPage);

    const total = useSelector(selectTotal);

    const { t } = useTranslation();

    return (
        <>
            <PageHeaderContainer>
                <PageHeaderText>My Races</PageHeaderText>
                <CreateButton icon={<AiFillPlusCircle
                    style={{ marginRight: '5px' }}
                    size={18} />}>Create a new Race</CreateButton>
            </PageHeaderContainer>
            {results.length > 0 ? (
                <TableWrapper>
                    <Table columns={columns} dataSource={data} />
                </TableWrapper>
            )
                : (<LottieWrapper>
                    <Lottie
                        options={defaultOptions}
                        height={400}
                        width={400} />
                    <CreateButton>Create a new race</CreateButton>
                    <LottieMessage>{t(translations.my_race_list_page.you_dont_have_any_race)}</LottieMessage>
                </LottieWrapper>)}
        </>
    )
}

const TableWrapper = styled.div`
    margin: 15px;
`;

const LottieWrapper = styled.div`
    text-align: center;
    margin-top: 15px;

    ${media.medium`
        margin-top: 100px;
    `}
`;

const LottieMessage = styled.div`
   color: #70757a;
`;

const CreateButton = styled(Button)`
    margin: 10px 0;
    border-radius: 5px;
    color: #40a9ff;
    border-color: #40a9ff;
`;

const BorderedButton = styled(Button)`
    border-radius: 5px;
`;