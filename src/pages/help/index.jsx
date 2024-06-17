import {useLocaleState} from "react-admin";

const  HelpEn = () => {
    return (
        <div>
            <h1>Help in construction</h1>
        </div>
    )
}

const  HelpFr = () =>  {
    return (
        <div>
            <h1>Aide en construction</h1>
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