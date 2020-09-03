const url = "/Client/Views/"
    

const getNoOfDaysInMonth = (year ,  month) => {
    return  new Date(year , month + 1 , 0).getDate()
}

const getDay = (year , month, day) => {
    return new Date(year, month , day).getDay()
}

const homeInit = () => {
    const months = [...document.querySelectorAll('.month')];
    fillDays(months)
}

const roundMinutes = (time_now) => {
    const roundDownTo = roundTo => x => Math.floor(x / roundTo) * roundTo;
    const roundUpTo = roundTo => x => Math.ceil(x / roundTo) * roundTo;
    const roundUpTo5Minutes = roundUpTo(1000 * 60 * 10);

    const ms = roundUpTo5Minutes(time_now)
    return `${new Date(ms).getHours()}:${new Date(ms).getMinutes()}`
}

const makeTimeslots = (newRoundedTime, end , timeSlots) => {
    let completed = false;
    timeSlots.push(newRoundedTime)
    if(!completed){
        if (timeSlots.length === end) {
            completed = true
            return [...timeSlots]
        } 
        if (Number(newRoundedTime.split(":")[1]) + 10 === 60) {
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

const getTimeslots = (days, monthSelected) => {
    days.map(day => {
        $(day).click((e)=> {
            days.filter(day => day !== e.target && day.dataset.day !== "Sunday" ).map(day => day.style.background="blue")
            e.target.style.background = "green"
            let time_now = new Date(),
            newRoundedTime = roundMinutes(time_now);
            let timeSlots = makeTimeslots(newRoundedTime , 10 , [])
            document.querySelector('.time_slot_container').innerHTML = timeSlots
        })
    })
}

const fillDays = months => {
    months.map(month => {
        $(month).click(e => {
            months.filter(month => month !== e.target).map(month => month.style.background = "aliceblue")
            e.target.style.background = "yellow"
            let numberOfDays = getNoOfDaysInMonth(new Date().getFullYear(), Number(e.target.dataset.month)),
                firstDay = getDay(new Date().getFullYear(), Number(e.target.dataset.month) , 1),
                monthSelected = Number(e.target.dataset.month);
            numberOfDays = range(1, numberOfDays)
            firstDay = nameOfDay(firstDay)
            fillInCircleDays(numberOfDays, firstDay, monthSelected)
            let days = getDays()
            displayDayClosed(days)
            getTimeslots(days, monthSelected)
        })
    })
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


const range = (start, end) => {
    if (start === end) return [start];
    return [start, ...range(start + 1, end)];
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

const displayDayClosed = days => {
    days.filter(day => day.dataset.day === "Sunday").map(day => {
        day.style.background = "orange" 
        day.classList.add('disabled')
    })
}

const fillInCircleDays = (numberOfDays, firstDay, monthSelected) => {
    let circleContainer = document.querySelector('.calendar_container'),
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
        let dayOfWeek = getDay(new Date().getFullYear(), monthSelected, day)
        dayOfWeek = nameOfDay(dayOfWeek);
        return `<div class="day" data-day= "${dayOfWeek}">${day}</div>`
    }).join("")
    circleContainer.innerHTML= daysOfWeek + margin + numberOfDays
    getSpan(firstDay)
}

$(document).ready(() => {
    switch (window.location.pathname) {
        case `${url}index.html`:
            homeInit()
    }
})
