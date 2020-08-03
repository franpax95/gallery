import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import './styles.css';

import useInnerWidth from '../../hooks/useInnerWidth';
import { animated, useSpring, useChain } from 'react-spring';
import Spinner from '../Spinner';

// import Img from 'react-cool-img';
import { MdClose } from 'react-icons/md';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';


const calcGreater = (x, y) => {
    if(x > y)   return true;
    else        return false;
}

const delay = (t) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => { resolve('foo'); }, t);
    });
};

const loadImage = url => {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.addEventListener('load', e => resolve(img));
        img.addEventListener('error', () => {
            reject(new Error(`Failed to load image's URL: ${url}`))
        });
        img.src = `/images/${url}.jpg`;
    });
}






const Modal = ({
    onClose = undefined,
    onPrevClick = undefined,
    onNextClick = undefined,
    height = 800,
    width = 1200,
    id = '',
    title = '',
    description = '',
    src = '',
}) => {
    const [loading, setLoading] = useState(true);
    const [isDisplay, setIsDisplay] = useState(false);

    const [innerWidth, innerHeight] = useInnerWidth();
    const [currentWidth, setCurrentWidth] = useState(width);
    const [currentHeight, setCurrentHeight] = useState(height);

    useEffect(() => {
        /** wait until img is loaded */
        const fetchData = async () => {
            await delay(300);
            await loadImage(src)
                .then(img => {})
                .catch(error => {});

            setLoading(false);
        }
        setLoading(true);
        fetchData();
    }, [id]);

    /** resize effect */
    // useEffect(() => {
    //     let w = Math.abs(innerWidth - width);
    //     let h = Math.abs(innerHeight - height);
        
    //     if(w > h){
    //         const cw = innerWidth * 0.7;
    //         setCurrentWidth(cw);
    //         setCurrentHeight(cw * height/width);
    //     }else{
    //         const ch = innerHeight * 0.7;
    //         setCurrentHeight(ch);
    //         setCurrentWidth(ch * width/height);
    //     }
    // }, [width, height, innerWidth, innerHeight]);

    /** resize effect */
    useEffect(() => {
        if(width > height){
            setCurrentWidth(innerWidth * 0.7);
            setCurrentHeight(innerWidth * 0.7 * height / width);
        }else{
            setCurrentHeight(innerHeight * 0.7);
            setCurrentWidth(innerHeight * 0.7 * width / height);
        }
    }, [width, height, innerWidth, innerHeight]);



    const onMouseEnter = () => { !loading && setIsDisplay(true); }
    const onMouseLeave = () => { !loading && setIsDisplay(false); }



    const springContentRef = useRef();
    const springContent = useSpring({
        width: (loading && !isDisplay) ? '150px' : `${currentWidth}px`,
        height: (loading && !isDisplay) ? '150px' : `${currentHeight}px`,
        ref: springContentRef,
        config: { duration: 400 }
    });

    const springImgRef = useRef();
    const springImg = useSpring({
        from: { opacity: "0" },
        to: { opacity: "1" },
        ref: springImgRef,
        config: { duration: 400 }
    });

    const springContentCurrent = !springContentRef.current ? springContentRef : { current: springContentRef.current };
    const springImgCurrent = !springImgRef.current ? springImgRef : { current: springImgRef.current };
    useChain([springContentCurrent, springImgCurrent], [0, 0.4]);



    return ReactDOM.createPortal(
        <div className="Modal" onClick={onClose}>
            <animated.div 
                className="content" 
                style={{ ...springContent }} 
                onClick={e => e.stopPropagation()}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                {loading
                    ? <Spinner />
                    : <animated.div className="img" style={{ ...springImg }} onClick={onClose}>
                        <img src={src} alt={title} />
                    </animated.div>
                }

                <button className="close" onClick={() => { !loading && onClose() }} style={{ opacity: isDisplay ? 1 : 0 }}><MdClose /></button>
                <button className="left" onClick={() => { !loading && onPrevClick(id) }} style={{ opacity: isDisplay ? 1 : 0 }}><AiOutlineArrowLeft /></button>
                <button className="right" onClick={() => { !loading && onNextClick(id) }} style={{ opacity: isDisplay ? 1 : 0 }}><AiOutlineArrowRight /></button>

                <animated.div className="info" style={{ ...springImg }}>
                    <div className="title">{title}</div>
                    <div className="description">{description}</div>
                </animated.div>
            </animated.div>
        </div>,
        document.body
    );
}

export default Modal;