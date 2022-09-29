import React from 'react';
import { Select } from 'antd';
import { translations } from 'locales/translations';
import { useTranslation } from 'react-i18next';
import { MVTLayer } from '@deck.gl/geo-layers';
import styled from 'styled-components';
import { checkIfDeckGLDataSourceValidAndRender } from 'utils/helpers';

export const NauticalChartSelector = (props) => {

    const { layers, deckLayer, setLayers } = props;

    const { t } = useTranslation();

    const toggleLayers = (values, layerArray, setLayers, deckLayer) => {
        const soundingsLayer = new MVTLayer({
            data: `${process.env.REACT_APP_CHART_DATA_URL}/data/tiles/pbftiles/soundg/{z}/{x}/{y}.pbf`,
            id: 'soundings',
            pointType: 'text',
            getText: (d) => parseFloat(d.properties.depth).toFixed(2) + '',
            getTextSize: 10,
            getLabel: f => {
                return f.properties.depth;
            },
            getLabelSize: f => 1000,
            getTextColor: f => [255, 255, 255],
            labelSizeUnits: 'meters',
            getPointRadius: 100,
        });
        const newLayers = values?.includes('soundings') ? [...layerArray, soundingsLayer] : layerArray.filter(l => {
            return l.id !== 'soundings';
        });;

        setLayers(newLayers);
        checkIfDeckGLDataSourceValidAndRender(deckLayer, newLayers);
    }


    return (
        <LayerSelector style={props.style}>
            <Select placeholder={t(translations.playback_page.select_layers)}
                mode={'multiple'}
                maxTagCount={'responsive'}
                onChange={(values)=> toggleLayers(values, layers, setLayers, deckLayer)}
                showArrow
                allowClear>
                <Select.Option value={'soundings'}>Soundings</Select.Option>
            </Select>
        </LayerSelector>
    )
}


const LayerSelector = styled.div`
  position: absolute;
  z-index: 9999;
  right: 5px;
  top: 5px;

  .ant-select-multiple {
    min-width: 130px;
  }
`;
