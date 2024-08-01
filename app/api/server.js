const express = require('express');
const app = express();
const port = 4000;
const dbOps    = require('./dbOps');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const apierrorlog = require('../classlibrary/apierrorlog.ts');
const errorLogger = new apierrorlog();

app.use(express.static(path.join(__dirname,'/')));
app.use(bodyParser.json()); // Use body-parser to parse JSON bodies
app.use(cors()); // Enable CORS

//Get all client names 
app.get('/api/data', (req, res) => {
    try {
        dbOps.getClientProfile().then((result) => {
            if (result.length > 0) {
                res.status(200).json(result);
            } else {
                res.status(401).json({ success: false, message: 'Invalid email or password' });
            }
        }).catch((err) => {
            errorLogger.handleError(err);
            console.err('err', err);
        });
    } catch (err) {
        errorLogger.handleError(err);
        console.err('SQL err', err);
        res.status(500).json({ success: false, message: 'Server err' });
    }
});

// Endpoint to validate login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        dbOps.confirmLogin(email,password).then((result) => {
            if (result.length > 0) {
                res.status(200).json({ success: true, message: 'Login successful', user: result });
            } else {
                res.status(401).json({ success: false, message: 'Invalid email or password' });
            }
        }).catch((err) => {
            errorLogger.handleError(err);
            console.err('err', err);
        });
    } catch (err) {
        errorLogger.handleError(err);
        console.err('SQL err', err);
        res.status(500).json({ success: false, message: 'Server err' });
    }
});

// Endpoint to add client name and email
app.post('/api/addclient', async (req, res) => {
    const { email, firstName, lastName, startdate, enddate, hasOrder } = req.body;
    try {
        if (!email || !firstName || !lastName || !startdate || !enddate || !hasOrder) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }
        else {
                dbOps.insertClientDetail(email,firstName,lastName,startdate,enddate,hasOrder).then((result) => {
                    if (result) {
                        res.status(200).json({ success: true, message: 'Client entered successfully'});
                    } else {
                        res.status(401).json({ success: false, message: 'Something happened the client was not created. ' });
                    }
                }).catch((err) => {
                    errorLogger.handleError(err);
                    console.err('err', err);
                });
            }
    } catch (err) {
        errorLogger.handleError(err);
        console.err('SQL err', err);
        res.status(500).json({ success: false, message: 'Server err' });
    }
});

app.post('/api/addclientmeetevent', async (req, res) => {
    const { userEmail, date, time, userDesc} = req.body;
    try {
        if (!userEmail || !date || !time || !userDesc) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }
        else {
            dbOps.insertClientMeetDate(userEmail, date, time, userDesc).then((result) => {
                if (result > -1) {
                    res.status(200).json({ success: true, message: 'Client event entered successfully', eventId: result});
                } else {
                    res.status(401).json({ success: false, message: 'Something happened the event was not created. ' });
                }
            }).catch((err) => {
                errorLogger.handleError(err);
                console.err('err', err);
            });
        }
    } catch (err) {
        errorLogger.handleError(err);
        console.err('SQL err', err);
        res.status(500).json({ success: false, message: 'Server err' });
    }
});

app.post('/api/addclientmeeteventdate', async (req, res) => {
    const { email, date, time, description, id} = req.body;
    try {
        if (!email || !date || !time || !description) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }
        else {
            dbOps.insertClientMeetDateAdv(email, date, time, description, id).then((result) => {
                if (result > 0) {
                    res.status(200).json({ success: true, message: 'Appointment created successfully.', eventId: result});
                }else if(result  == 0){
                    res.status(200).json({ success: true, message: 'An appointment already exists for this email, date, and time.', eventId: result});
                }
                else {
                    res.status(401).json({ success: false, message: 'Something happened the event was not created. ' });
                }
            }).catch((err) => {
                errorLogger.handleError(err);
                console.err('err', err);
            });
        }
    } catch (err) {
        errorLogger.handleError(err);
        console.err('SQL err', err);
        res.status(500).json({ success: false, message: 'Server err' });
    }
});

