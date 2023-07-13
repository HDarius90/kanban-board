function getDate (days) {
    let currentDate = new Date();  
    if(days){
        currentDate.setDate(currentDate.getDate() + days);
    }
    return currentDate.toJSON().slice(0, 10); // "2023-06-29"
}

module.export = getDate();