import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import { HeaderContent } from './HeaderContent';
import { useLocation } from 'react-router-dom';

export const Header = () => {
    const routersWithNoHeader = ['/signin'];

    const location = useLocation();

    const [showHeader, setShowHeader] = useState<boolean>(false);

    useEffect(() => {
        const showHeader = !(routersWithNoHeader.indexOf(location.pathname) !== -1);
        setShowHeader(showHeader);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);

    return (
        <>
            {
                showHeader ? (
                    <Layout.Header className="site-header" >
                        <HeaderContent />
                    </Layout.Header >
                ) : (<></>)

            }
        </>
    )
}