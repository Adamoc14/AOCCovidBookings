// Global Variable Declarations and Function Definitions
const url = "/Client/Views/",
    appointment_Details = {}

const dealWithMonths = () => {
    const months = [...document.querySelectorAll('.month')];
    months.map(month => {
        $(month).click(e => {
            // Get month Selected Info , adds it to appointment details
            let monthSelected = clickMonth(months , e.target);
            appointment_Details["Month"] = monthSelected.Name

            // Display Calendar and Days That are closed
            let days = fillInCalendar(monthSelected.Number, monthSelected.NumOfDays, monthSelected.WeekDayNameOfFirstDay)
            displayDayClosed(days)

            //Once the daysContainer is filled with the daysCircles, now we can access the days
            dealWithDays(days)
        })
    })
    
}

const clickMonth = (months , target) => {
        // Styles the month selected and ones that aren't accordingly
        months.filter(month => month !== target).map(month => month.style.background = "aliceblue")
        target.style.background = "yellow"

        // Get month Selected Info and returns info
        let monthSelected = getMonthSelected(target.dataset.month)
        return monthSelected
}


const dealWithDays = days => {
    days.map(day => {
        $(day).click(e => {
            // Get day Selected Info, adds it to appointment details
            let daySelected = clickDay(days, e.target)
            appointment_Details["DayName"] = daySelected.day
            appointment_Details["DayDate"] = daySelected.date
            
            // Deal with times now
            dealWithTimes()
        })
    })
}

const clickDay = (days, target) => {
    // Styles the month selected and ones that aren't accordingly
    days.filter(day => day !== target && day.dataset.day !== "Sunday").map(day => $(day).css('background', 'blue'))
    target.style.background = "green"

    // Get day Selected Info and returns info
    let daySelected = getDaySelected(target)
    return daySelected
}

const dealWithTimes = () => {
    /**
     * Get time now, round it to the nearest 10 make timeslots and return the timeslot Containers
     */
    let time_now = new Date(),
        newRoundedTime = roundMinutes(time_now),
        timeSlots = makeTimeslots(newRoundedTime, 10, []),
        timeSlotContainers = displayTimeslots(timeSlots);
    timeSlotContainers.map(timeSlot => {
        $(timeSlot).click(e => {
             // Get time Selected Info, adds it to appointment details
            let timeSelected = clickTime(timeSlotContainers, e.target)
            appointment_Details["Time"] = timeSelected

            // Deal with appointment details 
            dealWithAppointmentDetails()
        })
    })
}


const clickTime = (timeSlotContainers , target) => {
    // Styles the time selected and ones that aren't accordingly
    timeSlotContainers.filter(timeSlot => timeSlot !== target).map(timeSlot => timeSlot.style.background = "aliceblue")
    target.style.background = "yellow"

    // Get time Selected Info and returns info
    let timeSelected = target.innerHTML
    return timeSelected
}

const dealWithAppointmentDetails = () => {
    console.log(appointment_Details)
}

const getMonthSelected = monthNo => {
    let monthSelected = {
        "LastDayNum": getLastDayNum(new Date().getFullYear(), Number(monthNo)),
        "WeekDayNumOfFirstDay": getWeekDayNum(new Date().getFullYear(), Number(monthNo), 1),
        "WeekDayNameOfFirstDay": nameOfDay(getWeekDayNum(new Date().getFullYear(), Number(monthNo), 1)),
        "NumOfDays": getNumOfDays(1, getLastDayNum(new Date().getFullYear(), Number(monthNo))),
        "Name": nameOfMonth(Number(monthNo)),
        "Number": monthNo
    }
    return monthSelected
}

const getDaySelected = target => {
    let daySelected = {
        "date": target.innerHTML,
        "day": target.dataset.day
    }
    return daySelected
}

