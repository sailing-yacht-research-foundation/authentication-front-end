import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { DataDetails } from '../DataDetails';

const shallowRenderer = createRenderer();

describe('<DataDetails />', () => {
    it('should render the deals page and matchs the snapshot', () => {
        shallowRenderer.render(<DataDetails data={
            {
                title: 'Yacht Club Density',
                description: '3D Hexbin map to visualize the density of yacht clubs.',
                screenshotUrl: '/static-htmls/E_yacht_clubs/screenshot.png',
                htmlUrl: '/static-htmls/E_yacht_clubs/yacht_clubs.html',
            }
        } />);
        const renderedOutput = shallowRenderer.getRenderOutput();
        expect(renderedOutput).toMatchSnapshot();
    });
});