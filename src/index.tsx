import React, { useEffect, useState } from "react";

const UmamiAnalytics = () => {
    // @ts-ignore
    const UmamiUrl = process.env.UMAMI_URL
    // @ts-ignore
    const UmamiId = process.env.UMAMI_ID
    // @ts-ignore
    const UmamiDebug = process.env.UMAMI_DEBUG || "false"
    // @ts-ignore
    const UmamiLazyLoad = process.env.UMAMI_LAZY_LOAD || "false"

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (UmamiLazyLoad === "true" && !isLoaded) {
            const loadScript = () => {
                const script = document.createElement('script');
                script.src = `${UmamiUrl}/script.js`;
                script.defer = true;
                script.setAttribute('data-website-id', UmamiId);
                document.body.appendChild(script);
                setIsLoaded(true);
            };

            // Load script when user interacts with the page
            const handleInteraction = () => {
                loadScript();
                document.removeEventListener('mousemove', handleInteraction);
                document.removeEventListener('scroll', handleInteraction);
                document.removeEventListener('click', handleInteraction);
            };

            document.addEventListener('mousemove', handleInteraction);
            document.addEventListener('scroll', handleInteraction);
            document.addEventListener('click', handleInteraction);

            return () => {
                document.removeEventListener('mousemove', handleInteraction);
                document.removeEventListener('scroll', handleInteraction);
                document.removeEventListener('click', handleInteraction);
            };
        }
    }, [UmamiLazyLoad, UmamiUrl, UmamiId, isLoaded]);

    if(UmamiDebug === "true"){
        console.warn("The Umami Analytics is in Debug Mode")
        console.log("The Umami Url is", UmamiUrl);
        console.log("The Umami ID is", UmamiId);
        console.log("Lazy Loading is", UmamiLazyLoad);
    }

    if (UmamiUrl === undefined) {
        if(UmamiDebug === "true"){
            console.error("The Umami Url is Not Set");
        }
        throw new Error("The Umami Url is Not Set");
    }
    if (UmamiId === undefined) {
        if(UmamiDebug === "true"){
            console.error("The Umami ID is Not Set");
        }
        throw new Error("The Umami ID is Not Set");
    }

    // @ts-ignore
    if (process.env.NODE_ENV === 'production') {
        if (UmamiLazyLoad === "true") {
            return null; // Script will be loaded via useEffect
        }
        return (
            <script
                defer
                src={UmamiUrl+"/script.js"}
                data-website-id={UmamiId}
            >
            </script>
        )
    } else {
        if(UmamiDebug === "true"){
            console.log("The Umami Analytics is not count clicks in Non Production - But Working");
        }
        return null;
    }
}

export default UmamiAnalytics