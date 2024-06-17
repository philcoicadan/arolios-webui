import { Layout } from 'react-admin';
import CustomAppBar from './AppBar';
import CustomMenu from './Menu';



const CustomLayout =  ( props ) => {

    return (

            <Layout { ...props} appBar={CustomAppBar} 
            menu={CustomMenu} />

 
            
    ) 
};

export default CustomLayout;
