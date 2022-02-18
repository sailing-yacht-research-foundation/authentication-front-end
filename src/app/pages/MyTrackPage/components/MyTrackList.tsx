import React from 'react';
import { Table, Spin, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import Lottie from 'react-lottie';
import styled from 'styled-components';
import { translations } from 'locales/translations';
import moment from 'moment';
import { AiOutlineMinus } from 'react-icons/all'

import { downloadTrack, getAllTracks } from 'services/live-data-server/my-tracks';
import NoResult from '../assets/no-results.json';
import { LottieMessage, LottieWrapper, TableWrapper } from 'app/components/SyrfGeneral';
import { Link } from 'react-router-dom';
import { TIME_FORMAT } from 'utils/constants';
import { timeMillisToHours } from 'utils/time';
import KMLIcon from '../assets/kml.png';
import GPXIcon from '../assets/gpx.png';
import ReactTooltip from 'react-tooltip';
import { BiTrash } from 'react-icons/bi';
import { DeleteTrackModal } from './DeleteTrackModal';
import { Track } from 'types/Track';

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

    const [showDeleteModal, setShowDeleteModal] = React.useState<boolean>(false);

    const [track, setTrack] = React.useState<Partial<Track>>({});

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
                            {!record?.event.isPrivate ? (<Link to={`/playback/?raceId=${record.competitionUnit?.id}`}>{[record.event?.name, record.competitionUnit?.name].filter(Boolean).join(' - ')}</Link>) :
                                (<Link to={`/playback/?raceId=${record.competitionUnit?.id}`}>{record.event?.name}</Link>)}
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
            dataIndex: 'trackJson',
            key: 'trackJson.totalTraveledDistance',
            render: (_value, source) => {
                const totalTraveledDistance = source?.trackJson?.totalTraveledDistance;
                return totalTraveledDistance ? `${totalTraveledDistance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} NMi` : '-';
            }
        },
        {
            title: t(translations.my_tracks_page.elapsed_time),
            dataIndex: 'competitionUnit',
            key: 'competitionUnit.elapsedTime',
            render: (_value, source) => {
                if (!source?.competitionUnit?.isCompleted) return 'in progress';

                if (source?.trackJson?.startTime && source?.trackJson?.endTime) {
                    return moment(moment(source.trackJson.endTime).diff(moment(source.trackJson.startTime,))).utc().format(TIME_FORMAT.time)
                }

                const startTime = new Date(source?.competitionUnit?.startTime).getTime();
                const endTime = new Date(source?.competitionUnit?.endTime).getTime();

                return timeMillisToHours(endTime - startTime);
            }
        },
        {
            title: t(translations.my_tracks_page.action),
            key: 'action',
            render: (text, record) => {
                return <Space size={10}>
                    <DownloadButton onClick={(e) => performDownloadTrack(e, record, 'kml')} src={KMLIcon} data-tip={t(translations.my_tracks_page.download_as_kml)} />
                    <DownloadButton onClick={(e) => performDownloadTrack(e, record, 'gpx')} src={GPXIcon} data-tip={t(translations.my_tracks_page.download_as_gpx)} />
                    {record?.event?.isPrivate && <BiTrash onClick={() => showTrackDeleteModal(record)} data-tip={t(translations.tip.delete_this_track)} style={{ color: 'red', fontSize: '25px', cursor: 'pointer' }} />}
                    <ReactTooltip />
                </Space>;
            }
        },
    ];

    const showTrackDeleteModal = (track) => {
        setTrack(track);
        setShowDeleteModal(true);
    }

    const performDownloadTrack = (e, track, type) => {
        e.preventDefault();
        downloadTrack(track, type);
    }
    const [pagination, setPagination] = React.useState<any>({
        page: 1,
        total: 0,
        rows: [],
        size: 10
    });

    const [isChangingPage, setIsChangingPage] = React.useState<boolean>(false);

    React.useEffect(() => {
        getAll(pagination.page, pagination.size);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getAll = async (page, size) => {
        setIsChangingPage(true);
        const response = await getAllTracks(page, size);
        setIsChangingPage(false);

        if (response.success) {
            setPagination({
                ...pagination,
                rows: response.data?.rows,
                page: page,
                total: response.data?.count,
                size: response.data?.size
            });
        }
    }

    const onPaginationChanged = (page, size) => {
        getAll(page, size);
    }

    const onTrackDeleted = () => {
        getAll(pagination.page, pagination.size);
    }

    return (
        <>
            <DeleteTrackModal
                onTrackDeleted={onTrackDeleted}
                track={track}
                showDeleteModal={showDeleteModal}
                setShowDeleteModal={setShowDeleteModal} />
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

const DownloadButton = styled.img`
    width: 25px;
    height: 25px;
    cursor: pointer;
`;