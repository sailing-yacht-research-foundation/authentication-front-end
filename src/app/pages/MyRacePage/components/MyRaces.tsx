import React from 'react';
import { Table, Space, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsChangingPage, selectResults } from '../slice/selectors';
import { selectPage, selectTotal } from 'app/pages/MyRacePage/slice/selectors';
import { useTranslation } from 'react-i18next';
import Lottie from 'react-lottie';
import NoResult from '../assets/no-results.json'
import { translations } from 'locales/translations';
import { AiFillPlusCircle } from 'react-icons/ai';
import { BorderedButton, CreateButton, LottieMessage, LottieWrapper, PageHeaderContainer, PageHeaderText, TableWrapper } from 'app/components/SyrfGeneral';
import { useHistory } from 'react-router';
import { useMyRaceListSlice } from '../slice';
import moment from 'moment';
import { DeleteRaceModal } from './DeleteRaceModal';
import { Link } from 'react-router-dom';

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: NoResult,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export const MyRaces = () => {

    const { t } = useTranslation();

    const columns = [
        {
            title: t(translations.my_race_list_page.name),
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => <Link to={`/my-races/${record.id}/update`}>{text}</Link>,
            width: '20%',
        },
        {
            title: t(translations.my_race_list_page.location),
            dataIndex: 'locationName',
            key: 'location',
            width: '20%',
        },
        {
            title: t(translations.my_race_list_page.start_date),
            dataIndex: 'approximateStartTime',
            key: 'start_date',
            render: (value) => moment(value).format('YYYY-MM-DD'),
            width: '20%',
        },
        {
            title: t(translations.my_race_list_page.created_date),
            dataIndex: 'created_at',
            key: 'created_at',
            render: (value) => moment(value).format('YYYY-MM-DD'),
            width: '20%',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <BorderedButton onClick={() => {
                        history.push(`/my-races/${record.id}/update`)
                    }} type="primary">{t(translations.my_race_list_page.update)}</BorderedButton>
                    <BorderedButton danger onClick={() => showDeleteRaceModal(record)}>{t(translations.my_race_list_page.delete)}</BorderedButton>
                </Space>
            ),
            width: '20%',
        },
    ];

    const results = useSelector(selectResults);

    const page = useSelector(selectPage);

    const total = useSelector(selectTotal);

    const history = useHistory();

    const dispatch = useDispatch();

    const { actions } = useMyRaceListSlice();

    const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

    const [race, setRace] = React.useState<any>({});

    const isChangingPage = useSelector(selectIsChangingPage);

    React.useEffect(() => {
        dispatch(actions.getRaces(1));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onPaginationChanged = (page) => {
        dispatch(actions.getRaces(page));
    }

    const showDeleteRaceModal = (race) => {
        setShowDeleteModal(true);
        setRace(race);
    }

    const onRaceDeleted = () => {
        dispatch(actions.getRaces(page));
    }

    return (
        <>
            <DeleteRaceModal
                race={race}
                onRaceDeleted={onRaceDeleted}
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal}
            />
            <PageHeaderContainer>
                <PageHeaderText>{t(translations.my_race_list_page.my_races)}</PageHeaderText>
                <CreateButton onClick={() => history.push("/my-races/create")} icon={<AiFillPlusCircle
                    style={{ marginRight: '5px' }}
                    size={18} />}>{t(translations.my_race_list_page.create_a_new_race)}</CreateButton>
            </PageHeaderContainer>
            {results.length > 0 ? (
                <Spin spinning={isChangingPage}>
                    <TableWrapper>
                        <Table scroll={{ x: "max-content" }} columns={columns}
                            dataSource={results} pagination={{
                                defaultPageSize: 10,
                                current: page,
                                total: total,
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
                    <CreateButton icon={<AiFillPlusCircle
                        style={{ marginRight: '5px' }}
                        size={18} />} onClick={() => history.push("/my-races/create")}>{t(translations.my_race_list_page.create)}</CreateButton>
                    <LottieMessage>{t(translations.my_race_list_page.you_dont_have_any_race)}</LottieMessage>
                </LottieWrapper>)}
        </>
    )
}