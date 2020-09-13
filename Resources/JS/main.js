// Global Variable Declarations and Function Definitions
const appointment_Details = {},
    url = "https://whmc-server.herokuapp.com/";
let appointments_Saved = [];

const getData = async() => {
    let res = await axios.get(`${url}api/v1/appointments`),
        { data } = res
    appointments_Saved = data
}

const userViewInit = () => {
    displayUserView()
}

const displayUserView = async() => {
    const apptContainer = document.querySelector('.appointment_display_container_inner'),
    id = new URLSearchParams(new URL(window.location.href).search).get("id"),
    {data: userDetails} = await axios.get(`${url}api/v1/appointments/${id}`),
    appointmentsData = 
    userDetails.Appointments.map(appt =>  
        `<div class="appointment_container">
            <div class="first_container">
                <div class="date_square"></div>
                <div class="user_details_container">
                    <div class="name_container">
                        <h2>Name: ${userDetails.firstName} ${userDetails.Surname}</h2>
                    </div>
                    <div class="dob_container">
                        <h2>DOB: ${userDetails.DOB}</h2>
                    </div>
                    <div class="pps_container">
                        <h2>PPS: ${userDetails.PPS_Number}</h2>
                    </div>
                </div>
            </div>
            <div class="second_container">
                <div class="appointment_details">
                    <div class="date_container">
                        <h2>Date: ${appt.DayName} ${appt.DayDate} ${appt.Month}</h2>
                    </div>
                    <div class="time_container">
                        <h2>Time: ${appt.Time}</h2>
                    </div>
                </div>
                <div class="buttons_container">
                    <a class="update_btn action_btn" href="edit.html?id=${appt._id}&userId=${userDetails._id}"> Edit</a >
                    <div class="delete_btn action_btn" data-appt="${appt._id}">Delete</div>
                </div>
            </div>
        </div>
        `
    )
    apptContainer.insertAdjacentHTML('beforeend',appointmentsData)
    $(document.querySelector('.delete_btn')).click(e => {
        e.preventDefault();
        deleteAppointment(e.currentTarget.dataset.appt , userDetails)
    })
    
}

const displayPastMonths = () => {
    const monthToday = new Date().getMonth()
    const months = [...document.querySelectorAll('.month')]
    months.filter(month => month.dataset.month < monthToday).map(month => month.classList.add('disabled'))
    document.querySelector(`.month[data-month="${monthToday}"]`).style.background = "green"
    displayPastDays(months , document.querySelector(`.month[data-month="${monthToday}"]`))
}

const displayPastDays = (months,startMonth) => {
    // Get month Selected Info , adds it to appointment details
    let monthSelected = clickMonth(months, startMonth);
    appointment_Details["Month"] = monthSelected.Name

    // Display Calendar and Days That are closed
    let days = fillInCalendar(monthSelected.Number, monthSelected.NumOfDays, monthSelected.WeekDayNameOfFirstDay, monthSelected.Name),
        dayStarted = new Date().getDate();
    displayDaysIrrelevant(days , dayStarted)
    dealWithDays(days)
}


const displayPPSInput = () =>{
    $(document.querySelector('.PPS_Number')).get(0).onclick = () => {
        document.querySelector('.pps_number_input_container').classList.add("display")
    }
    $(document.querySelector('.Medical_Card')).get(0).onclick = () => {
        document.querySelector('.pps_number_input_container').classList.remove("display")
    }
    $(document.querySelector('.Drive_Through')).get(0).onclick = () => {
        document.querySelector('.car_reg_container').classList.add("display")
    }
    $(document.querySelector('.Surgery')).get(0).onclick = () => {
        document.querySelector('.car_reg_container').classList.remove("display")
    }

    // const radio_btns = [...document.getElementsByName('card_decision')]
    // radio_btns.map(radio_btn => {
    //     $(radio_btn).click(e => {
    //         if (e.currentTarget.classList.contains("PPS_Number")) 
    //             document.querySelector('.pps_number_input_container').classList.toggle("display")
    //         else 
    //             document.querySelector('.pps_number_input_container').classList.remove("display")
    //     })
    // }) 
}

const dealWithFormUpdate = async() => {
    const formUpdate = document.querySelector('.form_Update'),
        id = new URLSearchParams(new URL(window.location.href).search).get("id"),
        {data: userDetails} = await axios.get(`${url}api/v1/appointments/${id}`);
    $(formUpdate).submit(e => {
        e.preventDefault()
        appointment_Details["userId"] = userDetails._id
        updateAppointment(id)
    })
}



const dealWithFormSubmit = () => {
    const form = document.querySelector('form')
    $(form).submit(e => {
        e.preventDefault()

        /**
         * Because of await making the call stack perform same thing again
         * This was making it send two requests and insert two records into the DB
         * This is a fix for this, 
         * Look for info or something that should have a value already from the first time
         */ 
        if(appointment_Details["firstName"] !== undefined) return

        // Getting the form Data and filling it to appointment_Details
        let formData = getFormData(form)
        appointment_Details["firstName"] = formData.get('firstName')
        appointment_Details["Surname"] = formData.get('Surname')
        appointment_Details["Mobile"] = formData.get('Mobile')
        appointment_Details["DOB"] = formData.get('DOB')
        whichCard(formData.get('card_decision') , formData)
        whichDestination(formData.get('card_decision') , formData)

        // Calls the method to perform the async function to post my data 
        makeAppointment()
    })
} 

