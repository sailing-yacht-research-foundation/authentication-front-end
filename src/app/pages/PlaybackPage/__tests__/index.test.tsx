import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { PlaybackPage } from '../index';
import Provider from 'app/components/Provider/index';
import i18next from 'i18next';

const shallowRenderer = createRenderer();

describe('<PlaybackPage />', () => {
  it('should render with en translations', () => {
    i18next.changeLanguage('en');
    shallowRenderer.render(
      <Provider>
        <PlaybackPage />
      </Provider>);
    const renderedOutput = shallowRenderer.getRenderOutput();
    expect(renderedOutput).toMatchSnapshot();
  });
});
