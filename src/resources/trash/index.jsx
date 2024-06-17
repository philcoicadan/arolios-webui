import {List, Datagrid, TextField, TopToolbar, DeleteWithConfirmButton, Button, useRecordContext, useDataProvider, useRefresh, useNotify} from 'react-admin';

import { useState } from "react";
import { useTranslate } from "react-admin";
import { useMutation} from 'react-query';
import {Confirm} from 'react-admin';


const TrashPurgeAllButton = () => {
    const translate = useTranslate();
    const dataProvider = useDataProvider();
    const [open, setOpen] = useState(false);
    const refresh = useRefresh ();
    const notify = useNotify ();
    const { mutate, isLoading} = useMutation (
        [ 'trash', 'delete'],
        () => dataProvider.delete('trash',  { meta: {  instance: false}}),
        { onSuccess: (data) => {
            refresh();
            notify ('arolios.empty_trash_success', { type: 'success'});
        },
        onError: (error) => {
            notify ('arolios.empty_trash_error', { type: 'error',  messageArgs: { message: `${error.message}`}});
        }
    }
    ) ;
    const handleClick = () => setOpen(true);
    const handleDialogClose = () => setOpen(false);
    const handleConfirm = () => {
        mutate();
        setOpen(false);
    };
    return (
        <>
            <Button label={translate('arolios.empty_trash')} onClick={()=> handleClick()} disabled={isLoading} />
            <Confirm
                isOpen={open}
                loading={isLoading}
                title={translate('arolios.empty_trash_title')}
                content={translate('arolios.empty_trash_confirm_msg')}
                onConfirm={handleConfirm}
                onClose={handleDialogClose}
            />
        </>
    );
}



const DLActions = ( ) => {

    return (
    <TopToolbar>
        <TrashPurgeAllButton/>       
    </TopToolbar>
    )
    
}

const TrashRecoverButton = () => {
    const translate = useTranslate();
    const record = useRecordContext();
    const dataProvider = useDataProvider();
    const refresh = useRefresh ();
    const notify = useNotify ();
    const { mutate, isLoading} = useMutation (
        [ 'trash', 'update', { id: record.id }],
        () => dataProvider.update('trash', {id: record.id, data: { id: record.id}}),
        { onSuccess: (data) => {
            refresh();
            notify ('arolios.recover_success', { type: 'success'});
        },
        onError: (error) => {
            notify ('arolios.recover_error', { type: 'error',  messageArgs: { message: `${error.message}`}});
        }
    }
    ) ;
    return <Button label={translate('arolios.recover')} onClick={()=> mutate()} disabled={isLoading} />
}


export const TrashList = (() => {
    const translate = useTranslate();

     return (
    <List  title= {translate('arolios.trash_contents')} sort={{ field: 'id', order:"DESC"}}  actions={<DLActions/>}>
        <Datagrid 
            bulkActionButtons={false}
            >
                     
            <TextField source ="classifier._tid_name" label="arolios.classifier"/>
            <TextField source ="properties" label="arolios.properties" />
            <TrashRecoverButton />
            <DeleteWithConfirmButton label={translate('arolios.eliminate')}
                confirmTitle={translate('arolios.eliminate_title')}
                confirmContent={translate('arolios.eliminate_confirm_msg')}
                
            />
            

        </Datagrid>

       
    </List>)
})
