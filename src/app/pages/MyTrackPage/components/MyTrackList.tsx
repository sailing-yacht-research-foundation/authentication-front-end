import React from 'react';
import { Table, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import Lottie from 'react-lottie';
import styled from 'styled-components';
import { translations } from 'locales/translations';
import moment from 'moment';
import { AiOutlineMinus } from 'react-icons/all'

import { getAllTracks } from 'services/live-data-server/my-tracks';
import NoResult from '../assets/no-results.json';
import { LottieMessage, LottieWrapper, TableWrapper } from 'app/components/SyrfGeneral';
import { Link } from 'react-router-dom';
import { TIME_FORMAT } from 'utils/constants';
import { timeMillisToHours } from 'utils/time';

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: NoResult,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export const MyTrackList = () => {

    const { t } = useTranslation();

    const columns = [
        {
            title: t(translations.my_tracks_page.name),
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => {
                if (record.competitionUnit)
                    return (
                        <FlexWrapper>
                            {record?.competitionUnit?.openGraphImage ? 
                                <OpenGraphImage src={record?.competitionUnit?.openGraphImage} alt={record.event.name} /> :
                                <NoImageContainer>
                                    <AiOutlineMinus style={{ color: '#FFFFFF', fontSize: '20px' }} />
                                </NoImageContainer>
                            }
                            <Link to={`/playback/?raceId=${record.competitionUnit?.id}`}>{record.event?.name}</Link>
                        </FlexWrapper>
                    );
                return (
                    <FlexWrapper>
                        <NoImageContainer>
                            <AiOutlineMinus style={{ color: '#FFFFFF', fontSize: '20px' }} />
                        </NoImageContainer>
                        <div>{record.event?.name}</div>
                    </FlexWrapper>
                );
            }
        },
        {
            title: t(translations.my_tracks_page.type),
            dataIndex: 'type',
            key: 'type',
            render: (text, record) => {
                return record.event?.isPrivate ? t(translations.my_tracks_page.track_now) : t(translations.my_tracks_page.event_track)
            }
        },
        {
            title: t(translations.my_tracks_page.created_date),
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (value) => moment(value).format(TIME_FORMAT.date_text),
        },
        {
            title: t(translations.my_tracks_page.city),
            dataIndex: 'competitionUnit',
            key: 'competitionUnit.City',
            render: (value, source) => source?.competitionUnit?.city || '-'
        },
        {
            title: t(translations.my_tracks_page.country),
            dataIndex: 'competitionUnit',
            key: 'competitionUnit.Country',
            render: (_value, source) => source?.competitionUnit?.country || '-'
        },
        {
            title: t(translations.my_tracks_page.traveled_overground_distance),
            dataIndex: 'competitionUnit',
            key: 'competitionUnit.traveled_overground',
            render: (_value, source) => source?.competitionUnit?.traveled_overground || '-'
        },
        {
            title: t(translations.my_tracks_page.elapsed_time),
            dataIndex: 'competitionUnit',
            key: 'competitionUnit.elapsedTime',
            render: (_value, source) => {
                if(!source?.competitionUnit?.isCompleted) return 'on progress';

                const startTime = new Date(source?.competitionUnit?.startTime).getTime();
                const endTime = new Date(source?.competitionUnit?.endTime).getTime();

                return timeMillisToHours(endTime - startTime);
            }
        }
    ];

    const [pagination, setPagination] = React.useState<any>({
        page: 1,
        total: 0,
        rows: []
    });

    const [isChangingPage, setIsChangingPage] = React.useState<boolean>(false);

    React.useEffect(() => {
        getAll(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getAll = async (page) => {
        setIsChangingPage(true);
        const response = await getAllTracks(page);
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

    return (
        <>
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
                    <LottieMessage>{t(translations.my_tracks_page.you_dont_have_any_tracks)}</LottieMessage>
                </LottieWrapper>)}
        </>
    )
}

const FlexWrapper = styled.div`
    display: flex;
    align-items: center;
`;

const OpenGraphImage = styled.img`
    width: 40px;
    height: 40px;
    border-radius: 4px;
    background-color: #999999;
    margin-right: 8px;
`;

const NoImageContainer = styled.div`
    width: 40px;
    height: 40px;
    display: flex;
    background-color: #999999;
    margin-right: 8px;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
`;