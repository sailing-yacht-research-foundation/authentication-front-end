import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { BenefitCarousel } from '../BenefitCarousel';

const shallowRenderer = createRenderer();

describe('<BenefitCarousel />', () => {
  it('should render the benefit carousel and matchs the snapshot', () => {
    shallowRenderer.render(<BenefitCarousel />);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});