import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { App } from '../index';
import MyProvider from 'app/components/Provider';

const renderer = createRenderer();

describe('<App />', () => {
  it('should render and match the snapshot', () => {
    renderer.render(
      <MyProvider>
        <App />
      </MyProvider>);
    const renderedOutput = renderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});
