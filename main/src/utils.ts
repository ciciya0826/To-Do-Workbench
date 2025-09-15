export const getLocalStorage=(key:string,emptyValue:any)=>{
    const item = localStorage.getItem(key);
    if(item){
        try{
            const data=JSON.parse(item);
            return data;
        }catch(e){
            return item;
        }
    }
    return emptyValue;
}

export const saveLocalStorage=(key:string,value:any)=>{
    localStorage.setItem(key,JSON.stringify(value));
}