app.post('/api/getclientdetail', async (req, res) => {
    const {ClientId} = req.body;
    try {
        if (!ClientId ) {
            return res.status(400).json({ success: false, message: 'Client Id does not exist.' });
        }else {
            dbOps.getClientDetailById(ClientId).then((result) => {
                if (result) {
                    res.status(200).json(result);
                } else {
                    res.status(401).json({ success: false, message: 'Something happened the client was not found. ' });
                }
            }).catch((err) => {
                errorLogger.handleError(err);
                console.err('err', err);
            });
        }
    } catch (err) {
        errorLogger.handleError(err);
        console.err('SQL err', err);
        res.status(500).json({ success: false, message: 'Server err' });
    }

});

app.post('/api/updateclientdetail', async (req, res) => {
    const {ClientId, email, planStart, planEnd, hasOrder } = req.body;
    try {
        if (!ClientId) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }
        else {
            dbOps.updateClientDetail(ClientId,email,planStart,planEnd,hasOrder).then((result) => {
                if (result > 0) {
                    res.status(200).json({ success: true, message: 'Client updated successfully',});
                } else {
                    res.status(401).json({ success: false, message: 'Something happened the client was not created. ' });
                }
            }).catch((err) => {
                errorLogger.handleError(err);
                console.err('err', err);
            });
        }
    } catch (err) {
        errorLogger.handleError(err);
        console.err('SQL err', err);
        res.status(500).json({ success: false, message: 'Server err' });
    }
});


app.post('/api/getscheduledata', async (req, res) => {
    const {monthOp} = req.body;
    try {
        if (!monthOp ) {
            return res.status(400).json({ success: false, message: 'Plese selct a month in the future.' });
        }else {
            dbOps.getEventsByMonth(monthOp).then((result) => {
                if (result) {
                    res.status(200).json({data: result});
                } else {
                    res.status(401).json({ success: false, message: 'Something happened the client was not found. ' });
                }
            }).catch((err) => {
                errorLogger.handleError(err);
                console.err('err', err);
            });
        }
    } catch (err) {
        errorLogger.handleError(err);
        console.err('SQL err', err);
        res.status(500).json({ success: false, message: 'Server err' });
    }

});

app.post('/api/getmyappts', async (req, res) => {
    const {email} = req.body;
    try {
        if (email === '' || email === undefined) {
            return res.status(400).json({ success: false, message: 'Plese selct a month in the future.' });
        }else {
            dbOps.getClientAppts(email).then((result) => {
                if (result) {
                    res.status(200).json({success: true,message: 'Client data was found. ',data: result});
                } else {
                    res.status(401).json({ success: false, message: 'Something happened the client was not found. ' });
                }
            }).catch((err) => {
                errorLogger.handleError(err);
                console.log('err', err);
            });
        }
    } catch (err) {
        errorLogger.handleError(err);
        console.log('SQL err', err);
        res.status(500).json({ success: false, message: 'Server err' });
    }

});

app.post('/api/getavailabilitybymonth', async (req, res) => {
    const {monthOp} = req.body;
    try {
        if (!monthOp ) {
            return res.status(400).json({ success: false, message: 'Plese selct a month in the future.' });
        }else {
            dbOps.getAvailabilityByMonth(monthOp).then((result) => {
                if (result) {
                    res.status(200).json({data: result});
                } else {
                    res.status(401).json({ success: false, message: 'Something happened the client was not found. ' });
                }
            }).catch((err) => {
                errorLogger.handleError(err);
                console.err('err', err);
            });
        }
    } catch (err) {
        errorLogger.handleError(err);
        console.err('SQL err', err);
        res.status(500).json({ success: false, message: 'Server err' });
    }
});

app.post('/api/getavailability', async (req, res) => {
    try {

        dbOps.getAvailability().then((result) => {
            if (result) {
                res.status(200).json({data: result});
            } else {
                res.status(401).json({ success: false, message: 'Something happened the client was not found. ' });
            }
        }).catch((err) => {
            errorLogger.handleError(err);
            console.err('err', err);
        });
    } catch (err) {
        errorLogger.handleError(err);
        console.err('SQL err', err);
        res.status(500).json({ success: false, message: 'Server err' });
    }
});

