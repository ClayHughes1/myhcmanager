const express = require('express');
const app = express();
const port = 4000;
const dbOps    = require('./dbOps');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(express.static(path.join(__dirname,'/')));
app.use(bodyParser.json()); // Use body-parser to parse JSON bodies
app.use(cors()); // Enable CORS

//Get all client names 
app.get('/api/data', (req, res) => {
    try {
        dbOps.getClientProfile().then((result) => {
            if (result.length > 0) {
                // console.log('SENDING RSULTS............   '+JSON.stringify(result));
                res.status(200).json(result);
            } else {
                res.status(401).json({ success: false, message: 'Invalid email or password' });
            }
        }).catch((error) => {
            console.error('Error', error);
        });
    } catch (err) {
        console.error('SQL error', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }

    // console.log('getting data');
    // res.json(data);
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
        }).catch((error) => {
            console.error('Error', error);
        });
    } catch (err) {
        console.error('SQL error', err);
        res.status(500).json({ success: false, message: 'Server error' });
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
                    console.log('REESULLTS    \n'+result);
                    if (result) {
                        res.status(200).json({ success: true, message: 'Client entered successfully'});
                    } else {
                        res.status(401).json({ success: false, message: 'Something happened the client was not created. ' });
                    }
                }).catch((err) => {
                    console.log('ERROR \n'+err);
                    console.error('Error', err);
                });
            }
    } catch (err) {
        console.error('SQL error', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/api/addclientmeetevent', async (req, res) => {
    const { userEmail, date, time, userDesc} = req.body;
    try {
        console.log();
        if (!userEmail || !date || !time || !userDesc) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }
        else {
                dbOps.insertClientMeetDate(userEmail, date, time, userDesc).then((result) => {
                    console.log('REESULLTS    \n'+result);
                    if (result > -1) {
                        res.status(200).json({ success: true, message: 'Client event entered successfully', eventId: result});
                    } else {
                        res.status(401).json({ success: false, message: 'Something happened the event was not created. ' });
                    }
                }).catch((err) => {
                    console.log('ERROR \n'+err);
                    console.error('Error', err);
                });
            }
    } catch (err) {
        console.error('SQL error', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/api/getclientdetail', async (req, res) => {
    const {ClientId} = req.body;
    console.log('GETTING CLIENT DETAIL..........   \n'+ClientId);
    try {
        if (!ClientId ) {
            return res.status(400).json({ success: false, message: 'Client Id does not exist.' });
        }else {
            dbOps.getClientDetailById(ClientId).then((result) => {
                // console.log('REESULLTS    \n'+JSON.stringify(result));
                if (result) {
                    res.status(200).json(result);
                } else {
                    res.status(401).json({ success: false, message: 'Something happened the client was not found. ' });
                }
            }).catch((err) => {
                console.log('ERROR \n'+err);
                console.error('Error', err);
            });
        }
    } catch (error) {
        console.error('SQL error', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }

});

app.post('/api/updateclientdetail', async (req, res) => {
    const {ClientId, email, planStart, planEnd, hasOrder } = req.body;
    console.log(ClientId, email, planStart, planEnd, hasOrder);
    try {
        if (!ClientId) {
            console.log('STATUS 400');
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }
        else {
            console.log('calling db ops function............   \n',ClientId);
                dbOps.updateClientDetail(ClientId,email,planStart,planEnd,hasOrder).then((result) => {
                    if (result > 0) {
                        console.log('REESULLTS    \n'+JSON.stringify(result));

                        res.status(200).json({ success: true, message: 'Client updated successfully'});
                    } else {
                        res.status(401).json({ success: false, message: 'Something happened the client was not created. ' });
                    }
                }).catch((err) => {
                    console.log('ERROR \n'+err);
                    console.error('Error', err);
                });
            }
    } catch (err) {
        console.error('SQL error', err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});


app.post('/api/getscheduledata', async (req, res) => {
    const {monthOp} = req.body;
    console.log('GETTING CLIENT DETAIL..........   \n'+monthOp);
    try {
        if (!monthOp ) {
            return res.status(400).json({ success: false, message: 'Plese selct a month in the future.' });
        }else {
            dbOps.getEventsByMonth(monthOp).then((result) => {
                if (result) {
                    console.log('REESULLTS    \n'+JSON.stringify(result));
                    res.status(200).json({data: result});
                } else {
                    res.status(401).json({ success: false, message: 'Something happened the client was not found. ' });
                }
            }).catch((err) => {
                console.log('ERROR \n'+err);
                console.error('Error', err);
            });
        }
    } catch (error) {
        console.error('SQL error', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }

});

app.post('/api/getavailability', async (req, res) => {
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
                console.log('ERROR \n'+err);
                console.error('Error', err);
            });
        }
    } catch (error) {
        console.error('SQL error', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/api/getavailabilitybydate', async (req, res) => {
    const {dayDate} = req.body;
    console.log('by date.........  \n',dayDate);
    try {
        if (!dayDate ) {
            return res.status(400).json({ success: false, message: 'Plese selct a date in the future.' });
        }else {
            dbOps.getAvailabilityByDate(dayDate).then((result) => {
                if (result) {
                    console.log(JSON.stringify(result));
                    res.status(200).json({data: result});
                } else {
                    res.status(401).json({ success: false, message: 'Something happened the client was not found. ' });
                }
            }).catch((err) => {
                console.log('ERROR \n'+err);
                console.error('Error', err);
            });
        }
    } catch (error) {
        console.error('SQL error', error);
        res.status(500).json({ success: false, message: 'Server error' });
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
                console.log('ERROR \n'+err);
                console.error('Error', err);
            });
        }
    } catch (error) {
        console.error('SQL error', error);
        res.status(500).json({ success: false, message: 'Server error' });
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
                console.log('ERROR \n'+err);
                console.error('Error', err);
            });
        }
    } catch (error) {
        console.error('SQL error', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/api/addavailability', async (req, res) => {
    const {date, time} = req.body;
    try {
        console.log('INSERTING NEW AVAILABILITY   '+ date +'   '+ time);
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
                console.log('ERROR \n'+err);
                console.error('Error', err);
            });
        }
    } catch (error) {
        console.error('SQL error', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
