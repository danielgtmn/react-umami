import React from "react";

const UmamiAnalytics = ()=>{

    // @ts-ignore
    const UmamiUrl = process.env.UMAMI_URL
    // @ts-ignore
    const UmamiId = process.env.UMAMI_ID
    // @ts-ignore
    const UmamiDebug = process.env.UMAMI_DEBUG || "false"

    if(UmamiDebug === "true"){
        console.warn("The Umami Analytics is in Debug Mode")
        console.log("The Umami Url is",UmamiUrl);
        console.log("The Umami ID is",UmamiId);
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
    if (process.env.NODE_ENV == 'production') {
        return (
            <script
                defer
                src={UmamiUrl+"/script.js"}
                data-website-id={UmamiId}
            >
            </script>
        )
    }else {
        if(UmamiDebug === "true"){
            console.log("The Umami Analytics is not count clicks in Non Production - But Working");
        }
        return null;
    }
}
export default UmamiAnalytics