const makeTimeslots = (newRoundedTime, end , timeSlots) => {
    let completed = false;
    // if(Number(newRoundedTime.split(":")[0]) > 18) return
    timeSlots.push(newRoundedTime)
    if(!completed){
        if (timeSlots.includes("21:0")) {
            completed = true
            return [...timeSlots]
        } 
        if (Number(newRoundedTime.split(":")[1]) + 10 >= 60) {
            const hours = Number(newRoundedTime.split(":")[0]) + 1,
            minutes = "00";
            if (Array.isArray(makeTimeslots(`${hours}:${Number(minutes)}`, end, timeSlots))) return timeSlots
            timeSlots.push(makeTimeslots(`${hours}:${Number(minutes)}`, end, timeSlots))
        } else {
            if (Array.isArray(makeTimeslots(`${newRoundedTime.split(":")[0]}:${Number(newRoundedTime.split(":")[1]) + 10}`, end, timeSlots))) return timeSlots
            timeSlots.push(makeTimeslots(`${newRoundedTime.split(":")[0]}:${Number(newRoundedTime.split(":")[1]) + 10}`, end, timeSlots))
        } 
    }
    return timeSlots
}



const displayTimeslots = timeSlots => {
    let timeSlotContainer = document.querySelector('.time_slot_container')
    timeSlots = timeSlots.map(timeSlot => 
        `<div class="timeslot">${timeSlot}</div>`
    ).join("")
    timeSlotContainer.innerHTML = timeSlots
    let timeSlotContainers = getTimeslotContainers()
    return timeSlotContainers
}

const getTimeslotContainers = () => {
    return timeslotPills = [...document.querySelectorAll('.timeslot')]
}


const displayDayClosed = days => {
    days.filter(day => day.dataset.day === "Sunday").map(day => {
        day.style.background = "orange" 
        day.classList.add('disabled')
    })
}

const fillInCalendar = (monthSelectedNum, numberOfDays, firstDay) => {
    let calendarContainer = document.querySelector('.calendar_container'),
        daysOfWeek = `
            <h3 class= "dayOfWeek">Monday</h3>
            <h3 class= "dayOfWeek">Tuesday</h3>
            <h3 class= "dayOfWeek">Wednesday</h3>
            <h3 class= "dayOfWeek">Thursday</h3>
            <h3 class= "dayOfWeek">Friday</h3>
            <h3 class= "dayOfWeek">Saturday</h3>
            <h3 class= "dayOfWeek">Sunday</h3>
        `,
        margin = ``;
    if(firstDay !== "Monday")
        margin = `<div class="margin"></div>`
    numberOfDays = numberOfDays.map(day => {
        let dayOfWeek = getWeekDayNum(new Date().getFullYear(), monthSelectedNum, day)
        dayOfWeek = nameOfDay(dayOfWeek);
        return `<div class="day" data-day= "${dayOfWeek}">${day}</div>`
    }).join("")
    calendarContainer.innerHTML= daysOfWeek + margin + numberOfDays
    getSpan(firstDay)
    let dayContainers = getDayContainers()
    return dayContainers
}


// Helper Functions
const getLastDayNum = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
}

const getWeekDayNum = (year, month, day) => {
    return new Date(year, month, day).getDay()
}

const getDayContainers = () => {
    return days = [...document.querySelectorAll('.day')];
}

const nameOfMonth = month => {
    const months = ["January" , "February" , "March" , "April" ,"May", "June", "July" , "August", "Spetember", "October","November" , "December"]
    return months[month]
}

const nameOfDay = firstDay => {
    const days = {
        0: "Sunday",
        1: "Monday",
        2: "Tuesday",
        3: "Wednesday",
        4: "Thursday",
        5: "Friday",
        6: "Saturday"
    }
    return days[firstDay]
}


const getNumOfDays = (startDay, endDay) => {
    if (startDay === endDay) return [startDay];
    return [startDay, ...getNumOfDays(startDay + 1, endDay)];
}

const getSpan = firstDay => {
    const margin = document.querySelector('.margin'),
        days = {
            "Tuesday": "span 1",
            "Wednesday": "span 2",
            "Thursday": "span 3",
            "Friday": "span 4",
            "Saturday": "span 5",
            "Sunday": "span 6"
        };
    $(margin).css('grid-column', days[firstDay])
}

const roundMinutes = (time_now) => {
    const roundDownTo = roundTo => x => Math.floor(x / roundTo) * roundTo;
    const roundUpTo = roundTo => x => Math.ceil(x / roundTo) * roundTo;
    const roundUpTo5Minutes = roundUpTo(1000 * 60 * 10);

    const ms = roundUpTo5Minutes(time_now)
    return `${new Date(ms).getHours()}:${new Date(ms).getMinutes()}`
}

// Initialization Methods

$(document).ready(() => {
    switch (window.location.pathname) {
        case `${url}index.html`:
            dealWithMonths()
            
    }
})
