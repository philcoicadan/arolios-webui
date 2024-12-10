
import {useTranslate} from "react-admin";
import {
    Box,
} from '@mui/material';


const LicenseText = () => {
    return (
        <Box sx={{ border: '1px solid black'}}>
            <p>
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:</p>

<p>The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.</p>

<p>THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.</p>

        </Box>
    )
}


const About = () => {

    const translate = useTranslate();

    return (
        <div>
            <p>AROLIOS WebUI &nbsp;{translate('arolios.webui_purpose')}.</p>
            <p>AROLIOS &nbsp;{translate('arolios.trademark_registered')}.</p>
            <p>AROLIOS WebUI &nbsp; &copy; 2024 Philippe Coicadan. {translate('arolios.all_rights_reserved')}.</p>
            <p>AROLIOS WebUI &nbsp;{translate('arolios.license_intro')}</p>

            <LicenseText/>
            <p>{translate('arolios.source_link')}&nbsp; https://lab.frogg.it/philcoicadan/arolios-webui</p>
        
        </div>
    )

}


export default About;