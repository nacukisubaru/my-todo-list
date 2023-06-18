import { useEffect, useRef, useState } from "react";

interface IObserverScroll {
    targetRef:any;
}

export const useObserverScroll = (fetch:any, page: number, scroll: boolean = true):IObserverScroll => {

    const [isVisible, setIsVisible] = useState(false);
    const targetRef: any = useRef();
    
    const callbackFunction = (entries: any) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
    };

    useEffect(() => {
        const observer = new IntersectionObserver(callbackFunction);

        const setNewObserver = () => {
            const currentTarget = targetRef.current;
            if (currentTarget) {
                observer.observe(currentTarget);
            }
        };

        if (isVisible) {
            if(scroll) {
                fetch(page);
                setNewObserver();
            }
        }

        setNewObserver();
    }, [targetRef, isVisible]);

    return targetRef;
}