const updateAppointment = async (id) => {
    try {
        const appointments = await axios.put(`${url}api/v1/appointments/${id}`, appointment_Details)
        window.location = `userView.html?id=${appointments.data._id}`
    } catch (error) {
        console.log(error)
    }
}

const deleteAppointment = async(id , userDetails) => {
    try {
        const appointments = await axios.delete(`${url}api/v1/appointments/${id}?userId=${userDetails._id}`)
        window.location = `userView.html?id=${ appointments.data._id}`
    } catch (error) {
        console.log(error)
    }
}

const makeAppointment = async() => {
    try {
        let appointment = await makeRequest()
        displayAppointmentPopup(appointment)
        // window.location.href = 'userView.html'
        return appointment
    } catch (error) {
        console.log(error)
    }    
}

const displayAppointmentPopup = appointment => {
    let { data: appointment_made_details } = appointment,
    modal = fillinModalDetails(appointment_made_details)
    document.querySelector('.appointment_made_modal').innerHTML = modal;
    document.querySelector('.appointment_made_modal').style.display = "block"
    // userDetails = appointment_made_details
}

const fillinModalDetails = appointment_made_details => {
    return `<div class="appointment_made_modal_content">
                <h2>Hi ${appointment_made_details.firstName} ${appointment_made_details.Surname},</h2>
                <h4>You have successfully made an appointment for</h4>
                <div class="date_time_container">
                    <h3><strong>Date :</strong> ${appointment_made_details.Appointments[appointment_made_details.Appointments.length - 1].DayName} ${appointment_made_details.Appointments[appointment_made_details.Appointments.length - 1].DayDate} ${appointment_made_details.Appointments[appointment_made_details.Appointments.length - 1].Month}</h3>
                    <h3><strong>Time :</strong> ${appointment_made_details.Appointments[appointment_made_details.Appointments.length - 1].Time}</h3>
                </div>
                <a href="userView.html?id=${appointment_made_details._id}" class="see_all_appointments_btn">See All Appointments</a>
            </div>`
}

const makeRequest = () => {
    return axios.post(`${url}api/v1/appointments`, appointment_Details)
}

const whichCard = (value , formData) => {
    if(value === "Medical_Card"){
        appointment_Details["Medical_Card"] = true
        appointment_Details["PPS_Number"] = false
    } else if (value === "PPS_Number"){
        appointment_Details["Medical_Card"] = false
        appointment_Details["PPS_Number"] = formData.get('PPS_Number_Input')
    }
}
const whichDestination = (value , formData) => {
    if(value === "Surgery"){
        appointment_Details["Surgery"] = true
        appointment_Details["Car_Reg"] = false
    } else if (value === "PPS_Number"){
        appointment_Details["Surgery"] = false
        appointment_Details["Car_Reg"] = formData.get('Car_Reg_Input')
    }
}

const getFormData = form => {
    let formData = new FormData(form)
    return formData
}

const dealWithMonths = () => {
    const months = [...document.querySelectorAll('.month')];
    months.map(month => {
        $(month).click(e => {
            // Get month Selected Info , adds it to appointment details
            let monthSelected = clickMonth(months , e.target);
            appointment_Details["Month"] = monthSelected.Name

            // Display Calendar and Days That are closed
            let days = fillInCalendar(monthSelected.Number, monthSelected.NumOfDays, monthSelected.WeekDayNameOfFirstDay, monthSelected.Name )
            if (monthSelected.Name === nameOfMonth(new Date().getMonth())){
                displayDaysIrrelevant(days, new Date().getDate())
            } else {
                displayDaysIrrelevant(days)
            }

            //Once the daysContainer is filled with the daysCircles, now we can access the days
            dealWithDays(days)
        })
    })
    
}

const clickMonth = (months , target) => {
        // Styles the month selected and ones that aren't accordingly
        months.filter(month => month !== target).map(month => {
            month.style.background = "aliceblue"
            month.style.color = "black"
        })
        target.style.background = "green"
        target.style.color = "#fff"

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
    days.filter(day => day !== target && day.dataset.day !== "Sunday").map(day => {
        $(day).css('background', 'aliceblue')
        $(day).css('color', 'black')
    })
    target.style.background = "green"
    target.style.color = "white"

    // Get day Selected Info and returns info
    let daySelected = getDaySelected(target)
    return daySelected
}

const dealWithTimes = () => {
    /**
     * Get time now, round it to the nearest 10 make timeslots and return the timeslot Containers
     */
    // let time_now = new Date(),
        // newRoundedTime = roundMinutes(time_now),
    let timeSlots = makeTimeslots(moment().startOf('day').add(9,'h'), [] , 10),
    // let timeSlots = makeTimeslots(moment().startOf('day'), [] , 10),
        // timeSlotsOnTheFly = makeTimeslotsOnFly(newRoundedTime, 10, []),
        timeSlotContainers = displayTimeslots(timeSlots);
    timeSlotContainers.map(timeSlot => {
        $(timeSlot).click(e => {
             // Get time Selected Info, adds it to appointment details
            let timeSelected = clickTime(timeSlotContainers, e.target)
            appointment_Details["Time"] = timeSelected
        })
    })
}


