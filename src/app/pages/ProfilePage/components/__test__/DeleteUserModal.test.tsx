
import * as React from 'react';
import { createRenderer } from 'react-test-renderer/shallow';
import { DeleteUserModal } from '../DeleteUserModal';
import MyProvider from 'app/components/Provider';

const shallowRenderer = createRenderer();

describe('<DeleteUserModal.test />', () => {
    it('should render to match the snapshot', () => {
        shallowRenderer.render(
            <MyProvider>
                <DeleteUserModal />
            </MyProvider>
        );
        const renderedOutput = shallowRenderer.getRenderOutput();
        expect(renderedOutput).toMatchSnapshot();
    });
});