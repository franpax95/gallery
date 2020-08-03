import React from 'react';
import './styles.css';

import Img from 'react-cool-img';
import loading from '../loading.svg';

const ImageCard = ({
    id = 0,
    src = '',
    alt = '',
    debounce,
    onClick
}) => {
    return(
        <div className="ImageCard" onClick={() => onClick(id)}>
            <Img
                src={src}
                alt={alt}
                debounce={debounce}
                placeholder={loading}
            />
        </div>
    );
}