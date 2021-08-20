import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { FilterResult } from '../FilterResult';
import MyProvider from 'app/components/Provider';

const shallowRenderer = createRenderer();

describe('<FilterResult />', () => {
  it('should render and match the snapshot', () => {
    shallowRenderer.render(
      <MyProvider>
        <FilterResult />
      </MyProvider>);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});
