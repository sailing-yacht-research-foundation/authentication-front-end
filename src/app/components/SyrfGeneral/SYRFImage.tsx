import React from 'react';

export const SYRFImage = (props) => {

    const [errored, setErrored] = React.useState<boolean>(false);

    const onError = (e) => {
        if (!errored) { // prevent infinity loop
          e.target.onerror = null;
          e.target.src = props.fallback || '/app-logo.png';
          setErrored(true);
        }
      }

    return (
        <img onError={onError} alt={props.alt} {...props} />
    )
}
