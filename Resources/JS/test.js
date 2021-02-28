// These Classes take care of my network requests for different models in my web application
class AppointmentManager {
    createAppointment = async appointment_Details => {
        try {
            const { data: Users_Appointments } = await axios.post(`${local_url}api/v1/appointments`, appointment_Details)
            window.location = `userView.html?id=${Users_Appointments._id}`
            return appointment
        } catch (error) {
            console.log(error)
        }
    }
    readAllAppointments = async () => {
        let { data: appointments } = await axios.get(`${heroku_url}api/v1/appointments/`)
        return appointments
    }
    readSingleAppointmentById = async apptId => {
        let appt = await axios.get(`${heroku_url}api/v1/appointments/appt/${apptId}`)
        return appt
    }
    updateAppointment = async (appt_id, appointment_Details) => {
        try {
            const { data: Users_Appointments } = await axios.put(`${heroku_url}api/v1/appointments/${appt_id}`, appointment_Details)
            window.location = `userView.html?id=${Users_Appointments._id}`
        } catch (error) {
            console.log(error)
        }
    }
    deleteAppointment = async (id, userID, place) => {
        try {
            const { data: Users_Appointments } = await axios.delete(`${heroku_url}api/v1/appointments/${id}?userId=${userID}`)
            if (place === "Client") window.location = `userView.html?id=${Users_Appointments._id}`
            else window.location = `AdminHome.html`
        } catch (error) {
            console.log(error)
        }
    }
}

class CovidTermsManager {
    readAllCovidTerms = async () => {
        let { data: covid_terms } = await axios.get(`${heroku_url}api/v1/covid_terms`)
        return covid_terms
    }
    updateCovidTerms = async (date_picker_object_value, covid_term) => {
        try {
            await axios.put(`${heroku_url}api/v1/covid_terms/${covid_term._id}`, { "Min_Age": covid_term.Min_Age, "Month": date_picker_object_value.MonthName, "Date": date_picker_object_value.Date })
        } catch (error) {
            console.log(error);
        }
    }
}

// TODO: Need to set up User Api Endpoints 
// EDIT: Added in these routes - 28/02/2021 12:50
class UserManager {
    readAllUsers = async() => {
        let{data: users} = await axios.get(`${heroku_url}api/v1/users`)
        return users
    }
    readSingleUserById = async userId => {
        let user = await axios.get(`${heroku_url}api/v1/users/${userId}`)
        return user
    }
    readMultipleUsersByIds = async userIds => {
        let users = await axios.get(`${heroku_url}api/v1/users/details/${userIds}`)
        return users;
    }

}

class ClinicManager {
    createClinicSlot = async (newClinicSlot) => {
        try {
            await axios.post(`${heroku_url}api/v1/clinics`, newClinicSlot)
            window.location = "AdminClinicHome.html"
        } catch (error) {
            console.log(error)
        }
    }
    readAllClinicSlots = async () => {
        let { data: clinicSlots } = await axios.get(`${heroku_url}api/v1/clinics/`)
        return clinicSlots
    }
    readClinicSlotSingle = async (id) => {
        let res = await axios.get(`${heroku_url}api/v1/clinics/${id}`),
            { data: clinicDataSingle } = res
        return clinicDataSingle
    }
    updateClinicSlot = async (clinic_updated_data, id) => {
        try {
            await axios.put(`${heroku_url}api/v1/clinics/${id}`, clinic_updated_data)
            window.location = "AdminClinicHome.html"
        } catch (error) {
            console.log(error)
        }
    }
    deleteClinicSlot = async (id) => {
        try {
            await axios.delete(`${heroku_url}api/v1/clinics/${id}`)
            window.location = "AdminClinicHome.html"
        } catch (error) {
            console.log(error)
        }
    }
}

// Helper Methods and Classes

class UIHelperMethodManager {
    getSpanAmountByFirstDayOfMonth = firstDay => {
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
    makeTimeslots = (startTime, timeSlots, interval) => {
        let completed = false
        timeSlots.push(`${startTime.hours()}:${startTime.minutes()}`)
        if (!completed) {
            if (startTime.hours() === 19 && startTime.minutes() === 30) {
                completed = true
                return [...timeSlots]
            } else {
                if (Array.isArray(this.makeTimeslots(startTime.add(interval, 'm'), timeSlots, interval))) return timeSlots
                timeSlots.push(this.makeTimeslots(startTime.add(interval, 'm'), timeSlots, interval))
            }
        }
    }

    checkCapacityForTableFormattingProperly = appointments => {
        appointments.map(appointment => {
            if(appointment.Capacity.length >= 2){
                $('.span').css('grid-template-rows', `repeat(${appointment.Capacity.length},1fr)`);
                [...document.querySelectorAll('.time')]
                .map(time => $(time).css('grid-row', `span ${time.dataset.capacity}`))
            }
        })      
    }

    printPage = print_buttons => {
        print_buttons.map(print_button => 
            $(print_button).click(() => {
                window.print()
            }
        )) 
    }

    logoutAdmin = () => {
        const logout_btn = document.querySelector('.logout')
        $(logout_btn).click(()=> {
            sessionStorage.removeItem("AdminLoggedIn");
            window.location = "AdminLogin.html"
        })
    }

    makeTableRowFromUserDetailsAdminHomePage = (userDetails, appID) => {
        return userDetails.map(user => 
        `   <h4 class="container_sm">${user.firstName}</h4>
            <h4 class="container_sm">${user.Surname}</h4> 
            <h4 class="container_sm">${user.DOB}</h4>
            <h4 class="container_sm">${user.PPS_Number}</h4>
            <h4 class="delete" data-userID="${user._id}" data-apptID="${appID}">X</h4>
        `).join("")
    }

    dealWithAdminTabsChange = adminTab => {
        $(`.options_container h1:contains("${adminTab}")`)[0].style.background = "#fff"
    }

    getDayContainersFromCalendar = () => {
        return [...document.querySelectorAll('.day')];
    }
    getMonthContainers = () => {
        return [...document.querySelectorAll('.month')];
    }
    getTimeSlotContainers = () => {
        return [...document.querySelectorAll('.timeslot')]
    }
    getPrintBtns = () => {
        return [...document.querySelectorAll('.print_btn')]
    }
}

class GeneralHelperMethodManager {

