
export default function useTimeConverterHook  (createdAt) {
  

    const date = new Date

    const recentTime = {
        yearNow : date.getUTCFullYear(),
        monthNow : date.getUTCMonth(),
        dateNow : date.getUTCDate(),
        timeNow : date.getUTCHours(),
        minuteNow : date.getUTCMinutes()
    }


    const arr = createdAt.split("T")
    
    const dateArr = arr[0].split("-")
    const timeArr = arr[1].split(":")

    

    const yearDifference = parseInt(recentTime.yearNow - dateArr[0])

    const monthDifference = parseInt((recentTime.monthNow + 1) - dateArr[1])

    const dateDifference = parseInt (recentTime.dateNow - dateArr[2] )

    const recentTimeInSecond = parseInt(recentTime.timeNow * 60 * 60 + (recentTime.minuteNow * 60))

    const uploadedTimeInSecond = parseInt(timeArr[0] * 60 * 60 + (timeArr[1] * 60))

    const convertedTimeInSecond = parseInt(recentTimeInSecond - uploadedTimeInSecond)

    let timeString="";

    if(yearDifference) timeString = `${yearDifference} year ago`

    else{

        if(monthDifference) timeString = `${monthDifference} month ago`

        else{
            if(dateDifference){
                if(dateDifference < 7) timeString = `${dateDifference} day ago`;
                else if (dateDifference >= 7 && dateDifference < 14)  timeString = "1 week ago"
                else if(dateDifference >= 14 && dateDifference < 21) timeString = "2 week ago"
                else if (dateDifference >= 21 && dateDifference < 28) timeString = "3 week ago"
                else if (dateDifference >= 28) timeString = "4 week ago" 
                
            }else{
                if(convertedTimeInSecond >= 3600) {
                    const hour = parseInt(convertedTimeInSecond / 3600) 
                    timeString = `${hour} hour ago`

                }
                else{
                    const minutes = parseInt(convertedTimeInSecond / 60)
                    if(minutes) timeString = `${minutes} minutes ago`
                    else timeString="Just now"
                }
            }
        }
    }

    return timeString

}




