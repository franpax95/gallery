import React, { useState, useEffect } from 'react';
import './App.css';
import { data as originalData } from './data.js';

import { useTrail, animated } from 'react-spring';
import Modal from './Modal';
// import OnImagesLoaded from 'react-on-images-loaded';
import Spinner from './Spinner';


const loadImage = url => {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.addEventListener('load', e => resolve(img));
        img.addEventListener('error', () => {
            reject(new Error(`Failed to load image's URL: ${url}`))
        });
        img.src = `/images/${url}_small.jpg`;
    })
}



const App = () => {
    const [data, setData] = useState(originalData);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            for(let i = 0; i < data.length; i++)
                await loadImage(data[i].src)
                    .then(img => {})
                    .catch(error => {
                        //console.error(error);

                        let newData = data;
                        newData[i].src = 'page-not-found';
                        newData[i].description = <>Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a></>
                        setData(newData);
                    });
            setLoading(false);
        }
        fetchData();
    }, []);

    const onClick = index => {
        setCurrent(index);
        setOpen(true);
    }

    const onClose = () => { setOpen(false); }
    const onPrevClick = id => { if(id !== 0) setCurrent(id - 1); }
    const onNextClick = id => { if(id !== data.length - 1) setCurrent(id + 1); }

    const trailSprings = useTrail(data.length, {
        from: { opacity: 0 },
        to: { opacity: 1 },
        config: { duration: 1000 }
    });

    return (
        <div className="App" style={{
            filter: (open) ? 'blur(5px)' : 'blur(0)',
            // transform: (open) ? 'scale(1.05)' : 'scale(1)'
        }}>
            {(loading)
                ? <Spinner />
                : trailSprings.map((spring, index) => (
                    <animated.div key={index} className="ImageCard" onClick={() => onClick(index)} style={{ 
                        ...spring, 
                        backgroundImage: `url(/images/${data[index].src}_small.jpg)` 
                    }}>
                        <div className="title">{data[index].title}</div>
                    </animated.div>
                ))
            }
            {open && <Modal
                src = {`/images/${data[current].src}.jpg`}
                id = {data[current].id}
                title = {data[current].title}
                description = {data[current].description}
                width = {data[current].width}
                height = {data[current].height}
                onClose = {onClose}
                onNextClick = {onNextClick}
                onPrevClick = {onPrevClick}
            />}
        </div>
    );
}

export default App;