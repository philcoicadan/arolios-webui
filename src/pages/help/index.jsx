import {useLocaleState} from "react-admin";

const  HelpEn = () => {
    return (
        <div>
            <h1>How to use AROLIOS in a web browser:&nbsp; <a href="https://www.youtube.com/watch?v=59lapSUfY-4" target="_blank">video</a></h1>
            </div>
    )
}

const  HelpFr = () =>  {
    return (
        <div>
            <h1>Comment utiliser AROLIOS dans un navigateur web:&nbsp; <a href="https://www.youtube.com/watch?v=59lapSUfY-4" target="_blank">vidéo</a></h1>
        </div>
    )
}


const Help = () => {
    const [locale] =useLocaleState();

    
    if (locale === 'fr') {
        return ( <HelpFr/> );
    } else if (locale === 'en') {
        return ( <HelpEn/> );

    }

}


export default Help;