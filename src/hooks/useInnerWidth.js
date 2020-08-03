import { useState, useEffect } from 'react';

const useInnerWidth = () => {
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);

    const update = () => { 
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
    }

    useEffect(() => {
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    });

    return [width, height];
}

export default useInnerWidth;