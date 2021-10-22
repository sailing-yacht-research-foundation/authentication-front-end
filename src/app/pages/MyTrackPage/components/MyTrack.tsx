import React from 'react';
import { Table, Spin, Dropdown, Menu, Button } from 'antd';
import { useTranslation } from 'react-i18next';
import Lottie from 'react-lottie';
import NoResult from '../assets/no-results.json';
import { translations } from 'locales/translations';
import { LottieMessage, LottieWrapper, PageHeaderContainer, PageHeaderText, TableWrapper } from 'app/components/SyrfGeneral';
import moment from 'moment';
import { downloadTrack, getAllTracks } from 'services/live-data-server/my-tracks';
import { Link } from 'react-router-dom';
import { TIME_FORMAT } from 'utils/constants';
import ReactTooltip from 'react-tooltip';

const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: NoResult,
    rendererSettings: {
        preserveAspectRatio: 'xMidYMid slice'
    }
};

export const MyTrack = () => {

    const { t } = useTranslation();

    const columns = [
        {
            title: t(translations.my_tracks_page.name),
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => {
                if (record.competitionUnit)
                    return <>
                        <Link data-tip={t(translations.tip.play_this_track)} to={`/playback/?raceId=${record.competitionUnit?.id}`}>{record.event?.name}</Link>
                        <ReactTooltip />
                    </>;
                return record.event?.name;
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
            title: 'Action',
            key: 'action',
            render: (text, record) => {
                return <>
                    <Dropdown overlay={<Menu>
                        <Menu.Item>
                            <a onClick={(e) => performDownloadTrack(e, record, 'kml')} target="_blank" rel="noopener noreferrer" href="/">
                                {t(translations.my_tracks_page.download_as_kml)}
                            </a>
                        </Menu.Item>
                        <Menu.Item>
                            <a onClick={(e) => performDownloadTrack(e, record, 'gpx')} target="_blank" rel="noopener noreferrer" href="/">
                            {t(translations.my_tracks_page.download_as_gpx)}
                            </a>
                        </Menu.Item>
                    </Menu>} placement="bottomRight" arrow>
                        <Button type="link">{t(translations.my_tracks_page.download)}</Button>
                    </Dropdown>
                </>;
            }
        },
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

    const performDownloadTrack = (e, track, type) => {
        e.preventDefault();
        downloadTrack(track, type);
    }

    return (
        <>
            <PageHeaderContainer>
                <PageHeaderText>{t(translations.my_tracks_page.my_tracks)}</PageHeaderText>
            </PageHeaderContainer>
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