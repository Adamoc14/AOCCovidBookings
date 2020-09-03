// Variable Declarations and Function Definitions
const url = "/Client/Views/"

const homeInit = () => {
    const months = [...document.querySelectorAll('.month')];
    clickMonth(months)
}

const clickMonth = months => {
    months.map(month => {
        $(month).click(e => {
            months.filter(month => month !== e.target).map(month => month.style.background = "aliceblue")
            e.target.style.background = "yellow"
            let monthSelected = getMonthSelected(e.target.dataset.month)
            fillInCalendar(monthSelected.MonthSelectedNo,monthSelected.NumOfDays, monthSelected.WeekDayNameOfFirstDay)
            let days = getDays()
            displayDayClosed(days)
            getDaySelected(days, monthSelected)
        })
    })
}

const getMonthSelected = monthNo => {
    let monthSelected = {
        "LastDayNum": getLastDayNum(new Date().getFullYear(), Number(monthNo)),
        "WeekDayNumOfFirstDay": getWeekDayNum(new Date().getFullYear(), Number(monthNo), 1),
        "WeekDayNameOfFirstDay": nameOfDay(getWeekDayNum(new Date().getFullYear(), Number(monthNo), 1)),
        "NumOfDays": getNumOfDays(1, getLastDayNum(new Date().getFullYear(), Number(monthNo))),
        "MonthSelectedNo": monthNo
    }
    return monthSelected
}




const makeTimeslots = (newRoundedTime, end , timeSlots) => {
    let completed = false;
    timeSlots.push(newRoundedTime)
    if(!completed){
        if (timeSlots.includes("18:0")) {
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

const getDaySelected = (days, monthSelected) => {
    days.map(day => {
        $(day).click(e => {
            days.filter(day => day !== e.target && day.dataset.day !== "Sunday" ).map(day => $(day).css('background','blue'))
            e.target.style.background = "green"
            let time_now = new Date(),
            newRoundedTime = roundMinutes(time_now);
            let timeSlots = makeTimeslots(newRoundedTime , 10 , [])
            displayTimeslots(timeSlots)
            getTimeslotContainers()
        })
    })
}

const displayTimeslots = timeSlots => {
    let timeSlotContainer = document.querySelector('.time_slot_container')
    timeSlots = timeSlots.map(timeSlot => 
        `<div class="timeslot">${timeSlot}</div>`
    ).join("")
    timeSlotContainer.innerHTML = timeSlots
}

const getTimeslotContainers = () => {
    const timeslotPills = [...document.querySelectorAll('.timeslot')]
    timeslotPills.map(timeSlot => {
        $(timeSlot).click(e => {
            timeslotPills.filter(timeSlot => timeSlot!== e.target).map(timeSlot => timeSlot.style.background = "aliceblue")
            e.target.style.background = "yellow"
        })
    })
}





const displayDayClosed = days => {
    days.filter(day => day.dataset.day === "Sunday").map(day => {
        day.style.background = "orange" 
        day.classList.add('disabled')
    })
}

const fillInCalendar = (monthSelected, numberOfDays, firstDay) => {
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
        let dayOfWeek = getWeekDayNum(new Date().getFullYear(), monthSelected, day)
        dayOfWeek = nameOfDay(dayOfWeek);
        return `<div class="day" data-day= "${dayOfWeek}">${day}</div>`
    }).join("")
    calendarContainer.innerHTML= daysOfWeek + margin + numberOfDays
    getSpan(firstDay)
}


// Helper Functions
const getLastDayNum = (year, month) => {
    return new Date(year, month + 1, 0).getDate()
}

const getWeekDayNum = (year, month, day) => {
    return new Date(year, month, day).getDay()
}

const getDays = () => {
    return days = [...document.querySelectorAll('.day')];
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
            homeInit()
    }
})
