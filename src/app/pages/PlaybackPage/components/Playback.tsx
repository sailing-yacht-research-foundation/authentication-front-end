import React, { useEffect } from 'react';
import * as L from 'leaflet';
import { useMap } from 'react-leaflet';
import styled from 'styled-components';
import { StyleConstants } from 'styles/StyleConstants';
import { BiSkipPrevious, BiSkipNext } from 'react-icons/bi';
import { BsFillSkipBackwardFill, BsFillSkipForwardFill, BsPlayFill } from 'react-icons/bs';
import { CgFlag } from 'react-icons/cg';
import { HiShare } from 'react-icons/hi';
import ReactDOMServer from 'react-dom/server';
import {
    EmailIcon,
    EmailShareButton,
    FacebookIcon,
    FacebookShareButton,
    InstapaperIcon,
    InstapaperShareButton,
    TwitterIcon,
    TwitterShareButton,
    WhatsappIcon,
    WhatsappShareButton
} from "react-share";
import { Table, Tag, Space } from 'antd';
import { media } from 'styles/media';

require("leaflet.boatmarker");
require('leaflet-hotline');


const columns = [
    {
        title: 'Rank',
        dataIndex: 'rank',
        key: 'rank',
    },
    {
        title: 'Competitor',
        dataIndex: 'competitor',
        key: 'competitor',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Color',
        key: 'color',
        dataIndex: 'color',
        render: color => (
            <Tag color={color} key={color}>
            </Tag>
        ),
    },
];

const data = [
    {
        key: '1',
        competitor: 'CZE',
        name: 'John Brown',
        rank: 1,
        color: 'blue',
    },
    {
        key: '2',
        competitor: '4441',
        name: 'Jim Green',
        rank: 2,
        color: 'red',
    },
    {
        key: '3',
        competitor: 'CZE',
        name: 'Joe Black',
        rank: 3,
        color: 'green',
    },
    {
        key: '4',
        competitor: '4125',
        name: 'Joe Brown',
        rank: 4,
        color: 'yellow',
    },
    {
        key: '5',
        name: 'Joe Blue',
        competitor: 'CZE',
        rank: 5,
        color: 'orange',
    },
];

const buttonStyle = {
    fontSize: '25px',
    color: '#fff'
}

const renderPlayerInfoPopup = () => {
    return (
        <div>
            <RacerInfoContainer>
                <RacerInfoTitle>
                    Competitor:
                </RacerInfoTitle>
                Klárka a Domča
            </RacerInfoContainer>

            <RacerInfoContainer>
                <RacerInfoTitle>
                    Sail number:
                </RacerInfoTitle>
                906
            </RacerInfoContainer>

            <RacerInfoContainer>
                <RacerInfoTitle>
                    Rank:
                </RacerInfoTitle>
                1
            </RacerInfoContainer>

            <RacerInfoContainer>
                <RacerInfoTitle>
                    Speed:
                </RacerInfoTitle>
                4.9 kts
            </RacerInfoContainer>

            <RacerInfoContainer>
                <RacerInfoTitle>
                    Competitor:
                </RacerInfoTitle>
                Klárka a Domča
            </RacerInfoContainer>

            <RacerInfoContainer>
                <RacerInfoTitle>
                    Bearing:
                </RacerInfoTitle>
                116 deg
            </RacerInfoContainer>

            <RacerInfoContainer>
                <RacerInfoTitle>
                    Angle to wind:
                </RacerInfoTitle>
                147 deg
            </RacerInfoContainer>

            <RacerInfoContainer>
                <RacerInfoTitle>
                    Position:
                </RacerInfoTitle>
                N48°43.776' E014°04.227'
            </RacerInfoContainer>

            <RacerInfoContainer>
                <RacerInfoTitle>
                    Position:
                </RacerInfoTitle>
                (48.72959622625286, 14.070451233946242)
            </RacerInfoContainer>
        </div>
    )
}