app.post('/api/getavailabilitybydate', async (req, res) => {
    const {dayDate} = req.body;
    try {
        if (!dayDate ) {
            return res.status(400).json({ success: false, message: 'Plese selct a date in the future.' });
        }else {
            dbOps.getAvailabilityByDate(dayDate).then((result) => {
                if (result) {
                    res.status(200).json({data: result});
                } else {
                    res.status(401).json({ success: false, message: 'Something happened the client was not found. ' });
                }
            }).catch((err) => {
                errorLogger.handleError(err);
                console.err('err', err);
            });
        }
    } catch (err) {
        errorLogger.handleError(err);
        console.err('SQL err', err);
        res.status(500).json({ success: false, message: 'Server err' });
    }
});

app.post('/api/isvalidclientemail', async (req, res) => {
    try {
        const {userEmail} = req.body;

        if (userEmail === undefined ) {
            return res.status(400).json({ success: false, message: 'Client email is required. Please enter the client email.' });
        }
        else if(!isValidEmail(userEmail)){
            return res.status(400).json({ success: false, message: 'This is not a valid email format. Pleas enter a valid email.' });
        }
        else {
            dbOps.isValidClientEmail(userEmail).then((result) => {
                if (result > 0) {
                    res.status(200).json({success: true, message: 'Email found. Select Next to continue to the next step. ', data: result});
                } else {
                    res.status(401).json({ success: false, message: 'Something happened the client was not found. Check the email and try again.' });
                }
            }).catch((err) => {
                errorLogger.handleError(err);
                console.err('err', err);
            });
        }
    } catch (err) {
        errorLogger.handleError(err);
        console.err('SQL err', err);
        res.status(500).json({ success: false, message: 'Server err' });
    }
});

app.post('/api/deleteavailability', async (req, res) => {
    const {Id} = req.body;
    try {
        if (!Id ) {
            return res.status(400).json({ success: false, message: 'Unable to remove that date.' });
        }else {
            dbOps.deleteAvailability(Id).then((result) => {
                if (result) {
                    res.status(200).json({Id: result});
                } else {
                    res.status(401).json({ success: false, message: 'Something happened the date was not removed. ' });
                }
            }).catch((err) => {
                errorLogger.handleError(err);
                console.err('err', err);
            });
        }
    } catch (err) {
        errorLogger.handleError(err);
        console.err('SQL err', err);
        res.status(500).json({ success: false, message: 'Server err' });
    }
});

app.post('/api/deletemeeting', async (req, res) => {
    const {Id} = req.body;
    try {
        if (!Id ) {
            return res.status(400).json({ success: false, message: 'Unable to remove that date.' });
        }else {
            dbOps.deleteMeeting(Id).then((result) => {
                if (result) {
                    res.status(200).json({Id: result});
                } else {
                    res.status(401).json({ success: false, message: 'Something happened the date was not removed. ' });
                }
            }).catch((err) => {
                errorLogger.handleError(err);
                console.err('err', err);
            });
        }
    } catch (err) {
        errorLogger.handleError(err);
        console.err('SQL err', err);
        res.status(500).json({ success: false, message: 'Server err' });
    }
});

app.post('/api/addavailability', async (req, res) => {
    const {date, time} = req.body;
    try {
        if (!date && !time) {
            return res.status(400).json({ success: false, message: 'Unable to remove that date.' });
        }else {
            dbOps.insertAvailability(date, time).then((result) => {
                if (result) {
                    res.status(200).json({Id: result});
                } else {
                    res.status(401).json({ success: false, message: 'Something happened the date was not removed. ' });
                }
            }).catch((err) => {
                errorLogger.handleError(err);
                console.err('err', err);
            });
        }
    } catch (err) {
        errorLogger.handleError(err);
        console.err('SQL err', err);
        res.status(500).json({ success: false, message: 'Server err' });
    }
});


const isValidEmail = async(email) => {
    var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    if(email.length>254)
        return false;

    var valid = emailRegex.test(email);
    if(!valid)
        return false;

    // Further checking of some things regex can't handle
    var parts = email.split("@");
    if(parts[0].length>64)
        return false;

    var domainParts = parts[1].split(".");
    if(domainParts.some(function(part) { return part.length>63; }))
        return false;

    return true;
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
