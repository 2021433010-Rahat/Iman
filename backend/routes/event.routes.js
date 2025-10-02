import express from "express"
import {
    addEvent,
    checkGoogleFormConfig,
    checkGoogleMeetConfig,
    createGoogleMeet,
    deleteEvent,
    fetchEventParticipants,
    generateEventAnnouncement,
    generateEventRegistrationForm,
    generateGoogleForm,
    getEventGoogleMeets,
    getEventById,
    getUserEvents,
    sendBulkEventNotification,
    sendEventReminder,
    sendEventUpdate,
    testFormCreation,
    updateEvent,
    updateEventClassroom
} from "../controllers/event.controller.js"
import isAuth from "../middlewares/isAuth.js"

const eventRouter = express.Router()

console.log('=== REGISTERING EVENT ROUTES ===');

// Test route first to ensure basic routing works
eventRouter.get("/test", (req, res) => {
    res.json({ message: "Event routes working", timestamp: new Date().toISOString() });
});

// Configuration routes (static routes first)
eventRouter.get("/google-meet-config", checkGoogleMeetConfig)
eventRouter.get("/google-form-config", checkGoogleFormConfig) 
eventRouter.get("/test-form-creation", testFormCreation)

// Non-parameterized routes
eventRouter.get("/all", isAuth, getUserEvents)
eventRouter.post("/add", isAuth, addEvent)
eventRouter.post("/send-update", sendEventUpdate)
eventRouter.post("/bulk-notification", sendBulkEventNotification)
eventRouter.post("/send-reminder", sendEventReminder)
eventRouter.post("/generate-google-form", isAuth, generateGoogleForm)
eventRouter.post("/create-google-meet", isAuth, createGoogleMeet)
eventRouter.post("/generate-announcement", generateEventAnnouncement)

// Parameterized routes (put these after static routes)
eventRouter.get("/:eventId", isAuth, getEventById)
eventRouter.put("/update/:eventId", isAuth, updateEvent)
eventRouter.put("/update-classroom/:eventId", updateEventClassroom)
eventRouter.delete("/delete/:eventId", isAuth, deleteEvent)
eventRouter.get("/participants/:eventId", isAuth, fetchEventParticipants)
eventRouter.get("/:eventId/google-meets", isAuth, getEventGoogleMeets)
eventRouter.post("/:eventId/generate-registration-form", isAuth, generateEventRegistrationForm)

// Debug route
eventRouter.put("/update-classroom-test/:eventId", (req, res) => {
    res.json({ 
        message: "Classroom update route accessible", 
        eventId: req.params.eventId, 
        body: req.body 
    });
});

export default eventRouter