export const Playback = (props) => {

    const map = useMap();

    useEffect(() => {
        initializeMapView();
        addBoatsToMap();
    }, []);

    const initializeMapView = () => {
        new L.TileLayer(`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${process.env.REACT_APP_MAP_BOX_API_KEY}`, {
            attribution: '<a href="https://www.github.com/sailing-yacht-research-foundation"><img src="https://syrf.io/wp-content/themes/syrf/assets/svg/icon-github.svg"></img></a>',
            maxZoom: 18,
            id: 'jweisbaum89/cki2dpc9a2s7919o8jqyh1gss',
            tileSize: 512,
            zoomOffset: -1,
            accessToken: 'your.mapbox.access.token'
        }).addTo(map);
    }

    const addBoatsToMap = () => {
        L.boatMarker(map.getCenter(), {
            color: "red", 	// color of the boat
            idleCircle: false	// if set to true, the icon will draw a circle if
        }).bindPopup(ReactDOMServer.renderToString(renderPlayerInfoPopup())).openPopup().addTo(map);


        L.polyline([
            [47.822007, -125.688816],
            [47.797659, -125.683594],
            [47.784281, -125.684624],
            [47.726808, -125.678444],
        ]).setStyle({
            color: 'red',
            weight: 1
        }).addTo(map);


        L.boatMarker({
            lng: -125.672436,
            lat: 47.824520
        }, {
            color: "blue", 	// color of the boat
            idleCircle: false	// if set to true, the icon will draw a circle if
        }).addTo(map);

        L.polyline([
            [47.824520, -125.672436],
            [47.772007, -125.670547],
            [47.741078, -125.682220],
        ]).setStyle({
            color: 'blue',
            weight: 1
        }).addTo(map);


        L.boatMarker({
            lng: -125.650449,
            lat: 47.827516
        }, {
            color: "purple", 	// color of the boat
            idleCircle: false	// if set to true, the icon will draw a circle if
        }).addTo(map);

        L.polyline([
            [47.827516, -125.650449],
            [47.771268, -125.700073],
            [47.737569, -125.669174],
        ]).setStyle({
            color: 'purple',
            weight: 1
        }).addTo(map);

        L.boatMarker({
            lng: -125.731526,
            lat: 47.814146
        }, {
            color: "green", 	// color of the boat
            idleCircle: false	// if set to true, the icon will draw a circle if
        }).addTo(map);

        L.polyline([
            [47.814146, -125.731526],
            [47.770299, -125.734749],
            [47.754837, -125.707283],
        ]).setStyle({
            color: 'green',
            weight: 1
        }).addTo(map);


        L.boatMarker({
            lng: -125.653541,
            lat: 47.803770
        }, {
            color: "#f1c40f", 	// color of the boat
            idleCircle: false	// if set to true, the icon will draw a circle if
        }).addTo(map);

        L.polyline([
            [47.803770, -125.653541],
            [47.799365, -125.649948],
            [47.794753, -125.647202],
            [47.774452, -125.643425],
            [47.743987, -125.638275]
        ]).setStyle({
            color: 'yellow',
            weight: 1
        }).addTo(map);

        L.marker({
            lat: 47.808151,
            lng: -125.642891
        }, {
            icon: L.divIcon({
                html: ReactDOMServer.renderToString(<CgFlag style={{ color: '#fff', fontSize: '35px' }} />),
                iconSize: [20, 20],
                className: 'myDivIcon'
            })
        }).addTo(map);

        L.marker({
            lat: 47.800541,
            lng: -125.741146
        }, {
            icon: L.divIcon({
                html: ReactDOMServer.renderToString(<CgFlag style={{ color: '#fff', fontSize: '35px' }} />),
                iconSize: [20, 20],
                className: 'myDivIcon'
            })
        }).addTo(map);
    }

    return (
        <>
            {/* <Leaderboard>
                <Table pagination={false} columns={columns} dataSource={data} />
            </Leaderboard> */}
            <PlaybackWrapper>
                <ProgressBar>
                    <ProgressedBar />
                </ProgressBar>
                <PlaybackLengthContainer>
                    <TimeText>12:57</TimeText>
                    <TimeText>2:12:57</TimeText>
                </PlaybackLengthContainer>
                <PlayBackControlContainer>
                    <ButtonContainer>
                        <BsFillSkipBackwardFill style={buttonStyle} />
                    </ButtonContainer>
                    <ButtonContainer >
                        <BiSkipPrevious style={buttonStyle} />
                    </ButtonContainer>
                    <ButtonContainer>
                        <BsPlayFill style={buttonStyle} />
                    </ButtonContainer>
                    <ButtonContainer>
                        <BiSkipNext style={buttonStyle} />
                    </ButtonContainer>
                    <ButtonContainer>
                        <BsFillSkipForwardFill style={buttonStyle} />
                    </ButtonContainer>
                </PlayBackControlContainer>
                <ShareButtonWrapper>
                    <ButtonContainer style={{ width: '30px', height: '30px' }}>
                        <ShareButton />
                    </ButtonContainer>
                    <ShareDropdown>
                        <ShareButtonItemWrapper>
                            <EmailShareButton url="">
                                <EmailIcon size={35} round={true} />
                            </EmailShareButton>
                        </ShareButtonItemWrapper>
                        <ShareButtonItemWrapper>
                            <FacebookShareButton url="">
                                <FacebookIcon size={35} round={true} />
                            </FacebookShareButton>
                        </ShareButtonItemWrapper>
                        <ShareButtonItemWrapper>
                            <InstapaperShareButton url="">
                                <InstapaperIcon size={35} round={true} />
                            </InstapaperShareButton>
                        </ShareButtonItemWrapper>
                        <ShareButtonItemWrapper>
                            <TwitterShareButton url="">
                                <TwitterIcon size={35} round={true} />
                            </TwitterShareButton>
                        </ShareButtonItemWrapper>
                        <ShareButtonItemWrapper>
                            <WhatsappShareButton url="">
                                <WhatsappIcon size={35} round={true} />
                            </WhatsappShareButton>
                        </ShareButtonItemWrapper>
                    </ShareDropdown>
                </ShareButtonWrapper>
            </PlaybackWrapper>
        </>
    )
}

