// These Classes take care of my network requests for different models in my web application
class AppointmentManager {
    createAppointment = async () => {
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
    updateAppointment = async (appt_id) => {
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
    updateCovidTerms = async (SelectedDateTime) => {
        try {
            await getCovidTerm()
            await axios.put(`${heroku_url}api/v1/covid_terms/${covid_term._id}`, { "Min_Age": covid_term.Min_Age, "Month": SelectedDateTime.MonthName, "Date": SelectedDateTime.Date })
        } catch (error) {
            console.log(error);
        }
    }
}

// TODO: Need to set up User Api Endpoints 
class UserManager {
    readSingleUserRecord = async userId => {
        let users = await axios.get(`${heroku_url}api/v1/appointments/details/${userId}`)
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
    getDayContainersFromCalendar = () => {
        return [...document.querySelectorAll('.day')];
    }
    getMonthContainers = () => {
        return [...document.querySelectorAll('.month')];
    }
    getTimeSlotContainers = () => {
        return [...document.querySelectorAll('.timeslot')]
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
}

class GeneralHelperMethodManager {

    // Can be used in any project
    static getQueryParamsFromURL = () => {
        const queryParams = new URLSearchParams(window.location.search)
        return queryParams
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
        let monthSelected = {
            "LastDayNum": GeneralHelperMethodManager.getMonthsLastDayNumByYear(new Date().getFullYear(), Number(monthNo)),
            "WeekDayNumOfFirstDay": GeneralHelperMethodManager.getWeekDayNumFromDate(new Date().getFullYear(), Number(monthNo), 1),
            "WeekDayNameOfFirstDay": GeneralHelperMethodManager.getNameOfFirstDayOfTheMonth(GeneralHelperMethodManager.getWeekDayNumFromDate(new Date().getFullYear(), Number(monthNo), 1)),
            "NumOfDays": GeneralHelperMethodManager.getNumOfDaysInTheMonth(1, GeneralHelperMethodManager.getMonthsLastDayNumByYear(new Date().getFullYear(), Number(monthNo))),
            "Name": GeneralHelperMethodManager.getNameOfTheMonthByNum(Number(monthNo)),
            "Number": monthNo
        }
        return monthSelected
    }
    static createDayObjectFromDaySelected = target => {
        let daySelected = {
            "date": target.innerHTML,
            "day": target.dataset.day
        }
        return daySelected
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
        ValidationHelperManager.checkDOBOfUser();
    }

    static checkDOBOfUser = () => {
        const DOB_Input = document.querySelector('.dob_container input[type=text]');
        $(DOB_Input).focusout(e => {
            new Date().getFullYear() - e.target.value.substring(6,) >= covid_term.Min_Age ? true : document.querySelector('.blocking_form_modal_outer').style.display = "flex";
        })
    }

    static isValidLogin = details => details.Username === "whmcadmin" && details.Password === "#whmcadmin"

    static validateBookingDetails = () => {
        return appointment_Details["Month"] !== undefined && appointment_Details["DayDate"] !== undefined && appointment_Details["Time"] !== undefined
    }
}


// Two Classes - One To take care of frontend and one for backend methods 

class FrontEndUI {
    constructor(appointments, covid_terms, clinic_slots) {

        // Set up Global Object to add details through as we move through form
        this.appointment_Details = {};

        // Get all Data Needed and leave equal to global variables
        this.appointments = appointments;
        this.clinic_slots = clinic_slots;
        this.covid_terms = covid_terms[0];

        // Kicks off dealing with the months , days and timeslots
        this.dealWithMonthsContainers();

        // Validating and checking User Input 
        ValidationHelperManager.checkVaccineAbility();

        // Handling create appointment button click
        this.handleCreateAppointmentBtnClick();

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
            let bookingDetailsValidated = ValidationHelperManager.validateBookingDetails()
            if (!bookingDetailsValidated) {
                alert("Please pick a valid month, date and time before progressing")
                return
            }

            // Getting the form Data and filling it to appointment_Details
            let formData = GeneralHelperMethodManager.getFormDataFromForm(form)

            //if (formData.get('card_decision') === null) errMessage.push("Please fill in PPS Number or select the medical card option above")
            // if (formData.get('card_decision') === null || formData.get('destination_decision') === null) errMessage.push("Please fill in PPS Number or select the medical card option above")
            //whichCard(formData.get('card_decision'), formData)
            // whichDestination(formData.get('destination_decision'), formData)
            if (errMessage.length !== 0) {
                errMessage.filter((error, index) => errMessage.lastIndexOf(error) === index)
                    .map(error => alert(error))
                errMessage = []
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
        cancelModal(document.querySelector('.appointment_made_modal'))
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
        let submitted = false
        $(actual_create_btn).click(e => {
            /**
             * Because of await making the call stack perform same thing again
             * This was making it send two requests and insert two records into the DB
             * This is a fix for this, 
             * Look for info or something that should have a value already from the first time
             */
            if (submitted) return
            submitted = true
    
            // Calls the method to perform the async function to post my data 
            makeAppointment()
        })
    } 



}

class BackendUI {
    constructor(appointments, covid_terms, clinic_slots, users) {

        // Get all Data Needed and leave equal to global variables
        this.appointments = appointments;
        this.clinic_slots = clinic_slots;
        this.covid_terms = covid_terms;


    }
}

// Overall Initialization Method

const covidWebAppInit = async user_location => {
    const appointments = await appointments_manager.readAllAppointments(),
        clinic_slots = await clinic_manager.readAllClinicSlots(),
        covid_terms = await covid_terms_manager.readAllCovidTerms();

    // TODO: Need to get the Users in here through the read all Users Endpoint
    const users = [];

    if (user_location === "Client") new FrontEndUI(appointments, covid_terms, clinic_slots);
    else new BackendUI(appointments, covid_terms, clinic_slots, users);
}


// Global Variable Declarations, Class and Function Definitions
const local_url = "http://localhost:8000/",
    heroku_url = "https://whmc-covid-server.herokuapp.com/",
    appointments_manager = new AppointmentManager(),
    covid_terms_manager = new CovidTermsManager(),
    user_manager = new UserManager(),
    clinic_manager = new ClinicManager(),
    ui_helper_manager = new UIHelperMethodManager();


// Initialization Methods
$(document).ready(() => {
    switch (true) {
        case (/(?:^|\W)index(?:$|\W)/).test(window.location.pathname.toLowerCase()) || (/(?:^|\W)\/(?:$|\W)/).test(window.location.pathname.toLowerCase()):
        case (/(?:^|\W)edit(?:$|\W)/).test(window.location.pathname.toLowerCase()):
        case (/(?:^|\W)userview(?:$|\W)/).test(window.location.pathname.toLowerCase()):
            // Web App Initialization
            covidWebAppInit("Client")
            break
        case (/(?:^|\W)adminhome(?:$|\W)/).test(window.location.pathname.toLowerCase()):
        case (/(?:^|\W)adminlogin(?:$|\W)/).test(window.location.pathname.toLowerCase()):
        case (/(?:^|\W)adminclinichome(?:$|\W)/).test(window.location.pathname.toLowerCase()):
        case (/(?:^|\W)adminclinicadd(?:$|\W)/).test(window.location.pathname.toLowerCase()):
        case (/(?:^|\W)adminclinicupdate(?:$|\W)/).test(window.location.pathname.toLowerCase()):
            covidWebAppInit("Backend")
            break
    }
})