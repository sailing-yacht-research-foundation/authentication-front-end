import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { PartnerAppCarousel } from '../PartnerAppCarousel';

const shallowRenderer = createRenderer();

describe('<PartnerAppCarousel />', () => {
  it('should render and matchs the snapshot', () => {
    shallowRenderer.render(<PartnerAppCarousel />);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});