const PlaybackWrapper = styled.div`
    z-index: 99999;
    width: 100%;
    height: 150px;
    background: #fff;
    position: fixed;
    border-top: 1px solid #eee;
    bottom: 0;
    display: flex;
    flex-direction: column;
    bottom: 0;
`;

const ProgressBar = styled.div`
    width: 100%;
    height: 7px;
    background: #ddd;
`;

const ProgressedBar = styled.div`
    width: 25%;
    background: ${StyleConstants.MAIN_TONE_COLOR};
    height: 100%;
`;

const PlayBackControlContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
`;

const ButtonContainer = styled.div`
    width: 45px;
    height: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background: ${StyleConstants.MAIN_TONE_COLOR};
    margin: 0 10px;
`;

const PlaybackLengthContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin: 5px 0px;
    padding: 0 5px;
`;

const TimeText = styled.span`
    color: ${StyleConstants.MAIN_TONE_COLOR};
    font-size: 14px;
`;

const ShareButtonWrapper = styled.div`
    position: absolute;
    bottom: 10px;
    right: 20px;
`;

const ShareButtonItemWrapper = styled.div`
    margin: 5px 0;
`;

const ShareButton = styled(HiShare)`
    color: #fff;
    font-size: 17px;
`;

const ShareDropdown = styled.div`
    width: 100%;
    background: #fff;
    box-shadow: 0 3px 8px rgba(9,32,77,0.12),0 0 2px rgba(29,17,51,0.12);
    border-radius: 20px;
    position: absolute;
    height: auto;
    bottom: 50px;
    display: flex;
    flex-direction: column;
    padding: 0 10px;
    align-items: center;
    // display: none;
`;

const RacerInfoContainer = styled.div`
    font-size: 14px;
`;

const RacerInfoTitle = styled.span`
    font-weight: bold;
    margin-right: 5px;
`;

const Leaderboard = styled.div`
    position: fixed;
    z-index: 9999;
    width: 100%;
    bottom: 150px;

    ${media.medium`
        width: auto;
    `}
`;

const LeaderboardToggleButton = styled.div`
    position: absolute;
    right: -10px;
`;