const clickTime = (timeSlotContainers , target) => {
    // Styles the time selected and ones that aren't accordingly
    timeSlotContainers.filter(timeSlot => timeSlot !== target).map(timeSlot => {
        timeSlot.style.background = "aliceblue"
        timeSlot.style.color = "black"
    })
    target.style.background = "green"
    target.style.color = "white"

    // Get time Selected Info and returns info
    let timeSelected = target.innerHTML
    return timeSelected
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

const makeTimeslotsOnFly = (newRoundedTime, end , timeSlots) => {
    let completed = false;
    // if(Number(newRoundedTime.split(":")[0]) > 18) return
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

const makeTimeslots = (startTime, timeSlots , interval) => {
    let completed = false
    timeSlots.push(`${startTime.hours()}:${startTime.minutes()}`)
    if(!completed){
        if(startTime.hours() === 18 && startTime.minutes() === 0){
            completed = true 
            return [...timeSlots]
        } else {
            if (Array.isArray(makeTimeslots(startTime.add(interval, 'm'), timeSlots, interval))) return timeSlots
            timeSlots.push(makeTimeslots(startTime.add(interval, 'm'), timeSlots, interval ))
        }
    }
}



const displayTimeslots = timeSlots => {
    let timeSlotContainer = document.querySelector('.time_slot_container')
    timeSlots = timeSlots.map(timeSlot => 
        `<div class="timeslot" data-time="${timeSlot}">${timeSlot}</div>`
    ).join("")
    timeSlotContainer.innerHTML = timeSlots
    let timeSlotContainers = getTimeslotContainers()
    checkAgainstAppointments()
    checkTime(new Date().getHours() , timeSlotContainers)
    return timeSlotContainers
}

const checkAgainstAppointments = () => {
    appointments_Saved = appointments_Saved.filter(appointment => appointment.Capacity.length === 2)
    appointments_Saved
            .filter(appointment_s => appointment_s.Month === appointment_Details["Month"] && appointment_s.DayDate === appointment_Details["DayDate"] && appointment_s.DayName === appointment_Details["DayName"])
            .map(appointment_s => {
                document.querySelector(`.timeslot[data-time="${appointment_s.Time}"]`).classList.add("disabled")
                document.querySelector(`.timeslot[data-time="${appointment_s.Time}"]`).style.background = "red"
                document.querySelector(`.timeslot[data-time="${appointment_s.Time}"]`).style.color = "white"
            })
}

const checkTime = (timeNow , timeSlotContainers) => {
    if(new Date().getDate()  === Number(appointment_Details["DayDate"])) {
        timeSlotContainers.filter(timeslotContainer => timeslotContainer.innerHTML.split(":")[0] < timeNow).map(timeslotContainer => {
            timeslotContainer.classList.add('disabled')
            timeslotContainer.style.background = "orange"
            timeslotContainer.style.color = "black";
        })
    }
}

const getTimeslotContainers = () => {
    return timeslotPills = [...document.querySelectorAll('.timeslot')]
}


const displayDaysIrrelevant = (days , dayStarted) => {
    if(dayStarted !== null) {
        days.filter(day => day.innerHTML < dayStarted).map(day => day.classList.add('disabled'))
    }
    days.filter(day => day.dataset.day === "Sunday").map(day => {
        day.style.background = "orange" 
        day.classList.add('disabled')
    })
}

const fillInCalendar = (monthSelectedNum, numberOfDays, firstDay, monthSelectedName) => {
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
        return `<div class="day" data-day= "${dayOfWeek}" data-month="${monthSelectedName}">${day}</div>`
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
    const months = ["January" , "February" , "March" , "April" ,"May", "June", "July" , "August", "September", "October","November" , "December"]
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
    // const roundDownTo = roundTo => x => Math.floor(x / roundTo) * roundTo;
    const roundUpTo = roundTo => x => Math.ceil(x / roundTo) * roundTo;
    const roundUpTo5Minutes = roundUpTo(1000 * 60 * 10);

    const ms = roundUpTo5Minutes(time_now)
    return `${new Date(ms).getHours()}:${new Date(ms).getMinutes()}`
}

// Initialization Methods

$(document).ready(() => {
    switch (true) {
        case window.location.pathname === "/" || window.location.pathname === "/Client/":
            getData()
            displayPastMonths()
            displayPPSInput()
            dealWithFormSubmit()
            dealWithMonths()  
        case window.location.pathname.includes("index"):
            getData()
            displayPastMonths()
            displayPPSInput()
            dealWithFormSubmit()
            dealWithMonths()   
        case window.location.pathname.includes("userview"):
            userViewInit()
        case window.location.pathname.includes("edit"):
            displayPastMonths()
            dealWithFormUpdate()
            dealWithMonths()
    }
})