    // Can be used in any project
    static getQueryParamsFromURL = () => {
        return URLSearchParams(window.location.search)
    }
    static getFormDataFromForm = form => {
        let formData = new FormData(form)
        return formData
    }
    static escapeSlashAndQuotes = csvValue => {
        return csvValue.replace(/"/g, '\\"')
    }

    // Easily adopted to any project 
    static createMonthObjectFromMonthSelected = monthNo => {
        return {
            "LastDayNum": GeneralHelperMethodManager.getMonthsLastDayNumByYear(new Date().getFullYear(), Number(monthNo)),
            "WeekDayNumOfFirstDay": GeneralHelperMethodManager.getWeekDayNumFromDate(new Date().getFullYear(), Number(monthNo), 1),
            "WeekDayNameOfFirstDay": GeneralHelperMethodManager.getNameOfFirstDayOfTheMonth(GeneralHelperMethodManager.getWeekDayNumFromDate(new Date().getFullYear(), Number(monthNo), 1)),
            "NumOfDays": GeneralHelperMethodManager.getNumOfDaysInTheMonth(1, GeneralHelperMethodManager.getMonthsLastDayNumByYear(new Date().getFullYear(), Number(monthNo))),
            "Name": GeneralHelperMethodManager.getNameOfTheMonthByNum(Number(monthNo)),
            "Number": monthNo
        }
    }
    static createDayObjectFromDaySelected = target => {
        return {
            "date": target.innerHTML,
            "day": target.dataset.day
        }
    }

    static createDateObjectFromDatePicker = () => {
        return {
            Year: document.querySelector('#date_picker_input')?.value?.split("-")[0],
            Month: document.querySelector('#date_picker_input')?.value?.split("-")[1],
            MonthName: GeneralHelperMethodManager.getNameOfTheMonthByNum(parseInt(document.querySelector('#date_picker_input')?.value?.split("-")[1]) - 1),
            Date: document.querySelector('#date_picker_input')?.value?.split("-")[2]
        }
    }

    static filterAppointmentsByDatePickerDetails = (appointments , datePickerObjectDetails) => {
        return appointments.filter(appointment => parseInt(appointment.DayDate) === parseInt(datePickerObjectDetails.Date) && appointment.Month === datePickerObjectDetails.MonthName)
    }

    static retrieveRunningAppointmentsTotal = filtered_appointments_from_date_picker_values => filtered_appointments_from_date_picker_values?.map(appt => appt.Capacity.length).reduce((a,b) => a+b , 0)

    static retrieveOverallAppointmentsTotal = appointments => appointments.length

    static sortAppointmentsBeingDisplayedByTime = filtered_appointments_from_date_picker_values => filtered_appointments_from_date_picker_values?.sort((now, next) => now.Time.split(":")[0] - next.Time.split(":")[0] || now.Time.split(":")[1] - next.Time.split(":")[1])

    static trimAndVerifySearchValue = searchValue => searchValue !== null && searchValue !== undefined ? searchValue.trim() && searchValue : null  
    
    static checkAppointmentAndUserRecordsInTableAgainst = (appointments, searchValue) => {
        if(searchValue.length < 1) return []
        else {
            let matches = appointments.filter(appointment => appointment.Time.includes(searchValue) || GeneralHelperMethodManager.loopAndCheckForMatchWithUserRecordsFromAppointmentsInDB(appointment.Capacity , searchValue))
            return matches.length  === 0 ? [""] : matches
        }
    }
    
    static loopAndCheckForMatchWithUserRecordsFromAppointmentsInDB = (users , searchValue) => {
        let matches = []
        let keys = ["_id", "firstName", "Surname", "DOB", "PPS_Number"]
        for (const key of keys) {
            users = users.filter(user => user[key] !== undefined || user[key] !== null)
        }
        users.map(user => 
            matches.push(
                user?._id?.includes(searchValue), 
                user?.firstName?.includes(searchValue), 
                user?.Surname?.includes(searchValue) , 
                user?.firstName + user?.Surname === searchValue, 
                user?.DOB?.includes(searchValue), 
                user?.PPS_Number?.includes(searchValue)
            )
        )
        return matches.includes(true)               
    }

    static resettingAppointmentsDataTableBackToOnlyHeadings = () => {
        document.querySelector('.main_container_m') ? document.querySelector('.main_container_m').innerHTML = `
                    <div class="headings">
                        <h4 class="container_sm">Time(inc.Date)</h4>
                        <h4 class="container_sm">First Name(s)</h4>
                        <h4 class="container_sm">Surname(s)</h4>
                        <h4 class="container_sm">DOB(s)</h4>
                        <h4 class="container_sm">PPS No(s)</h4>
                    </div>
            ` : null
    }

    // Easily Adapted for any project using Dates, Days and Months
    static getMonthsLastDayNumByYear = (year, month) => {
        return new Date(year, month + 1, 0).getDate()
    }
    static getWeekDayNumFromDate = (year, month, day) => {
        return new Date(year, month, day).getDay()
    }
    static getNameOfTheMonthByNum = monthNum => {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        return months[monthNum]
    }
    static getNumOfTheMonthByName = monthName => {
        const months = {
            "January": 0,
            "February": 1,
            "March": 2,
            "April": 3,
            "May": 4,
            "June": 5,
            "July": 6,
            "August": 7,
            "September": 8,
            "October": 9,
            "November": 10,
            "December": 11
        }
        return months[monthName]
    }
    static getNameOfFirstDayOfTheMonth = firstDay => {
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

    static getNumOfDaysInTheMonth = (startDay, endDay) => {
        if (startDay === endDay) return [startDay];
        return [startDay, ...GeneralHelperMethodManager.getNumOfDaysInTheMonth(startDay + 1, endDay)];
    }

    static addZeroToNumberIfLowerThan10ReturnStringValue = number => {
        return number < 10 ? `0${number}` : `${number}`
    }

    static retrieveTodaysDate = () =>  moment().format(moment.HTML5_FMT.DATE).toString()

    static getAttendingPatientsDetailsForCSV = appointments => appointments.map(({ firstName , Surname, DOB}) => [firstName, Surname , DOB ])

    static objectToCSV = temporary_appointments => {
        let preferences = {
            filename: 'WHMC_Appointments.csv',
            data: [],
            headers: []
        };

        // Loop over the rows and get values for each of the headers  
        preferences.data = temporary_appointments.map(appointment => [`${appointment.DayDate} ${appointment.Month}`,`${appointment.Time}` , ...GeneralHelperMethodManager.getAttendingPatientsDetailsForCSV(appointment.Capacity)]);

        // Get the headers  
        preferences.headers = [...document.querySelectorAll('.container_sm')]?.slice(0,5)?.map(heading => heading?.innerHTML);

        return preferences
    }
    
}

class ValidationHelperManager {
    static checkVaccineAbility = () => {
        const vaccine_deciders = [...document.querySelectorAll('.vaccine_decider')];
        vaccine_deciders.map(vaccine_decider =>
            $(vaccine_decider).click(e => {
                if (e.target.value === "Yes") {
                    document.querySelector('.blocking_form_modal_outer')?.classList.add('displayVaccineAbilityBlockerFlex');
                }
            })
        )
    }

    static checkDOBOfUser = covid_term => {
        const DOB_Input = document.querySelector('.dob_container input[type=text]');
        $(DOB_Input).focusout(e => {
            new Date().getFullYear() - e.target.value.substring(6,) >= covid_term.Min_Age ? true : document.querySelector('.blocking_form_modal_outer').style.display = "flex";
        })
    }

    static isValidLogin = details => details.Username === "whmcadmin" && details.Password === "#whmcadmin"

    static isAdminLoggedIn = () =>  sessionStorage.getItem('AdminLoggedIn') ? null : window.location = "AdminLogin.html"
    
    static validateBookingDetails = appointment_Details => {
        return appointment_Details["Month"] !== undefined && appointment_Details["DayDate"] !== undefined && appointment_Details["Time"] !== undefined
    }
}


// Two Classes - One To take care of frontend and one for backend methods 

class FrontEndUI {
    constructor(appointments, covid_terms, clinic_slots , page_location) {

        // Set up Global Object to add details through as we move through form
        this.appointment_Details = {};

        // Get all Data Needed and leave equal to global variables
        this.appointments = appointments;
        this.clinic_slots = clinic_slots;
        this.covid_terms = covid_terms[0];

        // If Statement to identify which page we're on and what methods we need to kick off

        if(page_location === "home"){
            this.homePageInit();
        } else if(page_location === "userview"){
            this.userViewPageInit();
        } else {
            this.editAppointmentPageInit();
        }

    }

    // __________________________Start Of Home Page functions _______________________________

    homePageInit = () => {
        // Kicks off dealing with the months , days and timeslots
        this.dealWithMonthsContainers();

        // Validating and checking User Input 
        ValidationHelperManager.checkVaccineAbility();
        ValidationHelperManager.checkDOBOfUser(this.covid_terms);

        // Handling create appointment button click
        this.handleCreateAppointmentBtnClick();

        // Handling the Terms and Conditions Button Click 
        this.handleTermsAndConditionsBtnClick();
    }

    dealWithMonthsContainers = () => {

        // Get the Month Containers
        this.monthContainers = ui_helper_manager.getMonthContainers();

        // REVIEW: Display the past months from a certain month
        this.displayPastMonthsFromCovidTermMonth()

        // Get the month selected from page from monthContainers
        this.monthContainers.map(monthContainer =>
            $(monthContainer).click(e => {
                this.dealWithClickOnMonth(e.target);
            })
        )

    }

    displayPastMonthsFromMonthNow = async place => {
        let monthToday = new Date().getMonth()
        this.monthContainers.filter(monthContainer => monthContainer.dataset.month < monthToday).map(monthContainer => monthContainer.classList.add('disabled'))
        document.querySelector(`.month[data-month="${monthToday}"]`) ? document.querySelector(`.month[data-month="${monthToday}"]`).classList.add('monthActive') : null
        displayPastDays(document.querySelector(`.month[data-month="${monthToday}"]`), place)
    }

    displayPastMonthsFromCovidTermMonth = () => {
        let covid_term_month = this.covid_terms.Month
        this.monthContainers.filter(monthContainer => monthContainer.dataset.month < GeneralHelperMethodManager.getNumOfTheMonthByName(covid_term_month)).map(monthContainer => monthContainer.classList.add('disabled'))
        document.querySelector(`.month[data-month="${GeneralHelperMethodManager.getNumOfTheMonthByName(covid_term_month)}"]`) ? document.querySelector(`.month[data-month="${GeneralHelperMethodManager.getNumOfTheMonthByName(covid_term_month)}"]`).classList.add('monthActive') : null
    }

    dealWithClickOnMonth = selectedMonth => {

        // Styles the month selected and ones that aren't accordingly

        // Takes off class off all of them first
        this.monthContainers.map(monthContainer => {
            monthContainer.classList.remove('monthActive')
            monthContainer.classList.remove('monthInActive')
        })

        // Then adds inactive to those that aren't selected
        this.monthContainers.filter(monthContainer => monthContainer !== selectedMonth).map(monthContainer => {
            monthContainer.classList.add('monthInActive')
        })

        // Adds Active to the month that is selected
        selectedMonth.classList.add('monthActive')

        // Get month Selected Object and leaves it as a class variable for use in other methods
        this.monthSelected = GeneralHelperMethodManager.createMonthObjectFromMonthSelected(selectedMonth.dataset.month)
        this.appointment_Details["Month"] = this.monthSelected.Name

        // Move Program Onto the Day Containers and Deal with them 
        this.dealWithDayContainers();

    }

    dealWithDayContainers = () => {

        // Fill Days Into Calendar Using Month Selected Data
        this.fillDaysIntoCalendarUsingMonthSelectedData()

        // Get the day selected from page from dayContainers
        this.dayContainers.map(dayContainer =>
            $(dayContainer).click(e => {
                this.dealWithClickOnDay(e.target);
            })
        )
    }

    fillDaysIntoCalendarUsingMonthSelectedData = () => {

        // Making the actual calendar in these lines
        document.querySelector('.calendar_container_m') ? document.querySelector('.calendar_container_m')?.classList?.add('displayCalendarBlock') : null
        let daysOfWeek = `
                <h3 class= "dayOfWeek">Monday</h3>
                <h3 class= "dayOfWeek">Tuesday</h3>
                <h3 class= "dayOfWeek">Wednesday</h3>
                <h3 class= "dayOfWeek">Thursday</h3>
                <h3 class= "dayOfWeek">Friday</h3>
                <h3 class= "dayOfWeek">Saturday</h3>
                <h3 class= "dayOfWeek">Sunday</h3>
            `,
            margin = ``,
            numberOfDays;
        if (this.monthSelected.WeekDayNameOfFirstDay !== "Monday") margin = `<div class="margin"></div>`
        numberOfDays = this.monthSelected.NumOfDays.map(day => {
            let dayOfWeek = GeneralHelperMethodManager.getWeekDayNumFromDate(new Date().getFullYear(), this.monthSelected.Number, day)
            dayOfWeek = GeneralHelperMethodManager.getNameOfFirstDayOfTheMonth(dayOfWeek);
            return `<div class="day" data-day= "${dayOfWeek}" data-month="${this.monthSelected.Name}">${day}</div>`
        }).join("")
        document.querySelector('.calendar_container') ? document.querySelector('.calendar_container').innerHTML = daysOfWeek + margin + numberOfDays : null

        // Get the margin between first day based on name of day it is
        ui_helper_manager.getSpanAmountByFirstDayOfMonth(this.monthSelected.WeekDayNameOfFirstDay)

        // Get the Day Containers
        this.dayContainers = ui_helper_manager.getDayContainersFromCalendar();

        // REVIEW: Display Irrelevant Days - Past Days From Certain Date and Sundays
        this.displayPastDaysFromCovidTermDate();
        this.disableSundaysFromDaysCalendar();

    }

    displayPastDaysFromDateNow = () => {

        // Get Todays Date and disabling dates behind this date
        let dayToday = new Date().getDate();
        if (dayToday !== null) {
            this.dayContainers.filter(dayContainer => Number(dayContainer.innerHTML) < dayToday).map(dayContainer => dayContainer.classList.add('disabled'))
        }
    }

    displayPastDaysFromCovidTermDate = () => {

        // NOTE: Number(this.covid_terms.Date).toString())
        // NOTE: Cool little trick I did here, when dealing with a string that has a 0 in it like the covid_term_date does "04",
        // NOTE: Turn the String into a number with Number("04") which makes it 4 then back into a String which makes it "4"

        // Get The Covid Terms Date and disabling dates behind this date
        if (this.covid_terms.Date !== null) {
            this.dayContainers.filter(dayContainer => Number(dayContainer.innerHTML) < Number(this.covid_terms.Date)).map(dayContainer => dayContainer.classList.add('disabled'))
        }
    }

    disableSundaysFromDaysCalendar = () => {
        this.dayContainers.filter(dayContainer => dayContainer.dataset.day === "Sunday").map(dayContainer => {
            dayContainer.classList.add('sundayDisabled')
            dayContainer.classList.add('disabled')
        })
    }

    dealWithClickOnDay = selectedDay => {
        // Styles the day selected and ones that aren't accordingly

        // Takes off class off all of them first
        this.dayContainers.map(dayContainer => {
            dayContainer.classList.remove('dayActive')
            dayContainer.classList.remove('dayInActive')
        })

        // Then adds inactive to those that aren't selected
        this.dayContainers.filter(dayContainer => dayContainer !== selectedDay).map(dayContainer => {
            dayContainer.classList.add('dayInActive')
        })

        // Adds Active to the day that is selected
        selectedDay.classList.add('dayActive')

        // Get day Selected Object and leaves it as a class variable for use in other methods
        this.daySelected = GeneralHelperMethodManager.createDayObjectFromDaySelected(selectedDay)
        this.appointment_Details["DayName"] = this.daySelected.day
        this.appointment_Details["DayDate"] = this.daySelected.date

        // Move Program Onto the Time Containers and Deal with them 
        this.dealWithTimeContainers();
    }

    dealWithTimeContainers = () => {

        // Make the Timeslot Containers
        let timeSlots = ui_helper_manager.makeTimeslots(moment().startOf('day').add(9, 'h'), [], 10)

        // Display the Timeslot Containers
        this.fillInTimeslotContainers(timeSlots)

        // Get the Timeslot Containers and leave equal to a class variable 
        this.timeSlotContainers = ui_helper_manager.getTimeSlotContainers()

        // Making them all orange and disabled first and then will check against the appointments
        this.timeSlotContainers.map(timeslot_container => {
            timeslot_container.classList.add('disabled')
            timeslot_container.classList.add('orange_disabled')
        })

        // Check their times against Clinic Hours and Capacity
        this.checkTimeslotsAgainstClinicPreferences()
        // checkTime(new Date().getHours())

        // Get the Time selected from page from TimeSlotContainers
        this.timeSlotContainers.map(timeSlotContainer =>
            $(timeSlotContainer).click(e => {
                this.dealWithClickOnTime(e.target);
            })
        )


    }

    fillInTimeslotContainers = timeSlots => {

        // Make the actual Time Slot Containers 
        let timeSlotContainers = null;
        document.querySelector('.time_slot_container_m') ? document.querySelector('.time_slot_container_m')?.classList.add('displayTimeSlotBlock') : null
        timeSlotContainers = timeSlots.map(timeSlot =>
            `<div class="timeslot" data-time="${timeSlot}">${timeSlot}</div>`
        ).join("")
        document.querySelector('.time_slot_container') ? document.querySelector('.time_slot_container').innerHTML = timeSlotContainers : null

    }

    checkTimeslotsAgainstClinicPreferences = () => {
        // This just checks if the date picked is within the date slots that the clinic picks
        // 1) If it is - filters the timeslots availability by Capacity of equal or more than the number of providers * 2
        // 2) Else - filters the timeslots availability by Capacity of equal or more than 2

        for (const clinicSlot of this.clinic_slots)
            if (this.appointment_Details["Month"] == clinicSlot.Month) {
                for (const date of clinicSlot.Dates)
                    if (this.appointment_Details["DayDate"] == date) {
                        for (const hour of clinicSlot.Hours) {
                            this.timeSlotContainers
                                .filter(timeslot_container => timeslot_container.innerHTML == hour)
                                .map(appointment_s => {
                                    appointment_s.classList.remove("disabled")
                                    appointment_s.classList.remove("orange_disabled")
                                })
                        }
                        // REVIEW: Changed this - number of providers 27/02/2021
                        this.appointments
                            .filter(appointment => appointment.DayDate == date)
                            .filter(appointment => appointment.Capacity.length >= parseInt(clinicSlot.Providers))
                            .map(appointment_s => {
                                document.querySelector(`.timeslot[data-time="${appointment_s.Time}"]`).classList.add("disabled")
                                document.querySelector(`.timeslot[data-time="${appointment_s.Time}"]`).classList.add("full_disabled")
                            })
                    }
            }
    }

    dealWithClickOnTime = selectedTime => {
        // Styles the time selected and ones that aren't accordingly

        // Takes off class off all of them first
        this.timeSlotContainers.map(timeSlotContainer => {
            timeSlotContainer.classList.remove('timeSlotActive')
            timeSlotContainer.classList.remove('timeSlotInActive')
        })

        // Then adds inactive to those that aren't selected
        this.timeSlotContainers.filter(timeSlotContainer => timeSlotContainer !== selectedTime).map(timeSlotContainer => {
            timeSlotContainer.classList.add('timeSlotInActive')
        })

        // Adds Active to the time that is selected
        selectedTime.classList.add('timeSlotActive')

        // Get day Selected Object and leaves it as a class variable for use in other methods
        this.timeSelected = selectedTime.innerHTML
        this.appointment_Details["Time"] = this.timeSelected

    }

    handleCreateAppointmentBtnClick = () => {
        const form = document.querySelector('form');
        $(form).submit(e => {
            e.preventDefault()

            // Checks Everythings in order with the appointment so date , time, month
            let bookingDetailsValidated = ValidationHelperManager.validateBookingDetails(this.appointment_Details)
            if (!bookingDetailsValidated) {
                alert("Please pick a valid month, date and time before progressing")
                return
            }

            // Getting the form Data and filling it to appointment_Details
            let formData = GeneralHelperMethodManager.getFormDataFromForm(form)

            //if (formData.get('card_decision') === null) errorMessages.push("Please fill in PPS Number or select the medical card option above")
            // if (formData.get('card_decision') === null || formData.get('destination_decision') === null) errorMessages.push("Please fill in PPS Number or select the medical card option above")
            //whichCard(formData.get('card_decision'), formData)
            // whichDestination(formData.get('destination_decision'), formData)
            if (errorMessages.length !== 0) {
                errorMessages.filter((error, index) => errorMessages.lastIndexOf(error) === index)
                    .map(error => alert(error))
                errorMessages = []
                return
            }

            // Filling the appointment Details with my values
            this.appointment_Details["firstName"] = formData.get('firstName')
            this.appointment_Details["Email"] = formData.get('Email')
            this.appointment_Details["Surname"] = formData.get('Surname')
            this.appointment_Details["Mobile"] = formData.get('Mobile')
            this.appointment_Details["DOB"] = formData.get('DOB')
            this.appointment_Details["Gender"] = formData.get('Gender')
            this.appointment_Details["Street_Address"] = formData.get('Address_Line_One')
            this.appointment_Details["City_Address"] = formData.get('Address_Line_Two')
            this.appointment_Details["County"] = formData.get('County')
            this.appointment_Details["Alternate_Number"] = formData.get('Alternate_Mobile')
            this.appointment_Details["Bleeding_Disorder_Or_Anticoagulation"] = formData.get('Bleeding_Disorder_decision')

            // Moving onto show the create appointment pop up
            this.displayCreateAppointmentPopup()

            // And thus with that actually handling clicking confirm button to create appointment
            this.handleConfirmCreateAppointmentBtnClick();
        })
    }

    displayCreateAppointmentPopup = () => {
        let modal = this.fillinModalDetails()
        document.querySelector('.appointment_made_modal') ? document.querySelector('.appointment_made_modal').innerHTML = modal : null
        document.querySelector('.appointment_made_modal') ? document.querySelector('.appointment_made_modal').classList.add('displayAppointmentMadeModalBlock') : null
        this.cancelModal(document.querySelector('.appointment_made_modal'))
    }

    fillinModalDetails = () => {
        return `<div class="appointment_made_modal_content">
                    <h2>Hi ${this.appointment_Details.firstName} ${this.appointment_Details.Surname},</h2>
                    <h4>You requested an appointment for</h4>
                    <div class="date_time_container">
                        <h3><strong>Date :</strong> ${this.appointment_Details.DayName} ${this.appointment_Details.DayDate} ${this.appointment_Details.Month}</h3>
                        <h3><strong>Time :</strong> ${this.appointment_Details.Time}</h3>
                    </div>
                    <div class="btns_container">
                        <a class="see_all_appointments_btn">Confirm</a>
                        <a class="cancelApptBtn">Cancel</a>
                    </div>
                </div>`
    }

    cancelModal = modal => {
        const cancel_btn = document.querySelector('.cancelApptBtn')
        $(cancel_btn).click(() => {
            modal.classList.add('noneDisplayAppointmentMadeModal')
        })
    }

    handleConfirmCreateAppointmentBtnClick = () => {
        const actual_create_btn = document.querySelector('.see_all_appointments_btn');
        $(actual_create_btn).click(e => {    
            appointments_manager.createAppointment(this.appointment_Details)
        })
    } 

    handleTermsAndConditionsBtnClick = () => {
        const terms_btn = document.querySelector('.open_terms_btn')
        $(terms_btn).click(e => {
            openModal()
        })
    }

    // __________________________End Of Home Page functions _______________________________

    // __________________________Start Of UserView Page functions _______________________________

    userViewPageInit = () => {
        // Display the Single Appointment User View 
        this.displaySingleAppointmentUserView();

    }

    displaySingleAppointmentUserView = async() => {
        // This part up here is just creating the single appointment display container view 
        const apptContainer = document.querySelector('.appointment_display_container_inner'),
        id = GeneralHelperMethodManager.getQueryParamsFromURL().get("id"),
        {data: single_user_by_id} = await user_manager.readSingleUserById(id),
        appointmentsData = single_user_by_id.Appointments.map(appt =>  
            `<div class="appointment_container">
                <div class="first_container">
                    <div class="date_square">
                        <h5>${appt.Month}</h5>
                        ${appt.DayDate}
                    </div>
                    <div class="user_details_container">
                        <div class="name_container">
                            <h2>Name: ${single_user_by_id.firstName} ${single_user_by_id.Surname}</h2>
                        </div>
                        <div class="dob_container">
                            <h2>DOB: ${single_user_by_id.DOB}</h2>
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
                        <a class="update_btn action_btn" href="edit.html?id=${appt._id}&userId=${single_user_by_id._id}">Edit</a>
                        <div class="delete_btn action_btn" data-appt="${appt._id}">Cancel</div>
                    </div>
                </div>
            </div>
            `
        );
        apptContainer?.insertAdjacentHTML('beforeend',appointmentsData)

        // Handling the delete page btn click 
        this.handleDeleteBtnUserViewClick(single_user_by_id);
        
        // Handling the userview page print btn click 
        this.handlePrintBtnUserViewClick();
    }

    handleDeleteBtnUserViewClick = single_user_by_id => {
        $(document.querySelector('.delete_btn')).click(e => {
            e.preventDefault();
            appointments_manager.deleteAppointment(e.currentTarget.dataset.appt , single_user_by_id._id, "Client")
        })
    }

    handlePrintBtnUserViewClick = () => {
        const print_btns = ui_helper_manager.getPrintBtns();
        ui_helper_manager.printPage(print_btns);
    }

    // __________________________End Of UserView Page functions _______________________________

    // __________________________Start Of Edit Page functions _______________________________

    editAppointmentPageInit = () => {
        // Kicks off dealing with the months , days and timeslots
        this.dealWithMonthsContainers();

        // Deals with the submitting of the edit page form 
        this.dealWithFormUpdateEditPage();
    }

    dealWithFormUpdateEditPage = () => {
        const formUpdate = document.querySelector('.form_Update'),
            user_id = GeneralHelperMethodManager.getQueryParamsFromURL().get("userId"),
            appointment_id = GeneralHelperMethodManager.getQueryParamsFromURL().get("id");

        $(formUpdate).submit(e => {

            e.preventDefault()

            let bookingDetailsValidated = ValidationHelperManager.validateBookingDetails(this.appointment_Details)
            if (!bookingDetailsValidated) {
                alert("Please pick a valid month, date and time before progressing")
                return
            }

            this.appointment_Details["userId"] = user_id
            appointments_manager.updateAppointment(appointment_id, this.appointment_Details)
        })
    }

    // __________________________End Of Edit Page functions _______________________________


}

class BackendUI {
    constructor(appointments, covid_terms, clinic_slots, users, page_location) {

         // Get all Data Needed and leave equal to global variables
         this.appointments = appointments;
         this.clinic_slots = clinic_slots;
         this.covid_terms = covid_terms[0];
         this.users = users;
 
         // Switch Statement to identify which page we're on and what methods we need to kick off (more than 3 conditions)
        switch (page_location) {
            case "adminlogin":
                this.adminLoginPageInit();
                break;
            case "adminhome":
                this.adminHomePageInit();
                break;
            case "adminclinichome":
                this.adminClinicHomePageInit();
                break;
            case "adminclinicadd":
                this.adminClinicAddPreferencesPageInit();
                break;
            case "adminclinicupdate":
                this.adminClinicUpdatePreferencesPageInit();
                break;
        }


    }

    // __________________________Start Of Admin Login Page functions _______________________________

    adminLoginPageInit = () => {

        // Logging in the admin user 
        this.handleAdminLoginBtnClick();
    }

    handleAdminLoginBtnClick = () => {
        const loginForm = document.querySelector('.login_form')
        $(loginForm).submit(e => {
            let loginDetails = {
                Username: $('#username_input').val(),
                Password: $('#password_input').val()
            }
            e.preventDefault()
            if(!ValidationHelperManager.isValidLogin(loginDetails)) {
                alert("Your username or password is invalid")
                return
            }
            sessionStorage.setItem("AdminLoggedIn", true);
            window.location = "adminHome.html"
        })
    }

    // __________________________End Of Admin Login Page functions _______________________________



    // __________________________Start Of Admin Home Page functions _______________________________

    adminHomePageInit = () => {

        // Checking whether admin is logged in or not first
        ValidationHelperManager.isAdminLoggedIn()

        //Allow Admin To logout 
        ui_helper_manager.logoutAdmin()

        // Deal With Tab Change On Side Of Page
        this.adminTab = "Appointments"
        ui_helper_manager.dealWithAdminTabsChange(this.adminTab);

        // REVIEW: Fill the Date Picker and Appointment Table Records With Default Values 
        /**
         * Either Covid Term Date or Date Today
         */
        this.getDefaultDatePickerAndAppointmentTableRecords();

       // Deal With Change Of Date In Date Picker
       $(document.querySelector('#date_picker_input')).on('change', () => {
            this.dealWithDatePickerChangeAdminHome()
        })

        // Deal With Search In Search Bar 
        $(document.querySelector('#search_input')).on('input change', e => {
            this.dealWithSearchChange(e.target.value)
        })
        
        // Deal With Export To CSV Button Click 
        $(document.querySelector('.download_csv_btn')).click(e => {
            this.dealWithCSVButtonClickAdminHome();
        })

        // const print_btn = [...document.querySelectorAll('.print_btn')];
        // printPage(print_btn)
        // await checkDelete()
        // await dealWithSingleRecordPick();

    }

    

    getDefaultDatePickerAndAppointmentTableRecords = () => {
        // REVIEW: Fill Value of Date Time Picker With A Date - Either Todays Date or Covid Term Date
        document.querySelector('#date_picker_input').value = this.fillValueOfPickerWithCovidTermDate();

        // Deals With Retrieving Data Picker Values , Filtering Records By Them and Displaying Records In Table
        this.retrieveFilterDisplayDataFromDataPicker();
    }

    retrieveFilterDisplayDataFromDataPicker = () => {

        // TODO: Put This into the update Covid terms date picker function
        // Create A Date Object From the Values in the Date Picker
        let date_picker_date_object =  GeneralHelperMethodManager.createDateObjectFromDatePicker();

        // Filter the Appointments by date Object Values 
        let filtered_appointments_from_date_picker_values = GeneralHelperMethodManager.filterAppointmentsByDatePickerDetails(this.appointments, date_picker_date_object);

        // Display Data in Table In Relation To Date Set In Picker 
        this.displayAppointmentsInTable(filtered_appointments_from_date_picker_values);
        
    }

    fillValueOfPickerWithCovidTermDate = () => {

        // Don't Have Year In Covid Terms So Have To get it
        let year = new Date().getFullYear(),
        month = GeneralHelperMethodManager.getNumOfTheMonthByName(this.covid_terms.Month) + 1,
        date = this.covid_terms.Date;

        // Use the helper method to distinguish whether number is "4" or "04" which is needed for date formatting
        month = GeneralHelperMethodManager.addZeroToNumberIfLowerThan10ReturnStringValue(month)

        // Returning Covid Term Date Value to be put in Date Picker
        return `${year}-${month}-${date}`;
    }

    fillValueOfPickerWithTodaysDate = () => {
        return GeneralHelperMethodManager.retrieveTodaysDate()
    }

    displayAppointmentsInTable = async filtered_appointments_from_date_picker_values => {

        // Retrieve Totals For Displaying Overall Number Of Appointments and Running Totals for Appointments On Specific Day
        const running_number_of_patients_total = GeneralHelperMethodManager.retrieveRunningAppointmentsTotal(filtered_appointments_from_date_picker_values),
            overall__number_of_appointments_total = GeneralHelperMethodManager.retrieveOverallAppointmentsTotal(this.appointments);

        // Sort Appointments By Time Before Displayed
        const appointments_sorted_by_time = GeneralHelperMethodManager.sortAppointmentsBeingDisplayedByTime(filtered_appointments_from_date_picker_values);
        this.temporary_appointments = appointments_sorted_by_time

        const appointmentsHTML = appointments_sorted_by_time?.map(appointment => {
            if(appointment.Capacity.length >= 2) {
                return  `  
                    <div class="appointment_details span" data-id="${appointment._id}">
                        <h3 class="time" data-capacity="${appointment.Capacity.length}"><little>${appointment.DayDate} / ${GeneralHelperMethodManager.getNumOfTheMonthByName(appointment.Month) + 1}</little>${appointment.Time}</h3>
                        ${ui_helper_manager.makeTableRowFromUserDetailsAdminHomePage(appointment.Capacity, appointment._id)}
                    </div>
                    `
            } else {
                return  `  
                    <div class="appointment_details" data-id="${appointment._id}">
                        <h3 class="time" data-capacity="${appointment.Capacity.length}"><little>${appointment.DayDate} / ${GeneralHelperMethodManager.getNumOfTheMonthByName(appointment.Month) + 1}</little>${appointment.Time}</h3>
                        ${ui_helper_manager.makeTableRowFromUserDetailsAdminHomePage(appointment.Capacity, appointment._id)}
                    </div>
                    `
            }
        }).join("");


        /**
         * Display Our Data Here  
         * - Overall No Of Appts, 
         * - Running Total Of Appts For Day Specified, 
         * - Table With All Appointments for Day Specified
         */ 
        document.querySelector('.main_container_m')?.insertAdjacentHTML('beforeend', appointmentsHTML)
        document.querySelector('.numberOfUsers') ? document.querySelector('.numberOfUsers').innerHTML = `Number Of Patients: ${running_number_of_patients_total}` : false
        document.querySelector('.numberOfAppointments') ? document.querySelector('.numberOfAppointments').innerHTML = `Overall No. Of Appointments: ${overall__number_of_appointments_total}` : false
        
        // Checking Capacity of Appointment for Table Formatting
        ui_helper_manager.checkCapacityForTableFormattingProperly(filtered_appointments_from_date_picker_values)

    }

    dealWithDatePickerChangeAdminHome  = () => {
        // Resetting the table back to only the headings 
        GeneralHelperMethodManager.resettingAppointmentsDataTableBackToOnlyHeadings();

        // Deals With Retrieving Data Picker Values , Filtering Records By Them and Displaying Records In Table
        this.retrieveFilterDisplayDataFromDataPicker();
    }


    dealWithSearchChange = searchValue => {

        // Resetting the table back to the Headings
        GeneralHelperMethodManager.resettingAppointmentsDataTableBackToOnlyHeadings();
        
        // Trimming down searchValue and Making sure it's not null
        searchValue = GeneralHelperMethodManager.trimAndVerifySearchValue(searchValue);

        let matched_records_from_search_value = GeneralHelperMethodManager.checkAppointmentAndUserRecordsInTableAgainst(this.appointments , searchValue)
        matched_records_from_search_value?.length === 0 ? this.getDefaultDatePickerAndAppointmentTableRecords() : this.displayAppointmentsInTable(matched_records_from_search_value)
    }

    dealWithCSVButtonClickAdminHome = () => {
        /**
         * Exporting To CSV 
         * Need Columns And Rows
         * Retrieves the Headers For Columns 
         * Retrieves the Values for Rows 
         */
        const my_csv_preferences = GeneralHelperMethodManager.objectToCSV(this.temporary_appointments)

        // Runs the function to export the CSV
        this.downloadCSV(my_csv_preferences)
    }

    downloadCSV = async(preferences, default_filename = 'export.csv')  => {

        // Setting the filename of the CSV file if not default
        let filename = preferences?.filename || default_filename,

        // Setting out what would be the columns in CSV file or none
        headers = preferences?.headers || null;

        // Using PaPa Parse to Turn JSON into a CSV String To be made into CSV File
        let csv;
        await Papa.unparse({ data: preferences?.data, fields: headers}) !== null  ? csv = await Papa.unparse({ data: preferences?.data, fields: headers}) : csv = null
        if (csv == null) return;

        // Turning the String into a CSV Blob File so it can be downloaded on button click
        var blob = new Blob([csv], {type: 'text/csv'});

        // Back Tracking just to support IE and other outdated browsers (Backwards Compatability)
        if (window.navigator.msSaveOrOpenBlob)  window.navigator.msSaveBlob(blob, args.filename);
        else {
            var a = window.document.createElement("a");
            a.href = window.URL.createObjectURL(blob, {type: "text/plain"});
            a.download = filename;
            document.body.appendChild(a);
            a.click();  
            document.body.removeChild(a);
        } 
    }
        

    // __________________________End Of Admin Home Page functions _______________________________




    // __________________________Start Of Admin Clinic Home Page functions _______________________________



    // __________________________End Of Admin Clinic Home  Page functions _______________________________




    // __________________________Start Of Admin Clinic Add Preferences Page functions _______________________________



    // __________________________End Of Admin Clinic Add Preferences Page functions _______________________________



    // __________________________Start Of Admin Clinic Update Preferences Page  functions _______________________________



    // __________________________End Of Admin Clinic Update Preferences Page  functions _______________________________
    
}

// Overall Initialization Method

const covidWebAppInit = async (user_location, page_location) => {
    const appointments = await appointments_manager.readAllAppointments(),
        clinic_slots = await clinic_manager.readAllClinicSlots(),
        covid_terms = await covid_terms_manager.readAllCovidTerms(),
        // TODO: Need to get the Users in here through the read all Users Endpoint
        // EDIT: Added in these routes - 28/02/2021 12:50
        users = await user_manager.readAllUsers();

    // This if statement line gets it all kicking off
    if (user_location === "Client") new FrontEndUI(appointments, covid_terms, clinic_slots, page_location);
    else new BackendUI(appointments, covid_terms, clinic_slots, users, page_location);
}


// Global Variable Declarations, Class and Function Definitions
const local_url = "http://localhost:8000/",
    heroku_url = "https://whmc-covid-server.herokuapp.com/",
    errorMessages = [],
    appointments_manager = new AppointmentManager(),
    covid_terms_manager = new CovidTermsManager(),
    user_manager = new UserManager(),
    clinic_manager = new ClinicManager(),
    ui_helper_manager = new UIHelperMethodManager();


// Initialization Methods
$(document).ready(() => {
    switch (true) {
        case (/(?:^|\W)index(?:$|\W)/).test(window.location.pathname.toLowerCase()) || (/(?:^|\W)\/(?:$|\W)/).test(window.location.pathname.toLowerCase()):
            // Web App Initialization
            covidWebAppInit("Client" , "home")
            break
        case (/(?:^|\W)edit(?:$|\W)/).test(window.location.pathname.toLowerCase()):
            // Web App Initialization
            covidWebAppInit("Client" , "edit")
            break
        case (/(?:^|\W)userview(?:$|\W)/).test(window.location.pathname.toLowerCase()):
            // Web App Initialization
            covidWebAppInit("Client", "userview")
            break
        case (/(?:^|\W)adminlogin(?:$|\W)/).test(window.location.pathname.toLowerCase()):
            // Web App Initialization
            covidWebAppInit("Backend", "adminlogin")
            break
        case (/(?:^|\W)adminhome(?:$|\W)/).test(window.location.pathname.toLowerCase()):
            // Web App Initialization
            covidWebAppInit("Backend", "adminhome")
            break
        case (/(?:^|\W)adminclinichome(?:$|\W)/).test(window.location.pathname.toLowerCase()):
            // Web App Initialization
            covidWebAppInit("Backend", "adminclinichome")
            break
        case (/(?:^|\W)adminclinicadd(?:$|\W)/).test(window.location.pathname.toLowerCase()):
            // Web App Initialization
            covidWebAppInit("Backend" , "adminclinicadd")
            break
        case (/(?:^|\W)adminclinicupdate(?:$|\W)/).test(window.location.pathname.toLowerCase()):
            // Web App Initialization
            covidWebAppInit("Backend" , "adminclinicupdate")
            break
    }
})