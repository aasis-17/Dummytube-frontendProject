import { useEffect, useState } from "react"

export default function useTimeConverterHook  (createdAt) {
    //const [timeValue, setTimeValue] = useState("")
    console.log(createdAt)
  

    const date = new Date
    const recentTime = {
        yearNow : date.getUTCFullYear(),
        monthNow : date.getUTCMonth(),
        dateNow : date.getUTCDate(),
        timeNow : date.getUTCHours(),
        minuteNow : date.getUTCMinutes()
    }
    console.log(recentTime)

    const arr = createdAt.split("T")
    
    const dateArr = arr[0].split("-")
    const timeArr = arr[1].split(":")

    console.log(dateArr, timeArr)

    const yearDifference = parseInt(recentTime.yearNow - dateArr[0])

    const monthDifference = parseInt((recentTime.monthNow + 1) - dateArr[1])

    const dateDifference = parseInt (recentTime.dateNow - dateArr[2] )

    const timeDifference = parseInt(recentTime.timeNow - timeArr[0])

    const minuteDifference = parseInt(recentTime.minuteNow - timeArr[1])

    let timeString="";

    // useEffect(() => {
    //     setTimeValue(timeString)
    // },[timeString])

    if(yearDifference !== 0){
        timeString = `${yearDifference} year ago`
    }else{
        if(monthDifference !== 0){
            timeString = `${monthDifference} month ago`
        }else{
            if(dateDifference !== 0){
                if(dateDifference < 7) timeString = `${dateDifference} day ago`;
                if (dateDifference > 7)  timeString = "1 week ago"
                if(dateDifference > 14) timeString = "2 week ago"
                if (dateDifference > 21) timeString = "3 week ago"
                if (dateDifference > 28) timeString = "4 week ago" 
                
            }else{
                if(timeDifference !== 0){
                    timeString = `${timeDifference} hour ago`
                }else{
                    if(minuteDifference !==0 ){
                        timeString = `${minuteDifference} minutes ago`
                    }else{
                        timeString="Just now"
                    }
                }
            }
        }
    }

    return timeString

}




