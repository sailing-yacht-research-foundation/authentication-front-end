import { translations } from "locales/translations";
import React from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

export const MarkerInfo = (props) => {
  const { coordinate, identifier, id } = props;

  const { t } = useTranslation();

  const isIdentifierExist = !!identifier;
  const identifierElement = isIdentifierExist ? (
    <RacerInfoContainer>
      <RacerInfoTitle>Track Name:</RacerInfoTitle>
      <br />
      <a href={`/playback?raceId=${id}`} target="__blank">
        {identifier}
      </a>
    </RacerInfoContainer>
  ) : undefined;

  const isCoordinateExist = !!(coordinate.lat || coordinate.lon);
  const coordinateElement = isCoordinateExist ? (
    <RacerInfoContainer>
      {isIdentifierExist && <hr />}
      <RacerInfoTitle>
        {t(translations.playback_page.coordinate)}
        <span style={{ color: "#999" }}>{t(translations.playback_page.lat_lon)}</span>:
      </RacerInfoTitle>
      [{coordinate.lat}, {coordinate.lon}]
    </RacerInfoContainer>
  ) : undefined;

  return (
    <div>
      {identifierElement}
      {coordinateElement}
    </div>
  );
};

const RacerInfoContainer = styled.div`
  font-size: 14px;
`;

const RacerInfoTitle = styled.span`
  font-weight: bold;
  margin-right: 5px;
`;
